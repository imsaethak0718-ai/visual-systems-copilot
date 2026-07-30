import json
from fastapi import APIRouter

from app.core.extractor import extractor
from app.core.gemma_client import client
from app.core.storage import store

router = APIRouter(prefix="/documentation", tags=["documentation"])


@router.get("")
async def documentation():
    uploaded_files = store.get_latest_files()
    if not uploaded_files:
        return {
            "markdown": "# System Documentation\n\nPlease upload engineering diagrams and notes to generate documentation.",
            "status": "empty"
        }

    extracted_chunks = []
    for item in uploaded_files:
        text = extractor.extract_text(item["path"])
        if text:
            extracted_chunks.append(f"File: {item['filename']}\n{text}\n")

    analysis_context = store.get_latest_analysis() or {}
    combined_text = "\n\n".join(extracted_chunks)
    
    prompt = f"""
You are an expert technical writer and engineering systems assistant.
You must ONLY use the uploaded files and architecture context below to write the documentation. Do not invent components.
If there is no context, state that no context is available.

Write a comprehensive, professional Markdown (.md) document detailing this system's architecture, components, risks, and recommendations based on the provided context.

Uploaded files content:
{combined_text}

Latest analysis context:
{json.dumps(analysis_context, indent=2)}

Output ONLY valid Markdown text.
"""

    reply_text = client.chat_reply(prompt)
    
    # Strip markdown block ticks if Gemma includes them
    if reply_text.startswith("```markdown"):
        reply_text = reply_text.split("```markdown", 1)[1]
        if reply_text.endswith("```"):
            reply_text = reply_text.rsplit("```", 1)[0]
    elif reply_text.startswith("```"):
        reply_text = reply_text.split("```", 1)[1]
        if reply_text.endswith("```"):
            reply_text = reply_text.rsplit("```", 1)[0]

    return {
        "markdown": reply_text.strip(),
        "status": "ok"
    }
