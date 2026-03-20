"""
Financial Sentinel — Transaction Status Engine

This module contains the mock transaction state machine for the MVP.
In production, replace lookup_utr() with a real NPCI UDIR API call.

Status logic:
  GREEN  — Safe to pay again. Either no debit occurred, or debit happened
           but transaction was aborted. Merchant will never receive payment.
  YELLOW — Do not pay yet. Transaction is in-flight. Paying again risks
           a duplicate charge. User should wait ~10 minutes and retry.
  RED    — Do not pay again. Transaction confirmed successful. Merchant
           has received or will receive the funds.
"""

# ── Mock transaction state machine ────────────────────────────────────────────
# Keyed by UTR number. In production this is replaced by a real API call.
# UTR prefix mapping (first 4 digits) → issuing bank is also defined below.

MOCK_TRANSACTIONS = {
    # S1 — Technical decline, no debit
    "111111111111": {
        "status": "GREEN",
        "headline": "Safe to pay again.",
        "subtext": "Your original payment was not completed. The merchant will not receive it.",
        "refund_message": "Refund of Rs. 499 by 24 March 2026.",
        "utr": "111111111111",
        "amount": "₹499.00",
        "merchant": "Swiggy",
        "date": "12 Mar, 14:32",
        "payer_bank": "HDFC Bank",
        "txn_status": "Aborted",
        "institution": "NPCI Gateway",
        "rbi_deadline": "24 Mar 2026",
        "days_left": 2,
    },
    # S3 — In-flight / pending (dangerous scenario)
    "222222222222": {
        "status": "YELLOW",
        "headline": "Do not pay yet.",
        "subtext": "Your transaction is still being processed. Paying again risks a duplicate charge.",
        "refund_message": None,
        "utr": "222222222222",
        "amount": "₹1,499.00",
        "merchant": "Cloud Kitchen Services",
        "date": "24 Oct, 14:22",
        "payer_bank": "ICICI Bank",
        "txn_status": "Pending",
        "institution": "NPCI Switch",
        "rbi_deadline": None,
        "days_left": None,
    },
    # S4 — Transaction successful
    "333333333333": {
        "status": "RED",
        "headline": "Do not pay again.",
        "subtext": "Your payment was successful. The merchant has received or will receive the funds.",
        "refund_message": None,
        "utr": "333333333333",
        "amount": "₹4,250.00",
        "merchant": "Cloud Retail Pvt Ltd",
        "date": "May 12, 14:32",
        "payer_bank": "SBI",
        "txn_status": "Successful",
        "institution": "NPCI Gateway",
        "rbi_deadline": None,
        "days_left": None,
    },
    # S6 — Timeout, auto-reversal initiated
    "444444444444": {
        "status": "GREEN",
        "headline": "Safe to pay again.",
        "subtext": "Transaction timed out at the NPCI switch. Auto-reversal has been initiated.",
        "refund_message": "Refund of Rs. 2,100 by 22 March 2026.",
        "utr": "444444444444",
        "amount": "₹2,100.00",
        "merchant": "Zomato",
        "date": "18 Mar, 10:15",
        "payer_bank": "Axis Bank",
        "txn_status": "Timeout",
        "institution": "NPCI Switch",
        "rbi_deadline": "22 Mar 2026",
        "days_left": 4,
    },
    # S5 — Deemed approved, manual review
    "555555555555": {
        "status": "YELLOW",
        "headline": "Do not pay yet.",
        "subtext": "Transaction has been deemed approved and is pending manual review. Wait for your bank to confirm.",
        "refund_message": None,
        "utr": "555555555555",
        "amount": "₹850.00",
        "merchant": "BookMyShow",
        "date": "19 Mar, 18:45",
        "payer_bank": "Kotak Bank",
        "txn_status": "Deemed Approved",
        "institution": "Beneficiary Bank",
        "rbi_deadline": None,
        "days_left": None,
    },
    # S2 — Debited, aborted (most critical scenario)
    "666666666666": {
        "status": "GREEN",
        "headline": "Safe to pay again.",
        "subtext": "Money was debited but the transaction was aborted. The merchant will never receive this payment.",
        "refund_message": "Refund of Rs. 750 by 21 March 2026.",
        "utr": "666666666666",
        "amount": "₹750.00",
        "merchant": "Blinkit",
        "date": "20 Mar, 09:30",
        "payer_bank": "Axis Bank",
        "txn_status": "Aborted",
        "institution": "Beneficiary Bank",
        "rbi_deadline": "21 Mar 2026",
        "days_left": 1,
    },
}

# ── Bank name mapping from UTR prefix ─────────────────────────────────────────
# First 4 digits of a UTR typically identify the originating bank.
# This is a partial mapping for demo purposes.

UTR_BANK_PREFIX = {
    "1234": "HDFC Bank",
    "4567": "ICICI Bank",
    "7890": "SBI",
    "2345": "Axis Bank",
    "5678": "Kotak Bank",
    "8901": "Yes Bank",
    "3456": "PNB",
    "6789": "Bank of Baroda",
    "9012": "Canara Bank",
    "0123": "Union Bank",
}

# ── RBI TAT reference table ────────────────────────────────────────────────────
# Source: RBI circular DPSS.CO.OD No.629/06.08.005/2019-20
# Last updated: March 2026

RBI_TAT = {
    "bank_credit_failure": {"days": 1, "label": "T+1"},
    "technical_decline": {"days": 0, "label": "T+0 (same day)"},
    "npci_timeout": {"days": 5, "label": "T+5"},
    "merchant_settlement": {"days": 1, "label": "T+1"},
    "duplicate_txn": {"days": 0, "label": "T+0"},
    "amount_mismatch": {"days": 1, "label": "T+1"},
}


def lookup_utr(utr: str) -> dict | None:
    """
    Look up a UTR and return the transaction status object.
    Returns None if UTR is not found.

    In production: replace with NPCI UDIR API call.
    """
    return MOCK_TRANSACTIONS.get(utr)


def get_bank_from_utr(utr: str) -> str:
    """
    Attempt to identify the originating bank from UTR prefix.
    Falls back to 'Unknown Bank' if prefix not mapped.
    """
    prefix = utr[:4]
    return UTR_BANK_PREFIX.get(prefix, "Unknown Bank")


def get_rbi_tat(failure_type: str) -> dict:
    """
    Return the RBI-mandated TAT for a given failure type.
    """
    return RBI_TAT.get(failure_type, {"days": 5, "label": "T+5"})
