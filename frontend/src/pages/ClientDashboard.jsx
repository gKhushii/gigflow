import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import socket from "../services/socket";   // ✅ IMPORTANT

export default function ClientDashboard() {
  const { id } = useParams(); // gigId
  const [bids, setBids] = useState([]);

  const fetchBids = async () => {
    const res = await api.get(`/bids/${id}`);
    setBids(res.data);
  };

  // initial fetch
  useEffect(() => {
    fetchBids();
  }, [id]);

  // 🔔 realtime listener
  useEffect(() => {
    socket.on("new-bid", (bid) => {
      console.log("NEW BID RECEIVED:", bid);

      // only update if this bid belongs to this gig
      if (bid.gigId === id) {
        fetchBids();
        // OR faster:
        // setBids(prev => [bid, ...prev]);
      }
    });

    return () => socket.off("new-bid");
  }, [id]);

  const hire = async (bidId) => {
    await api.patch(`/bids/hire/${bidId}`);
    alert("Freelancer hired successfully 🎉");
    fetchBids();
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-2">Project Bids</h1>
        <p className="text-slate-400 mb-8">
          Review proposals and hire the best freelancer for your project.
        </p>

        <div className="grid gap-6">

          {bids.map(b => (
            <div
              key={b._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500 transition"
            >

              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold text-lg">{b.freelancerId.name}</p>
                  <p className="text-slate-400 text-sm">{b.freelancerId.email}</p>
                </div>

                <p className="text-emerald-400 text-xl font-semibold">
                  ₹{b.price}
                </p>
              </div>

              <p className="text-slate-300 mb-4">{b.message}</p>

              {b.status === "pending" && (
                <button
                  onClick={() => hire(b._id)}
                  className="px-6 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition font-semibold"
                >
                  Hire Freelancer
                </button>
              )}

              {b.status === "hired" && (
                <p className="text-emerald-400 font-semibold">✅ HIRED</p>
              )}

              {b.status === "rejected" && (
                <p className="text-red-400 font-semibold">❌ REJECTED</p>
              )}

            </div>
          ))}

          {bids.length === 0 && (
            <p className="text-slate-400">No bids yet.</p>
          )}

        </div>
      </div>
    </>
  );
}
