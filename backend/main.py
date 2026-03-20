from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

from status_engine import lookup_utr
from ocr import extract_utr_from_image

app = FastAPI(
    title="Financial Sentinel API",
    description="UPI Dispute Resolution Tracker — Backend API",
    version="1.0.0"
)

# Allow frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://financial-sentinel-8qpe.vercel.app"],  # Tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ────────────────────────────────────────────────────────────────────

class UTRRequest(BaseModel):
    utr: str

class StatusResponse(BaseModel):
    status: str                    # GREEN | YELLOW | RED
    headline: str
    subtext: str
    refund_message: Optional[str]
    utr: str
    amount: str
    merchant: str
    date: str
    payer_bank: str
    txn_status: str
    institution: str
    rbi_deadline: Optional[str]
    days_left: Optional[int]
    found: bool

class OCRResponse(BaseModel):
    utr: Optional[str]
    confidence: float
    found: bool
    error: Optional[str]


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Financial Sentinel API is running.", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/check-utr", response_model=StatusResponse)
def check_utr(request: UTRRequest):
    """
    Look up a UTR number and return the pay-again status.
    Returns GREEN, YELLOW, or RED with full transaction context.
    """
    utr = request.utr.strip()

    if not utr.isdigit() or len(utr) != 12:
        raise HTTPException(
            status_code=400,
            detail="UTR must be exactly 12 digits."
        )

    result = lookup_utr(utr)

    if not result:
        return StatusResponse(
            status="UNKNOWN",
            headline="UTR not found.",
            subtext="We could not find this transaction in our system. Please check the UTR number and try again.",
            refund_message=None,
            utr=utr,
            amount="Unknown",
            merchant="Unknown",
            date="Unknown",
            payer_bank="Unknown",
            txn_status="Unknown",
            institution="Unknown",
            rbi_deadline=None,
            days_left=None,
            found=False
        )

    return StatusResponse(**result, found=True)


@app.post("/ocr-scan", response_model=OCRResponse)
async def ocr_scan(file: UploadFile = File(...)):
    """
    Accept a screenshot upload, run OCR, and extract the UTR number.
    Supports JPG, PNG, PDF.
    """
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Please upload JPG, PNG, or PDF."
        )

    contents = await file.read()

    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

    result = extract_utr_from_image(contents, file.content_type)
    return result


@app.get("/disputes")
def get_disputes():
    """
    Return mock dispute list for the dashboard.
    In production this would query a database filtered by user session.
    """
    return {
        "disputes": [
            {
                "id": 1,
                "utr": "938420114562",
                "amount": "12450.00",
                "currency": "INR",
                "date": "12 Oct 2023",
                "status": "UNDER REVIEW",
                "status_color": "amber",
                "rbi_deadline": "Overdue",
                "days_label": "-2 Days remaining",
                "overdue": True,
            },
            {
                "id": 2,
                "utr": "112049583722",
                "amount": "450.00",
                "currency": "INR",
                "date": "14 Oct 2023",
                "status": "RESOLVED",
                "status_color": "green",
                "rbi_deadline": "RBI Deadline",
                "days_label": "12 Days left",
                "overdue": False,
            },
            {
                "id": 3,
                "utr": "884732110293",
                "amount": "2999.00",
                "currency": "INR",
                "date": "15 Oct 2023",
                "status": "EVIDENCE REQ.",
                "status_color": "red",
                "rbi_deadline": "RBI Deadline",
                "days_label": "5 Days left",
                "overdue": False,
            },
        ]
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
