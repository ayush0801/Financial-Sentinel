const statusColors = {
  Aborted: "text-red-600",
  Successful: "text-green-600",
  Pending: "text-amber-600",
  Timeout: "text-orange-600",
  "Deemed Approved": "text-amber-600",
};

export default function TransactionCard({ data }) {
  return (
    <div className="bg-white rounded-2xl mx-4 -mt-5 shadow-md p-5 z-10 relative">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-gray-800">Transaction Details</span>
        <span className="text-xs text-gray-400 font-mono">ID: {data.utr.slice(-8)}</span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">UTR Number</p>
          <p className="font-mono text-sm font-semibold text-gray-800 tracking-wide">{data.utr}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date & Time</p>
            <p className="text-sm font-medium text-gray-800">{data.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payer Bank</p>
            <p className="text-sm font-medium text-gray-800">{data.payerBank}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <p className={`text-sm font-semibold ${statusColors[data.txnStatus] || "text-gray-800"}`}>
              ● {data.txnStatus}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Institution</p>
            <p className="text-sm font-medium text-gray-800">{data.institution}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Amount</p>
          <p className="text-xl font-bold text-gray-900">{data.amount}</p>
        </div>
      </div>

      {data.rbiDeadline && (
        <div className="mt-5 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏛</span>
            <span className="text-sm font-semibold text-gray-800">RBI Resolution Deadline</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Bank must refund this by{" "}
            <span className="font-semibold text-gray-900">{data.rbiDeadline}</span>.
          </p>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-semibold text-green-600">{data.daysLeft} days left</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.max(10, 100 - data.daysLeft * 8)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
