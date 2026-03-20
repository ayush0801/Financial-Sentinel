const pillStyles = {
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-600",
};

export default function DisputeCard({ dispute }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden ${
        dispute.overdue ? "border-l-4 border-amber-500" : "border border-gray-100"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">UTR Number</p>
          <p className="font-mono text-sm font-semibold text-gray-800">{dispute.utr}</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
            pillStyles[dispute.statusColor]
          }`}
        >
          {dispute.status}
        </span>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-xl font-bold text-gray-900">{dispute.amount}</p>
          <p className="text-xs text-gray-400 mt-0.5">Transaction: {dispute.date}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider">{dispute.rbiDeadline}</p>
          <p
            className={`text-sm font-semibold mt-0.5 ${
              dispute.overdue ? "text-red-600" : "text-gray-700"
            }`}
          >
            {dispute.daysLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
