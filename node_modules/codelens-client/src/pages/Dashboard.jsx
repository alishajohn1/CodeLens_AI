import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../lib/store";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, fetchMe } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      toast.success("Plan upgraded successfully!");
      fetchMe();
    }
  }, []);

  useEffect(() => {
    api.get("/review/history").then(({ data }) => {
      setHistory(data.slice(0, 5));
      setLoadingHistory(false);
    }).catch(() => setLoadingHistory(false));
  }, []);

  const scoreColor = (s) =>
    s >= 80 ? "text-green-400" : s >= 60 ? "text-yellow-400" : "text-red-400";

  const usagePercent = user?.usage?.limit === "unlimited"
    ? 0
    : Math.round((user?.usage?.reviewsToday / user?.usage?.limit) * 100) || 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Ready to review some code?</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">Reviews today</p>
            <p className="text-2xl font-bold text-white">{user?.usage?.reviewsToday ?? 0}</p>
            <p className="text-xs text-gray-600 mt-1">
              of {user?.usage?.limit === "unlimited" ? "∞" : user?.usage?.limit} allowed
            </p>
            {user?.usage?.limit !== "unlimited" && (
              <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${usagePercent}%` }} />
              </div>
            )}
          </div>
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">Current plan</p>
            <p className="text-2xl font-bold text-white">{user?.plan ?? "FREE"}</p>
            {user?.plan === "FREE" && (
              <Link to="/pricing" className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 block">
                Upgrade for unlimited →
              </Link>
            )}
          </div>
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">Total reviews</p>
            <p className="text-2xl font-bold text-white">{history.length > 0 ? history.length + "+" : "0"}</p>
            <Link to="/history" className="text-xs text-gray-500 hover:text-gray-300 mt-1 block">View all →</Link>
          </div>
        </div>

        {/* Main CTA */}
        <div className="card border-indigo-800 bg-indigo-950/20 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-white text-lg">Start a new code review</h2>
            <p className="text-sm text-gray-400">Paste your code and get AI feedback in seconds</p>
          </div>
          <Link to="/editor" className="btn-primary whitespace-nowrap">Review my code →</Link>
        </div>

        {/* Recent reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent reviews</h2>
            <Link to="/history" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
          </div>
          {loadingHistory ? (
            <div className="card text-center text-gray-500 py-8">Loading...</div>
          ) : history.length === 0 ? (
            <div className="card text-center text-gray-500 py-10">
              <p className="mb-3">No reviews yet</p>
              <Link to="/editor" className="btn-primary text-sm">Review your first code</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((r) => (
                <Link key={r.id} to={`/review/${r.id}`}
                  className="card flex items-center justify-between hover:border-gray-700 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono">{r.language}</span>
                    <span className="text-sm text-gray-400 font-mono truncate max-w-xs">
                      {r.code.slice(0, 60)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {r.score && <span className={`font-bold text-sm ${scoreColor(r.score)}`}>{r.score}/100</span>}
                    <span className="text-xs text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</span>
                    <span className="text-gray-600 group-hover:text-gray-400">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
