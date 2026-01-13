import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}

    setUser(null);          
    navigate("/login",{replace:true});   
  };

  return (
    <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="text-2xl font-bold text-indigo-500">
          GigFlow
        </Link>

        <div className="flex items-center gap-6 text-slate-300">

          <Link to="/" className="hover:text-white">Explore</Link>

          {user && (
            <Link to="/create" className="hover:text-white">
              Post a Job
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-white">Login</Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
