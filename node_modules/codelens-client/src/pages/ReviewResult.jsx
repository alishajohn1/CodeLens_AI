import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../lib/api";

const severityColor = {
  high: "bg-red-900/40 border-red-800 text-red-300",
  medium: "bg-yellow-900/40 border-yellow-800 text-yellow-300",
  low: "bg-blue-900/40 border-blue-800 text-blue-300",
};

const typeIcon = { bug: "🐛", performance: "⚡", security: "🔒", style: "✨" };

export default function ReviewResult() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("feedback");

  useEffect(() => {
    api.get(`/review/${id}`).then(({ data }) => {
      setReview(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen"><Navbar />
      <div className="flex items-center justify-center h-64 text-gray-500">Loading review...</div>
    </div>
  );

  if (!review) return (
    <div className="min-h-screen"><Navbar />
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">Review not found</p>
        <Link to="/editor" className="btn-primary">New review</Link>
      </div>
    </div>
  );

  const fb = review.feedback;
  const scoreColor = fb.score >= 80 ? "text-green-400" : fb.score >= 60 ? "text-yellow-400" : "text-red-400";
  const ringColor = fb.score >= 80 ? "border-green-500" : fb.score >= 60 ? "border-yellow-500" : "border-red-500";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-300">← Dashboard</Link>
            </div>
            <h1 className="text-xl font-bold text-white">Review Result</h1>
            <p className="text-sm text-gray-400 mt-0.5 font-mono">{review.language} · {new Date(review.createdAt).toLocaleString()}</p>
          </div>
          <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 ${ringColor} shrink-0`}>
            <span className={`text-2xl font-bold ${scoreColor}`}>{fb.score}</span>
            <span className="text-xs text-gray-500">/100</span>
          </div>
        </div>

        {/* Summary */}
        <div className="card mb-6 border-gray-700">
          <p className="text-gray-300">{fb.summary}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 p-1 rounded-lg mb-6 w-fit">
          {["feedback", "improved", "original"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                tab === t ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"
              }`}>
              {t === "improved" ? "Improved code" : t === "original" ? "Original code" : "Feedback"}
            </button>
          ))}
        </div>

        {/* Feedback tab */}
        {tab === "feedback" && (
          <div className="space-y-6">
            {/* Issues */}
            {fb.issues?.length > 0 && (
              <div>
                <h2 className="font-semibold text-white mb-3">Issues ({fb.issues.length})</h2>
                <div className="space-y-3">
                  {fb.issues.map((issue, i) => (
                    <div key={i} className={`border rounded-xl p-4 ${severityColor[issue.severity] || severityColor.low}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span>{typeIcon[issue.type] || "⚠️"}</span>
                          <span className="font-medium text-sm">{issue.type}</span>
                          {issue.line && <span className="text-xs opacity-70 font-mono">line {issue.line}</span>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${
                          issue.severity === "high" ? "bg-red-800 text-red-200" :
                          issue.severity === "medium" ? "bg-yellow-800 text-yellow-200" :
                          "bg-blue-800 text-blue-200"
                        }`}>{issue.severity}</span>
                      </div>
                      <p className="text-sm mb-2">{issue.message}</p>
                      {issue.fix && (
                        <div className="bg-black/30 rounded-lg p-3 mt-2">
                          <p className="text-xs text-gray-400 mb-1">Suggested fix:</p>
                          <pre className="text-xs font-mono whitespace-pre-wrap">{issue.fix}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {fb.strengths?.length > 0 && (
              <div>
                <h2 className="font-semibold text-white mb-3">Strengths</h2>
                <div className="card border-green-900 bg-green-950/20 space-y-2">
                  {fb.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-green-300">
                      <span className="mt-0.5">✓</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Improved code tab */}
        {tab === "improved" && (
          <div className="card p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
              <span className="text-xs text-gray-500 font-mono">Improved {review.language}</span>
              <button onClick={() => navigator.clipboard.writeText(fb.improvedCode).then(() => alert("Copied!"))}
                className="text-xs text-indigo-400 hover:text-indigo-300">Copy</button>
            </div>
            <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {fb.improvedCode}
            </pre>
          </div>
        )}

        {/* Original code tab */}
        {tab === "original" && (
          <div className="card p-0 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-900">
              <span className="text-xs text-gray-500 font-mono">Original {review.language}</span>
            </div>
            <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {review.code}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Link to="/editor" className="btn-primary">Review another →</Link>
          <Link to="/history" className="btn-secondary">View history</Link>
        </div>
      </div>
    </div>
  );
}
