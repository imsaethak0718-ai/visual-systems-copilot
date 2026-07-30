from __future__ import annotations

import json
import os
from typing import Any
from PIL import Image
from dotenv import load_dotenv

from google import genai
from google.genai import types

# Load env variables from .env if present
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))

class GemmaClient:
    def _fetch_api_key(self) -> str | None:
        return (
            os.getenv("GEMINI_API_KEY")
            or os.getenv("gemma431bit")
            or os.getenv("GEMMA_API_KEY")
            or os.getenv("GOOGLE_API_KEY")
        )

    def __init__(self) -> None:
        self.api_key = self._fetch_api_key()
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None
        self.primary_model = os.getenv("GEMMA_MODEL", "gemma-4-31b-it")
        self.candidate_models = [self.primary_model, "gemini-2.0-flash", "gemini-2.5-flash", "gemini-3.6-flash"]

    def _get_client(self):
        # Refresh API key if it was updated in environment dynamically
        api_key = self._fetch_api_key()
        if api_key != self.api_key:
            self.api_key = api_key
            self.client = genai.Client(api_key=self.api_key) if self.api_key else None
        return self.client

    def _normalize_payload(self, data: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(data, dict):
            return {}

        # Handle nested wrappers like system_architecture or architecture
        for wrapper_key in ["system_architecture", "architecture", "analysis", "data"]:
            if wrapper_key in data and isinstance(data[wrapper_key], dict):
                inner = data[wrapper_key]
                for k, v in inner.items():
                    if k not in data:
                        data[k] = v

        summary = data.get("Summary") or data.get("summary") or "Architecture analyzed successfully."
        
        # Components
        raw_components = data.get("Components") or data.get("components") or data.get("nodes") or []
        components = []
        if isinstance(raw_components, list):
            for c in raw_components:
                if isinstance(c, dict):
                    name = c.get("name") or c.get("id") or "Unnamed Service"
                    components.append({
                        "name": str(name),
                        "type": str(c.get("type") or "Service"),
                        "description": str(c.get("description") or ""),
                        "technology": str(c.get("technology") or c.get("tech") or "Unknown"),
                        "dependencies": c.get("dependencies") or [],
                        "risk_level": str(c.get("risk_level") or c.get("risk") or "Low"),
                        "confidence": c.get("confidence", 90),
                    })

        # Relationships
        raw_relationships = data.get("Relationships") or data.get("relationships") or data.get("connections") or data.get("edges") or []
        relationships = []
        if isinstance(raw_relationships, list):
            for r in raw_relationships:
                if isinstance(r, dict):
                    src = r.get("from_component") or r.get("source") or r.get("from") or ""
                    tgt = r.get("to_component") or r.get("target") or r.get("to") or ""
                    if src and tgt:
                        relationships.append({
                            "from_component": str(src),
                            "to_component": str(tgt),
                            "description": str(r.get("description") or ""),
                            "confidence": r.get("confidence", 90),
                        })

        # Risks
        raw_risks = data.get("Risks") or data.get("risks") or []
        risks = []
        if isinstance(raw_risks, list):
            for r in raw_risks:
                if isinstance(r, dict):
                    risks.append({
                        "severity": str(r.get("severity") or "Medium"),
                        "title": str(r.get("title") or "Potential Issue"),
                        "description": str(r.get("description") or ""),
                        "rationale": str(r.get("rationale") or ""),
                        "confidence": r.get("confidence", 90),
                    })

        recommendations = data.get("Recommendations") or data.get("recommendations") or []
        if not isinstance(recommendations, list):
            recommendations = [str(recommendations)]

        health = data.get("Health") or data.get("health") or {
            "overall": 85,
            "security": 80,
            "performance": 85,
            "scalability": 90,
            "maintainability": 85,
            "reliability": 85,
        }

        return {
            "Summary": str(summary),
            "Components": components,
            "Relationships": relationships,
            "Risks": risks,
            "Recommendations": recommendations,
            "Metadata": data.get("Metadata") or {"confidence": 90},
            "Health": health,
        }

    def analyze_payload(self, prompt: str, images: list[Image.Image] = None) -> dict[str, Any]:
        client = self._get_client()
        if not self.api_key or not client:
            return {
                "Summary": "Gemma analysis unavailable because GEMINI_API_KEY is not configured.",
                "Components": [],
                "Relationships": [],
                "Risks": [
                    {
                        "severity": "High",
                        "title": "API Key Missing",
                        "description": "GEMINI_API_KEY is not set in backend/.env. Configure your API key to run live multimodal Gemma analysis.",
                        "rationale": "Missing API Key",
                        "confidence": 100
                    }
                ],
                "Recommendations": ["Add GEMINI_API_KEY=your_key to backend/.env file"],
                "Metadata": {"model": self.primary_model, "confidence": 0},
                "Health": {"overall": 0, "security": 0, "performance": 0, "scalability": 0, "maintainability": 0, "reliability": 0},
            }
            
        contents = [prompt]
        if images:
            contents.extend(images)

        last_error = None
        for model in self.candidate_models:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )
                text = response.text or ""
                try:
                    res_dict = json.loads(text)
                    if isinstance(res_dict, dict) and res_dict:
                        return self._normalize_payload(res_dict)
                except json.JSONDecodeError:
                    cleaned = text.strip().strip("```json").strip("```").strip()
                    try:
                        res_dict = json.loads(cleaned)
                        if isinstance(res_dict, dict) and res_dict:
                            return self._normalize_payload(res_dict)
                    except Exception:
                        pass
            except Exception as e:
                print(f"[GemmaClient] Error with model {model}: {e}")
                last_error = str(e)

        return {
            "Summary": f"Analysis failed: {last_error or 'Unable to parse API response'}",
            "Components": [],
            "Relationships": [],
            "Risks": [
                {
                    "severity": "High",
                    "title": "Analysis Generation Error",
                    "description": str(last_error or "LLM generation encountered an error."),
                    "rationale": "Model execution error",
                    "confidence": 0
                }
            ],
            "Recommendations": ["Check GEMINI_API_KEY permissions and model availability."],
            "Metadata": {"model": self.primary_model, "confidence": 0, "error": str(last_error)},
            "Health": {"overall": 0, "security": 0, "performance": 0, "scalability": 0, "maintainability": 0, "reliability": 0},
        }

    def chat_reply(self, prompt: str) -> str:
        client = self._get_client()
        if not self.api_key or not client:
            return "Gemma is unavailable because GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY to your backend/.env file."

        last_error = None
        for model in self.candidate_models:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                if response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[GemmaClient] Error with model {model}: {e}")
                last_error = str(e)

        return f"Error contacting AI model: {last_error or 'Unknown error'}"


client = GemmaClient()

