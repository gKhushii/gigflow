import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await api.post("/auth/login", form);
      navigate("/");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">

        <h1 className="text-3xl font-bold text-center mb-1 text-indigo-500">
          GigFlow
        </h1>
        <p className="text-slate-400 text-center mb-6">
          Welcome back 👋 Login to continue
        </p>

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
          Login
        </button>

        <p className="text-center text-slate-400 mt-5 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
