"""
Financial Sentinel — OCR Module

Extracts UTR numbers from payment screenshots using Google Vision API.
Falls back to a mock extraction for demo/development when no API key is set.

To enable real OCR:
  1. Create a Google Cloud project
  2. Enable the Vision API
  3. Download a service account JSON key
  4. Set: GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
  5. Or set: GOOGLE_VISION_API_KEY=your_api_key in .env
"""

import re
import os
from typing import Optional


# ── UTR extraction patterns ────────────────────────────────────────────────────
# UPI UTR numbers are typically 12 digits.
# Different banks and apps label them differently.

UTR_PATTERNS = [
    r'\bUTR[:\s#]*([0-9]{12})\b',           # UTR: 123456789012
    r'\bRef[:\s#]*([0-9]{12})\b',            # Ref: 123456789012
    r'\bTransaction ID[:\s#]*([0-9]{12})\b', # Transaction ID: 123456789012
    r'\bTxn ID[:\s#]*([0-9]{12})\b',         # Txn ID: 123456789012
    r'\bUPI Ref[:\s#]*([0-9]{12})\b',        # UPI Ref: 123456789012
    r'\b([0-9]{12})\b',                      # Fallback: any 12-digit number
]


def extract_utr_from_text(text: str) -> Optional[str]:
    """
    Extract a UTR number from raw OCR text using regex patterns.
    Tries labelled patterns first, then falls back to bare 12-digit number.
    """
    for pattern in UTR_PATTERNS[:-1]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)

    # Fallback: find all 12-digit numbers and return the most likely one
    bare_matches = re.findall(r'\b([0-9]{12})\b', text)
    if bare_matches:
        # Prefer matches that don't look like phone numbers or account numbers
        for match in bare_matches:
            if not match.startswith('9') and not match.startswith('8'):
                return match
        return bare_matches[0]

    return None


def extract_utr_from_image(image_bytes: bytes, content_type: str) -> dict:
    """
    Main OCR function. Uses Google Vision API if credentials are available,
    otherwise returns a mock result for development.
    """

    # Check if Google Vision credentials are configured
    has_credentials = (
        os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or
        os.getenv("GOOGLE_VISION_API_KEY")
    )

    if has_credentials:
        return _extract_with_google_vision(image_bytes, content_type)
    else:
        return _mock_extraction()


def _extract_with_google_vision(image_bytes: bytes, content_type: str) -> dict:
    """
    Use Google Vision API for real OCR extraction.
    """
    try:
        from google.cloud import vision

        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=image_bytes)
        response = client.text_detection(image=image)

        if response.error.message:
            return {
                "utr": None,
                "confidence": 0.0,
                "found": False,
                "error": f"Vision API error: {response.error.message}"
            }

        texts = response.text_annotations
        if not texts:
            return {
                "utr": None,
                "confidence": 0.0,
                "found": False,
                "error": "No text detected in the image."
            }

        full_text = texts[0].description
        utr = extract_utr_from_text(full_text)

        if utr:
            return {
                "utr": utr,
                "confidence": 0.95,
                "found": True,
                "error": None
            }
        else:
            return {
                "utr": None,
                "confidence": 0.0,
                "found": False,
                "error": "Could not find a UTR number in the screenshot. Please enter it manually."
            }

    except ImportError:
        return {
            "utr": None,
            "confidence": 0.0,
            "found": False,
            "error": "Google Vision library not installed. Run: pip install google-cloud-vision"
        }
    except Exception as e:
        return {
            "utr": None,
            "confidence": 0.0,
            "found": False,
            "error": f"OCR failed: {str(e)}"
        }


def _mock_extraction() -> dict:
    """
    Mock OCR result for development/demo when no API key is configured.
    Always returns a fixed UTR that maps to the GREEN scenario.
    """
    return {
        "utr": "426110837291",
        "confidence": 0.97,
        "found": True,
        "error": None
    }
