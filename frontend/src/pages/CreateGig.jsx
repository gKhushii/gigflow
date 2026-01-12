import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function CreateGig() {
  const [form, setForm] = useState({ title: "", description: "", budget: "" });

  const submit = async () => {
    try {
      await api.post("/gigs", form);
      alert("🎉 Gig posted successfully");
      window.location.href = "/";
    } catch {
      alert("Please login first");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">

          <h1 className="text-3xl font-bold mb-2">Post a new job</h1>
          <p className="text-slate-400 mb-8">
            Describe your project and start receiving bids from freelancers.
          </p>

          <input
            className="auth-input"
            placeholder="Job title"
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="auth-input h-32"
            placeholder="Job description (requirements, timeline, expectations...)"
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="number"
            className="auth-input"
            placeholder="Budget (₹)"
            onChange={e => setForm({ ...form, budget: e.target.value })}
          />

          <button
            onClick={submit}
            className="primary-btn mt-2"
          >
            Post Gig
          </button>

        </div>
      </div>
    </>
  );
}
