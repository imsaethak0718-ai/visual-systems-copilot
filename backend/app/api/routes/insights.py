import json

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.gemma_client import client
from app.core.storage import store

router = APIRouter(prefix="/insights", tags=["insights"])


class WhyRequest(BaseModel):
    insight: dict


@router.post("/why")
async def explain_why(request: WhyRequest):
    context = store.get_latest_analysis() or {}
    prompt = f"""You are Gemma, an engineering architecture reviewer. Explain the evidence for
this finding in at most three plain-language sentences. Do not invent evidence.
Finding: {json.dumps(request.insight)}
System analysis: {json.dumps(context)}
Return JSON: {{\"explanation\": \"...\"}}"""
    try:
        reply = json.loads(client.chat_reply(prompt))
        return {"explanation": reply.get("explanation", "No evidence explanation was returned.")}
    except (TypeError, ValueError):
        return {"explanation": request.insight.get("rationale") or "This finding was inferred from the relationships and labels extracted across the uploaded files."}
