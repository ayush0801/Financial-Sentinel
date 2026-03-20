import { useNavigate } from "react-router-dom";
import { ShieldCheck, Plus, User } from "lucide-react";
import DisputeCard from "../components/DisputeCard";
import BottomNav from "../components/BottomNav";
import { mockDisputes } from "../data/mockTransactions";

export default function Disputes() {
  const navigate = useNavigate();

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

      {/* Title */}
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Your open disputes</h1>
        <span className="mt-2 inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          {mockDisputes.length} OPEN CASES
        </span>
      </div>

      {/* Dispute cards */}
      <div className="px-4 space-y-3 flex-1">
        {mockDisputes.map((dispute) => (
          <div
            key={dispute.id}
            onClick={() => navigate("/escalation")}
            className="cursor-pointer"
          >
            <DisputeCard dispute={dispute} />
          </div>
        ))}
      </div>

      {/* Empty state (shown when no disputes) */}
      {mockDisputes.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={28} className="text-gray-400" />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">No open disputes</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Check a UTR number to start tracking a dispute.
          </p>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-24 right-6 w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg active:bg-green-700 transition-all"
        aria-label="Add new dispute"
      >
        <Plus size={24} className="text-white" strokeWidth={2.5} />
      </button>

      <BottomNav />
    </div>
  );
}
