import { useNavigate, useLocation } from "react-router-dom";
import { Home, Wallet, ScanLine, HelpCircle } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Disputes", icon: Wallet, path: "/disputes" },
  { label: "OCR Scan", icon: ScanLine, path: "/ocr" },
  { label: "Support", icon: HelpCircle, path: "/support" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 z-50">
      <div className="flex items-center justify-around py-2 pb-safe">
        {tabs.map(({ label, icon: Icon, path }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
            >
              <div className={`p-2 rounded-xl transition-all ${active ? "bg-green-100" : ""}`}>
                <Icon
                  size={20}
                  className={active ? "text-green-700" : "text-gray-500"}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span
                className={`text-xs font-medium ${active ? "text-green-700" : "text-gray-500"}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
