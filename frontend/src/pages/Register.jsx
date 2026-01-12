import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">

        <h1 className="text-3xl font-bold text-center mb-1 text-indigo-500">
          GigFlow
        </h1>
        <p className="text-slate-400 text-center mb-6">
          Create your account 🚀
        </p>

        <input
          className="auth-input"
          placeholder="Full name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="auth-input"
          placeholder="Email address"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={submit} className="primary-btn w-full mt-2">
          Register
        </button>

        <p className="text-center text-slate-400 mt-5 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
