import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../lib/api";

export default function History() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/review/history").then(({ data }) => {
      setReviews(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const scoreColor = (s) =>
    s >= 80 ? "text-green-400" : s >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-white">Review History</h1>
          <Link to="/editor" className="btn-primary text-sm py-2">New review</Link>
        </div>

        {loading ? (
          <div className="card text-center text-gray-500 py-12">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-500 mb-4">No reviews yet</p>
            <Link to="/editor" className="btn-primary">Review your first code</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <Link key={r.id} to={`/review/${r.id}`}
                className="card flex items-center justify-between hover:border-gray-700 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono shrink-0">{r.language}</span>
                  <span className="text-sm text-gray-400 font-mono truncate">
                    {r.code?.slice(0, 80)}...
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  {r.score != null && (
                    <span className={`font-bold text-sm ${scoreColor(r.score)}`}>{r.score}/100</span>
                  )}
                  <span className="text-xs text-gray-600 hidden sm:block">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-600 group-hover:text-gray-400">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
