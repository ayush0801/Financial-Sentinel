import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ScanLine, User, Loader2 } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { lookupUTR } from "../data/mockTransactions";

export default function Home() {
  const [utr, setUtr] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheck = async () => {
    const trimmed = utr.trim();
    if (trimmed.length !== 12 || isNaN(trimmed)) {
      setError("Please enter a valid 12-digit UTR number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await lookupUTR(trimmed);
      if (!result || !result.found) {
        setError(
          "UTR not found. Try: 111111111111 (GREEN), 222222222222 (YELLOW), or 333333333333 (RED)."
        );
        return;
      }
      navigate("/status", { state: result });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-green-600" strokeWidth={2.5} />
          <span className="font-bold text-gray-900 text-base tracking-tight">Financial Sentinel</span>
        </div>
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <User size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Hero text */}
      <div className="px-5 pt-7 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          Check your UPI<br />payment status.
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Find out if it is safe to pay again in under 30 seconds.
        </p>
      </div>

      {/* UTR input */}
      <div className="px-5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
          Enter UTR Number
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={12}
          value={utr}
          onChange={(e) => {
            setUtr(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 123456789012"
          className="w-full bg-blue-50 rounded-xl px-4 py-4 text-base font-mono text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
        />
        <p className="text-xs text-gray-400 mt-2">
          12-digit number found in your bank app under transaction details.
        </p>
        {error && (
          <p className="text-xs text-red-500 mt-2 leading-relaxed">{error}</p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 px-5 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Upload zone */}
      <div
        onClick={() => navigate("/ocr")}
        className="mx-5 border-2 border-dashed border-green-200 rounded-2xl bg-green-50 p-6 flex flex-col items-center gap-2 cursor-pointer active:bg-green-100 transition-all"
      >
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <ScanLine size={22} className="text-green-600" />
        </div>
        <p className="text-sm font-semibold text-gray-800">Upload payment screenshot</p>
        <p className="text-xs text-gray-500 text-center">
          We will find the UTR for you automatically.
        </p>
      </div>

      {/* CTA */}
      <div className="px-5 mt-5">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl text-base flex items-center justify-center gap-2 active:bg-green-700 transition-all shadow-sm disabled:bg-green-400"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Checking...</>
          ) : (
            <>Check Status <span className="text-lg">→</span></>
          )}
        </button>
      </div>

      {/* Trust badge */}
      <div className="mx-5 mt-5 bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck size={18} className="text-green-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-800">Secure Guardian Protocol</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Your transaction data is encrypted and used only for dispute verification. We never store bank credentials.
          </p>
        </div>
      </div>

      {/* Demo hint */}
      <div className="mx-5 mt-3 bg-amber-50 rounded-xl p-3">
        <p className="text-xs text-amber-700 font-medium">Demo mode</p>
        <p className="text-xs text-amber-600 mt-0.5">
          Try UTR: <span className="font-mono font-semibold">111111111111</span> (GREEN) ·{" "}
          <span className="font-mono font-semibold">222222222222</span> (YELLOW) ·{" "}
          <span className="font-mono font-semibold">333333333333</span> (RED)
        </p>
      </div>

      <BottomNav />
    </div>
  );
}