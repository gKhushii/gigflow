import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import socket from "../services/socket";   // 👈 ADD

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");

  // 🔁 Fetch gigs + search
  useEffect(() => {
    api.get(`/gigs?search=${search}`).then(res => setGigs(res.data));
  }, [search]);

  // 🔔 SOCKET SETUP (REGISTER + LISTEN)
  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        console.log("SOCKET REGISTER:", res.data._id);
        socket.emit("register", res.data._id);   // 👈 register user
      })
      .catch(() => {});

    socket.on("hired", (data) => {
      console.log("SOCKET EVENT RECEIVED:", data);
      alert("🎉 You have been hired for " + data.gigTitle);
    });

    return () => {
      socket.off("hired");
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find your next gig 🚀</h1>
          <p className="text-slate-400">
            Browse open freelance jobs posted by clients.
          </p>
        </div>

        {/* Search */}
        <input
          placeholder="Search gigs by title..."
          className="w-full mb-10 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500"
          onChange={e => setSearch(e.target.value)}
        />

        {/* Gigs Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {gigs.map(g => (
            <div
              key={g._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500 transition"
            >
              <h2 className="text-xl font-semibold mb-2">{g.title}</h2>

              <p className="text-slate-400 mb-4 line-clamp-3">
                {g.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-semibold text-lg">
                  ₹{g.budget}
                </span>

                <div className="flex gap-4">
                  <Link
                    to={`/gig/${g._id}`}
                    className="text-indigo-400 hover:underline"
                  >
                    View
                  </Link>

                  <Link
                    to={`/client/gig/${g._id}`}
                    className="text-emerald-400 hover:underline"
                  >
                    Client View
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {gigs.length === 0 && (
            <p className="text-slate-400">No gigs found.</p>
          )}

        </div>
      </div>
    </>
  );
}
