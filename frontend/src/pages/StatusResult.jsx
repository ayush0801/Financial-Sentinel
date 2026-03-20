import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBanner from "../components/StatusBanner";
import TransactionCard from "../components/TransactionCard";
import BottomNav from "../components/BottomNav";

export default function StatusResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!state) navigate("/");
  }, [state, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!state) return null;

  const handleRetry = () => {
    if (cooldown > 0) return;
    setRetryCount((r) => r + 1);
    setCooldown(30);
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Status banner — full bleed, no padding */}
      <StatusBanner
        status={state.status}
        headline={state.headline}
        subtext={state.subtext}
        refundMessage={state.refundMessage}
      />

      {/* Transaction details card overlaps banner */}
      <TransactionCard data={state} />

      {/* GREEN actions */}
      {state.status === "GREEN" && (
        <div className="px-4 mt-5 space-y-3">
          <button
            onClick={() => navigate("/disputes")}
            className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl text-sm flex items-center justify-center gap-2 active:bg-green-700 transition-all"
          >
            ◎ Track this dispute
          </button>
          <button
            onClick={handleSave}
            className={`w-full font-semibold py-4 rounded-xl text-sm transition-all ${
              saved
                ? "bg-green-50 text-green-600"
                : "bg-blue-50 text-gray-700 active:bg-blue-100"
            }`}
          >
            {saved ? "✓ Saved to dashboard" : "Save to dashboard"}
          </button>
          <p className="text-center text-xs text-gray-400 px-2">
            Get notified if your refund is delayed beyond the RBI deadline.
          </p>
        </div>
      )}

      {/* YELLOW actions */}
      {state.status === "YELLOW" && (
        <div className="px-4 mt-5 space-y-3">
          <button
            onClick={handleRetry}
            disabled={cooldown > 0}
            className={`w-full font-semibold py-4 rounded-xl text-sm text-white transition-all ${
              cooldown > 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-900 active:bg-gray-700"
            }`}
          >
            {cooldown > 0 ? `Check again in ${cooldown}s` : "Check Again"}
          </button>

          {retryCount > 0 && (
            <p className="text-center text-xs text-gray-400">
              You have checked {retryCount} time{retryCount > 1 ? "s" : ""}. Status is still pending.
            </p>
          )}

          {retryCount >= 6 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                Status is still pending. This can take up to 10 minutes. Save this dispute and we will notify you when it resolves.
              </p>
            </div>
          )}

          <button
            onClick={handleSave}
            className={`w-full font-semibold py-3.5 rounded-xl text-sm transition-all ${
              saved
                ? "bg-green-50 text-green-600"
                : "bg-blue-50 text-gray-700 active:bg-blue-100"
            }`}
          >
            {saved ? "✓ Saved to dashboard" : "Save to dashboard"}
          </button>
        </div>
      )}

      {/* RED actions */}
      {state.status === "RED" && (
        <div className="px-4 mt-5 space-y-3">
          <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-700">Payment confirmed.</p>
              <p className="text-xs text-gray-500">Verified by Banking Network</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/disputes")}
            className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl text-sm active:bg-green-700 transition-all"
          >
            Track this dispute
          </button>

          <p className="text-center text-xs text-gray-400 px-4 leading-relaxed">
            If you did not receive your goods or service, contact the merchant with your UTR number.
          </p>

          {/* More help */}
          <div className="bg-blue-50 rounded-2xl overflow-hidden mt-2">
            <p className="text-sm font-semibold text-gray-800 px-4 pt-4 pb-2">Need more help?</p>
            {[
              { label: "Download Payment Receipt", icon: "🧾" },
              { label: "Speak with an Agent", icon: "🎧" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-4 py-3.5 bg-white mx-0 border-t border-gray-100 cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-gray-400 text-sm">›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
