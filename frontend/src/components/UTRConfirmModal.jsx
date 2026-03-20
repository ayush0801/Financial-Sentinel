export default function UTRConfirmModal({ utr, onConfirm, onManual }) {
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onManual}
      />

      {/* Sheet — pb-28 clears the bottom nav bar */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white rounded-t-3xl px-6 pt-6 pb-28 shadow-2xl">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-lg font-bold">✓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">We found your UTR.</h2>
        </div>

        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Our OCR engine successfully identified the Unique Transaction Reference from your screenshot.
        </p>

        {/* UTR display */}
        <div className="bg-blue-50 rounded-xl p-4 mb-5 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Extracted Reference</p>
          <p className="font-mono text-2xl font-bold text-gray-900 tracking-widest">{utr}</p>
        </div>

        <p className="text-sm font-semibold text-gray-800 text-center mb-5">
          Is this the correct UTR number?
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onManual}
            className="flex-1 py-3.5 rounded-xl bg-blue-50 text-gray-700 font-semibold text-sm active:bg-blue-100 transition-all"
          >
            Enter manually
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-xl bg-green-600 text-white font-semibold text-sm active:bg-green-700 transition-all"
          >
            Yes, check this UTR
          </button>
        </div>
      </div>
    </div>
  );
}