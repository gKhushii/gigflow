import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function GigDetails() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    api.get(`/gigs/${id}`).then(res => setGig(res.data));
  }, [id]);

  const submitBid = async () => {
    try {
      await api.post("/bids", { gigId: id, message, price });
      alert("Bid submitted successfully 🚀");
      setMessage("");
      setPrice("");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  if (!gig) return null;

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Gig Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
          <p className="text-slate-400 mb-4">{gig.description}</p>
          <p className="text-emerald-400 text-xl font-semibold">
            Budget: ₹{gig.budget}
          </p>
        </div>

        {/* Bid Section */}
        {gig.status === "open" ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-4">
              Submit your proposal
            </h2>

            <textarea
              placeholder="Explain why you're a good fit for this project..."
              className="auth-input h-28"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            <input
              type="number"
              placeholder="Your expected price"
              className="auth-input"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />

            <button
              onClick={submitBid}
              className="primary-btn mt-2"
            >
              Send Bid
            </button>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <p className="text-red-400 font-semibold text-center">
              ❌ This gig has already been assigned
            </p>
          </div>
        )}

      </div>
    </>
  );
}
