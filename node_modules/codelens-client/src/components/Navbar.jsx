import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <span className="text-indigo-400">&#10010;</span> CodeLens AI
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                user.plan === "FREE" ? "bg-gray-800 text-gray-400" :
                user.plan === "PRO" ? "bg-indigo-900 text-indigo-300" :
                "bg-amber-900 text-amber-300"
              }`}>{user.plan}</span>
              <Link to="/dashboard" className="btn-secondary text-sm py-1.5 px-3">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
