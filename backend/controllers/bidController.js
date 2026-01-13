const Bid = require("../models/Bid");
const Gig = require("../models/Gig");
const mongoose = require("mongoose");
//put bid 
exports.placeBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price)
      return res.status(400).json({ message: "All fields required" });

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open")
      return res.status(400).json({ message: "Gig not open for bidding" });

    if (gig.ownerId.toString() === req.user._id.toString())
      return res.status(403).json({ message: "You cannot bid on your own gig" });

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });
    //notify client in real-time
const clientId = gig.ownerId.toString();
const socketId = global.onlineUsers.get(clientId);

if (socketId) {
  global.io.to(socketId).emit("new-bid", {
    ...bid.toObject(),
    gigId: gigId.toString()
  });
}

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get bid for a gig
exports.getBidsForGig = async (req, res) => {
  try {
    const gigId = req.params.gigId;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email");

    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bidId = req.params.bidId;

    const bid = await Bid.findById(bidId).session(session);
    if (!bid) throw new Error("Bid not found");

    const gig = await Gig.findOne({ _id: bid.gigId, status: "open" }).session(session);
    if (!gig) throw new Error("Gig already assigned");

    if (gig.ownerId.toString() !== req.user._id.toString())
      throw new Error("Not authorized");

    await Gig.updateOne(
      { _id: gig._id },
      { status: "assigned" }
    ).session(session);

    await Bid.updateOne(
      { _id: bidId },
      { status: "hired" }
    ).session(session);

    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: "rejected" }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    // ✅ FETCH HIRED BID WITH DETAILS (after commit)
    const hiredBid = await Bid.findById(bidId).populate("freelancerId gigId");

    // 🔔 SOCKET NOTIFICATION
    const freelancerId = hiredBid.freelancerId._id.toString();
    const gigTitle = hiredBid.gigId.title;

    const socketId = global.onlineUsers.get(freelancerId);

    console.log("HIRING SOCKET CHECK:", freelancerId, socketId);

    if (socketId) {
      global.io.to(socketId).emit("hired", {
        message: `🎉 You have been hired for "${gigTitle}"`,
        gigId: hiredBid.gigId._id
      });
    }

    res.json({ message: "Freelancer hired successfully" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};
