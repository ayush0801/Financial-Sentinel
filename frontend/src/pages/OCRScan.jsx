import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ScanLine, Upload, User } from "lucide-react";
import UTRConfirmModal from "../components/UTRConfirmModal";
import BottomNav from "../components/BottomNav";
import { lookupUTR } from "../data/mockTransactions";

export default function OCRScan() {
  const [stage, setStage] = useState("upload"); // upload | scanning | confirm
  const [preview, setPreview] = useState(null);
  const [extractedUTR] = useState("426110837291");
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStage("scanning");
    // Simulate OCR processing time
    setTimeout(() => setStage("confirm"), 2500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStage("scanning");
    setTimeout(() => setStage("confirm"), 2500);
  };

  const handleConfirm = async () => {
    const result = await lookupUTR("111111111111");
    navigate("/status", { state: result });
  };

  const handleManual = () => {
    navigate("/");
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

      {/* Upload stage */}
      {stage === "upload" && (
        <div className="px-5 pt-6 flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Scan Receipt</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Upload your payment screenshot and we will extract the UTR number automatically.
            </p>
          </div>

          <div
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-green-200 rounded-2xl bg-green-50 p-10 flex flex-col items-center gap-3 cursor-pointer active:bg-green-100 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Upload size={26} className="text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Tap to upload screenshot</p>
            <p className="text-xs text-gray-400">JPG, PNG or PDF supported</p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFile}
          />

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">Where to find your screenshot</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Open GPay, PhonePe, or your bank app → tap the transaction → take a screenshot of the details screen.
            </p>
          </div>
        </div>
      )}

      {/* Scanning stage */}
      {stage === "scanning" && (
        <div className="px-5 pt-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-start gap-4 mb-5">
              {preview && (
                <img
                  src={preview}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                  alt="Uploaded screenshot"
                />
              )}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  <p className="font-semibold text-gray-900 text-sm">Reading your screenshot...</p>
                </div>
                <p className="text-xs text-gray-500">Analyzing transaction metadata</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <ScanLine size={14} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Extracting UTR number</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-10 gap-3">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <ScanLine size={28} className="text-blue-300" />
            </div>
            <p className="text-center text-xs text-gray-400 leading-relaxed">
              This usually takes 2-3 seconds<br />as we verify banking patterns.
            </p>
          </div>
        </div>
      )}

      {/* Confirm stage — bottom sheet modal */}
      {stage === "confirm" && (
        <>
          {/* Blurred background showing previous stage */}
          <div className="px-5 pt-6 filter blur-sm pointer-events-none">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-400">Scanning Receipt...</p>
            </div>
          </div>
          <UTRConfirmModal
            utr={extractedUTR}
            onConfirm={handleConfirm}
            onManual={handleManual}
          />
        </>
      )}

      <BottomNav />
    </div>
  );
}
