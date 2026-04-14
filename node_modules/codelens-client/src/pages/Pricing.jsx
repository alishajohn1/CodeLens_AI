import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../lib/store";
import api from "../lib/api";
import toast from "react-hot-toast";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    plan: "FREE",
    features: ["5 reviews per day", "Bug & security detection", "Performance tips", "Review history (last 20)"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹749",
    period: "per month",
    plan: "PRO",
    features: ["Unlimited reviews", "Everything in Free", "Improved code generation", "Full review history", "Priority AI responses"],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "₹2,499",
    period: "per month",
    plan: "TEAM",
    features: ["Everything in Pro", "Up to 10 team members", "Team usage analytics", "Slack integration (soon)", "Priority support"],
    cta: "Upgrade to Team",
    highlight: false,
  },
];

export default function Pricing() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (plan) => {
    if (!user) return navigate("/register");
    if (user.plan === plan) return toast("You're already on this plan");
    setLoading(plan);
    try {
      const { data } = await api.post("/payment/create-checkout", { plan });
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white mb-3">Simple pricing</h1>
          <p className="text-gray-400">Start free, upgrade when you need more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`card flex flex-col ${p.highlight ? "border-indigo-600 ring-1 ring-indigo-600" : ""}`}>
              {p.highlight && (
                <div className="text-xs text-indigo-400 font-medium mb-3 uppercase tracking-wider">Most popular</div>
              )}
              <h2 className="text-xl font-bold text-white">{p.name}</h2>
              <div className="mt-3 mb-6">
                <span className="text-3xl font-bold text-white">{p.price}</span>
                <span className="text-gray-500 text-sm ml-1">/{p.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-indigo-400 mt-0.5 shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              {p.plan === "FREE" ? (
                <Link to={user ? "/editor" : "/register"}
                  className={`text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    p.highlight ? "btn-primary" : "btn-secondary"
                  }`}>
                  {user ? "Go to editor" : p.cta}
                </Link>
              ) : (
                <button onClick={() => handleUpgrade(p.plan)}
                  disabled={loading === p.plan || user?.plan === p.plan}
                  className={`py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    p.highlight ? "btn-primary" : "btn-secondary"
                  }`}>
                  {user?.plan === p.plan ? "Current plan" : loading === p.plan ? "Redirecting..." : p.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-600 mt-10">
          Payments secured by Stripe · Cancel anytime · GST included
        </p>
      </div>
    </div>
  );
}
