const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const lookupUTR = async (utr) => {
  try {
    const res = await fetch(`${API_URL}/check-utr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ utr }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      status: data.status,
      headline: data.headline,
      subtext: data.subtext,
      refundMessage: data.refund_message,
      utr: data.utr,
      amount: data.amount,
      merchant: data.merchant,
      date: data.date,
      payerBank: data.payer_bank,
      txnStatus: data.txn_status,
      institution: data.institution,
      rbiDeadline: data.rbi_deadline,
      daysLeft: data.days_left,
      found: data.found,
    };
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
};

export const uploadScreenshot = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/ocr-scan`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("OCR error:", err);
    return null;
  }
};

export const fetchDisputes = async () => {
  try {
    const res = await fetch(`${API_URL}/disputes`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.disputes;
  } catch (err) {
    console.error("Disputes error:", err);
    return [];
  }
};

export const mockDisputes = [
  {
    id: 1,
    utr: "938420114562",
    amount: "₹12,450.00",
    date: "12 Oct 2023",
    status: "UNDER REVIEW",
    statusColor: "amber",
    rbiDeadline: "Overdue",
    daysLabel: "-2 Days remaining",
    overdue: true,
  },
  {
    id: 2,
    utr: "112049583722",
    amount: "₹450.00",
    date: "14 Oct 2023",
    status: "RESOLVED",
    statusColor: "green",
    rbiDeadline: "RBI Deadline",
    daysLabel: "12 Days left",
    overdue: false,
  },
  {
    id: 3,
    utr: "884732110293",
    amount: "₹2,999.00",
    date: "15 Oct 2023",
    status: "EVIDENCE REQ.",
    statusColor: "red",
    rbiDeadline: "RBI Deadline",
    daysLabel: "5 Days left",
    overdue: false,
  },
];