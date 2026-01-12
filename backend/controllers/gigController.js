const Gig = require("../models/Gig");

//CREATE GIG
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget)
      return res.status(400).json({ message: "All fields required" });

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GET ALL OPEN GIGS(SEARCH)
exports.getGigs = async (req, res) => {
  try {
    const search = req.query.search || "";

    const gigs = await Gig.find({
      status: "open",
      title: { $regex: search, $options: "i" }
    }).populate("ownerId", "name email");

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GET SINGLE GIG
exports.getSingleGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("ownerId", "name email");
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    res.json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
