from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import upload, analyze, chat, documentation, insights

app = FastAPI(
    title="Visual Systems Copilot API",
    version="1.0.0",
    description="Dummy FastAPI backend for visual systems copilot features",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(chat.router)
app.include_router(documentation.router)
app.include_router(insights.router)

app.include_router(upload.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(documentation.router, prefix="/api")
app.include_router(insights.router, prefix="/api")

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
