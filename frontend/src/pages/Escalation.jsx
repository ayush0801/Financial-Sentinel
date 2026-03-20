import { ShieldCheck, Lock, ExternalLink, User } from "lucide-react";
import BottomNav from "../components/BottomNav";

const steps = [
  {
    number: 1,
    title: "Raise complaint in your bank app",
    sub: "File a complaint directly in your bank's grievance portal.",
    cta: "Go to HDFC Grievance Portal",
    href: "https://www.hdfcbank.com/personal/need-help/raise-a-query",
    locked: false,
  },
  {
    number: 2,
    title: "Email the Nodal Officer",
    sub: "Available after 5 business days.",
    cta: null,
    href: null,
    locked: true,
  },
  {
    number: 3,
    title: "File with RBI Ombudsman",
    sub: "Available after 30 days.",
    cta: null,
    href: "https://cms.rbi.org.in",
    locked: true,
  },
];

export default function Escalation() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-green-600" strokeWidth={2.5} />
          <span className="font-bold text-gray-900 text-base tracking-tight">Financial Sentinel</span>
        </div>
        <button className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
          <User size={16} className="text-blue-500" />
        </button>
      </div>

      {/* Breach warning banner */}
      <div className="mx-4 mt-4 bg-orange-50 rounded-2xl p-4 flex gap-3 items-start">
        <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white font-bold text-base">!</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 mb-1">
            Your bank has exceeded the RBI deadline.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            RBI required resolution by <strong>18 March 2026</strong>. It is now{" "}
            <span className="text-red-600 font-semibold">2 days overdue</span>. You are entitled to escalate.
          </p>
        </div>
      </div>

      {/* Escalation stepper */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Escalation Path</h2>
          <span className="text-xs text-gray-400 font-medium">STEP 1 OF 3</span>
        </div>

        <div>
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-4">
              {/* Step indicator column */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    step.locked
                      ? "bg-gray-100 border-2 border-gray-200"
                      : "bg-green-600"
                  }`}
                >
                  {step.locked ? (
                    <Lock size={12} className="text-gray-400" />
                  ) : (
                    <span className="text-white">{step.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 my-1 flex-1 min-h-12 ${
                      step.locked ? "bg-gray-200" : "bg-green-500"
                    }`}
                  />
                )}
              </div>

              {/* Step content */}
              <div className={`flex-1 pb-6 ${step.locked ? "opacity-50" : ""}`}>
                <p className="text-sm font-semibold text-gray-900 mb-1">{step.title}</p>
                {step.sub && (
                  <p className="text-xs text-gray-400 mb-2">{step.sub}</p>
                )}
                {step.cta && !step.locked && (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 w-full bg-green-600 text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-between active:bg-green-700 transition-all"
                  >
                    {step.cta}
                    <ExternalLink size={14} className="text-white opacity-80" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="mx-4 mt-2 bg-blue-50 rounded-2xl p-4 flex gap-3">
        <span className="text-green-600 text-lg shrink-0 mt-0.5">ℹ</span>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Why can't I escalate yet?</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Regulations require you to first attempt resolution through the bank's internal channels.
            If they fail to respond within specific windows, official ombudsman doors open automatically.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
