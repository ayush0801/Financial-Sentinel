import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import StatusResult from "./pages/StatusResult";
import Disputes from "./pages/Disputes";
import OCRScan from "./pages/OCRScan";
import Escalation from "./pages/Escalation";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-sm bg-white min-h-screen relative shadow-xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/status" element={<StatusResult />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/ocr" element={<OCRScan />} />
            <Route path="/escalation" element={<Escalation />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
