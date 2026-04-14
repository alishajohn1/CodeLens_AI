import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  { icon: "🐛", title: "Bug Detection", desc: "Catch logic errors, null pointers, and edge cases before they hit production." },
  { icon: "⚡", title: "Performance Tips", desc: "Identify O(n²) loops, memory leaks, and inefficient patterns instantly." },
  { icon: "🔒", title: "Security Scan", desc: "Spot SQL injection, XSS vulnerabilities, and insecure practices." },
  { icon: "✨", title: "Style & Best Practices", desc: "Enforce clean code conventions and language-specific best practices." },
  { icon: "🔧", title: "Improved Code", desc: "Get a fully refactored version of your code, not just comments." },
  { icon: "📊", title: "Quality Score", desc: "Every review comes with a 0–100 quality score so you can track progress." },
];

const languages = ["JavaScript", "Python", "TypeScript", "Java", "C++", "Go", "Rust", "PHP"];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-sm px-3 py-1 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
          Powered by Claude AI
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
          Code reviews that<br />
          <span className="text-indigo-400">actually teach you</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Paste your code, get instant AI-powered feedback on bugs, performance, security, and best practices. Built for developers who want to level up.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="btn-primary text-base px-8 py-3">Start for free</Link>
          <Link to="/pricing" className="btn-secondary text-base px-8 py-3">View pricing</Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">5 free reviews per day — no credit card needed</p>
      </section>

      {/* Languages */}
      <section className="border-y border-gray-800 py-5 overflow-hidden">
        <div className="flex gap-8 animate-none justify-center flex-wrap px-4">
          {languages.map((l) => (
            <span key={l} className="text-gray-500 text-sm font-mono whitespace-nowrap">{l}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center text-white mb-3">Everything in one review</h2>
        <p className="text-gray-400 text-center mb-14">No more waiting for a senior dev. Get deep feedback in seconds.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card hover:border-gray-700 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-24 text-center">
        <div className="card border-indigo-800 bg-indigo-950/30">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to write better code?</h2>
          <p className="text-gray-400 mb-6">Join developers using CodeLens AI to ship cleaner, faster, safer code.</p>
          <Link to="/register" className="btn-primary px-8 py-3 text-base">Get started free</Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-600">
        © 2025 CodeLens AI — Built with React + Node.js + Claude
      </footer>
    </div>
  );
}
