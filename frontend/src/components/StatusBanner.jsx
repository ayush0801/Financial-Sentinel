import { CheckCircle, Clock, XCircle } from "lucide-react";

const config = {
  GREEN: {
    bg: "bg-green-600",
    icon: CheckCircle,
    iconColor: "text-white",
    textColor: "text-white",
    subColor: "text-green-100",
    pillBg: "bg-white bg-opacity-20",
    pillText: "text-white",
  },
  YELLOW: {
    bg: "bg-amber-400",
    icon: Clock,
    iconColor: "text-amber-900",
    textColor: "text-amber-900",
    subColor: "text-amber-800",
    pillBg: "bg-amber-900 bg-opacity-10",
    pillText: "text-amber-900",
  },
  RED: {
    bg: "bg-red-500",
    icon: XCircle,
    iconColor: "text-white",
    textColor: "text-white",
    subColor: "text-red-100",
    pillBg: "bg-white bg-opacity-20",
    pillText: "text-white",
  },
};

export default function StatusBanner({ status, headline, subtext, refundMessage }) {
  const c = config[status];
  const Icon = c.icon;

  return (
    <div className={`${c.bg} px-6 pt-10 pb-12 w-full`}>
      <Icon size={40} className={`${c.iconColor} mb-4`} />
      <h1 className={`text-3xl font-bold ${c.textColor} leading-tight mb-3`}>
        {headline}
      </h1>
      <p className={`text-sm ${c.subColor} leading-relaxed`}>
        {subtext}
      </p>
      {refundMessage && (
        <div className={`mt-5 inline-block ${c.pillBg} rounded-full px-4 py-2`}>
          <span className={`text-sm font-medium ${c.pillText}`}>{refundMessage}</span>
        </div>
      )}
    </div>
  );
}
