from __future__ import annotations

import os
from pathlib import Path
from typing import List

import fitz
from PIL import Image

try:
    import pytesseract
except ImportError:  # pragma: no cover - optional runtime dependency
    pytesseract = None


class FileExtractor:
    def extract_text(self, file_path: str) -> str:
        path = Path(file_path)
        suffix = path.suffix.lower()

        if suffix in {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff"}:
            return self._extract_image_text(path)
        if suffix == ".pdf":
            return self._extract_pdf_text(path)
        if suffix == ".txt":
            return path.read_text(encoding="utf-8", errors="ignore")
        return ""

    def _extract_image_text(self, path: Path) -> str:
        try:
            if pytesseract is None:
                return ""
            image = Image.open(path)
            return pytesseract.image_to_string(image).strip()
        except Exception:
            return ""

    def _extract_pdf_text(self, path: Path) -> str:
        try:
            doc = fitz.open(path)
            parts: List[str] = []
            for page in doc:
                parts.append(page.get_text())
            return "\n\n".join(part for part in parts if part).strip()
        except Exception:
            return ""


extractor = FileExtractor()
