import io
import time
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, File, UploadFile
from PIL import Image

from app.core.extractor import extractor
from app.core.gemma_client import client
from app.core.storage import store

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("")
async def analyze_data(files: Optional[List[UploadFile]] = File(None)):
    started = time.perf_counter()
    
    if files:
        try:
            store.save_files(files)
        except Exception as e:
            print(f"[Analyze] Error saving files to store: {e}")

    uploaded_files = store.get_latest_files()
    if not uploaded_files and not files:
        return {"Summary": "No files were uploaded.", "Components": [], "Relationships": [], "Risks": [], "Recommendations": [], "Metadata": {}, "Health": {}}

    extracted_chunks = []
    images = []
    processed_filenames = []

    # Process uploaded files directly from request memory if provided
    if files:
        for upload in files:
            if not upload.filename:
                continue
            processed_filenames.append(upload.filename)
            filename = upload.filename
            suffix = Path(filename).suffix.lower()
            content_bytes = await upload.read()
            
            if suffix in {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff"}:
                try:
                    img = Image.open(io.BytesIO(content_bytes)).convert('RGB')
                    img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
                    images.append(img)
                except Exception as e:
                    print(f"Error loading uploaded image {filename}: {e}")
            elif suffix == ".txt":
                try:
                    extracted_chunks.append(f"File: {filename}\n{content_bytes.decode('utf-8', errors='ignore')}\n")
                except Exception:
                    pass
    else:
        for item in uploaded_files:
            path = Path(item["path"])
            processed_filenames.append(item["filename"])
            suffix = path.suffix.lower()
            
            text = extractor.extract_text(item["path"])
            if text:
                extracted_chunks.append(f"File: {item['filename']}\n{text}\n")
                
            if suffix in {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff"} and path.exists():
                try:
                    img = Image.open(path).convert('RGB')
                    img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
                    images.append(img)
                except Exception as e:
                    print(f"Error loading image {path}: {e}")

    combined_text = "\n\n".join(extracted_chunks)
    prompt = f"""
You are analyzing engineering documents and images for a system architecture review.
Use the combined content from all uploaded files and provided images below.
Reason across ALL files as one system. Do not analyze them independently. Extract architecture,
components, APIs, databases, services, authentication, data flows, dependencies, missing links,
risks, bottlenecks, and recommendations. State only evidence-supported conclusions.
Return valid JSON with exactly these top-level keys:
Summary, Components, Relationships, Risks, Recommendations, Metadata, Health.
Components items: name, type, description, technology, dependencies, risk_level, confidence (0-100).
Relationships items: from_component, to_component, description, confidence (0-100).
Risks items: severity (Critical|High|Medium|Low), title, description, rationale, confidence (0-100).
Metadata: confidence (0-100), files_processed (array of names), model. Health: overall, security,
performance, scalability, maintainability, reliability (each 0-100).

Files content:
{combined_text}
"""

    payload = client.analyze_payload(prompt, images=images)
    payload.setdefault("Metadata", {})
    payload["Metadata"].update({
        "files_processed": processed_filenames or [item["filename"] for item in uploaded_files],
        "processing_time_ms": round((time.perf_counter() - started) * 1000),
        "model": getattr(client, "primary_model", "Gemma"),
    })
    store.save_analysis(payload)
    return payload
