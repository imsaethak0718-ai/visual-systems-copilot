from __future__ import annotations

import shutil
from pathlib import Path
from typing import Any, List

from fastapi import UploadFile


class UploadStore:
    def __init__(self, base_dir: Path | None = None) -> None:
        self.base_dir = base_dir or Path(__file__).resolve().parents[1] / "uploads"
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self._latest_files: List[dict] = []
        self._latest_analysis: dict[str, Any] | None = None

    def save_files(self, files: List[UploadFile]) -> List[dict]:
        saved_files: List[dict] = []
        for upload in files:
            if not upload.filename:
                continue
            safe_name = Path(upload.filename).name
            destination = self.base_dir / f"{len(saved_files)}_{safe_name}"
            with destination.open("wb") as buffer:
                shutil.copyfileobj(upload.file, buffer)
            saved_files.append(
                {
                    "filename": safe_name,
                    "path": str(destination),
                    "content_type": upload.content_type or "application/octet-stream",
                }
            )
        self._latest_files = saved_files
        return saved_files

    def get_latest_files(self) -> List[dict]:
        return list(self._latest_files)

    def save_analysis(self, payload: dict[str, Any]) -> dict[str, Any]:
        self._latest_analysis = payload
        return payload

    def get_latest_analysis(self) -> dict[str, Any] | None:
        return self._latest_analysis


store = UploadStore()
