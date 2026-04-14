import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import toast from "react-hot-toast";

const LANGUAGES = [
  "javascript", "typescript", "python", "java", "cpp",
  "go", "rust", "php", "csharp", "ruby", "swift", "kotlin",
];

const SAMPLE_CODE = {
  javascript: `function findDuplicates(arr) {
  let duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// Usage
const nums = [1, 2, 3, 2, 4, 3, 5];
console.log(findDuplicates(nums));`,
  python: `def calculate_average(numbers):
    total = 0
    for n in numbers:
        total = total + n
    average = total / len(numbers)
    return average

scores = [85, 92, 78, 96, 88]
print("Average:", calculate_average(scores))`,
};

export default function EditorPage() {
  const [code, setCode] = useState(SAMPLE_CODE.javascript);
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (SAMPLE_CODE[lang]) setCode(SAMPLE_CODE[lang]);
    else setCode("// Paste your code here...\n");
  };

  const handleReview = async () => {
    if (!code.trim()) return toast.error("Please paste some code first");
    if (code.trim().length < 10) return toast.error("Code is too short to review");
    setLoading(true);
    try {
      const { data } = await api.post("/review", { code, language });
      toast.success("Review complete!");
      navigate(`/review/${data.reviewId}`);
    } catch (err) {
      const msg = err.response?.data?.error || "Review failed";
      toast.error(msg);
      if (err.response?.status === 429) {
        setTimeout(() => navigate("/pricing"), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Code Review</h1>
            <p className="text-sm text-gray-400">Paste your code below and get instant AI feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
            <button onClick={handleReview} disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Reviewing...
                </span>
              ) : "Review code →"}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-xl overflow-hidden border border-gray-800" style={{ height: "calc(100vh - 260px)", minHeight: "400px" }}>
          <div className="flex items-center gap-2 bg-gray-900 border-b border-gray-800 px-4 py-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            <span className="text-xs text-gray-500 ml-2 font-mono">
              {language} • {code.split("\n").length} lines
            </span>
          </div>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              padding: { top: 16, bottom: 16 },
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        </div>

        {loading && (
          <div className="mt-4 card border-indigo-800 bg-indigo-950/20 text-center py-6">
            <div className="text-indigo-400 text-sm animate-pulse">
              Claude is analyzing your code... this takes 5–15 seconds
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
