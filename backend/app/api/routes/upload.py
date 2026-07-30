from fastapi import APIRouter, File, UploadFile

from app.core.storage import store

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_file(files: list[UploadFile] = File(...)):
    saved_files = store.save_files(files)
    return {
        "message": "Files uploaded successfully",
        "filenames": [item["filename"] for item in saved_files],
        "count": len(saved_files),
    }
