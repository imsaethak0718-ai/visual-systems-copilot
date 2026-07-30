import json
import os
import shutil
from pathlib import Path
from typing import Any, List

from fastapi import UploadFile


class UploadStore:
    def __init__(self, base_dir: Path | None = None) -> None:
        if base_dir:
            self.base_dir = base_dir
        else:
            tmp_dir = Path("/tmp") if Path("/tmp").exists() else Path(__file__).resolve().parents[1]
            self.base_dir = tmp_dir / "uploads"
        
        try:
            self.base_dir.mkdir(parents=True, exist_ok=True)
        except Exception:
            pass

        self._latest_files_file = self.base_dir / "latest_files.json"
        self._latest_analysis_file = self.base_dir / "latest_analysis.json"
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
        try:
            self._latest_files_file.write_text(json.dumps(saved_files))
        except Exception:
            pass
        return saved_files

    def get_latest_files(self) -> List[dict]:
        if self._latest_files:
            return list(self._latest_files)
        if self._latest_files_file.exists():
            try:
                return json.loads(self._latest_files_file.read_text())
            except Exception:
                pass
        return []

    def save_analysis(self, payload: dict[str, Any]) -> dict[str, Any]:
        self._latest_analysis = payload
        try:
            self._latest_analysis_file.write_text(json.dumps(payload))
        except Exception:
            pass
        return payload

    def get_latest_analysis(self) -> dict[str, Any] | None:
        if self._latest_analysis:
            return self._latest_analysis
        if self._latest_analysis_file.exists():
            try:
                return json.loads(self._latest_analysis_file.read_text())
            except Exception:
                pass
        return None


store = UploadStore()
