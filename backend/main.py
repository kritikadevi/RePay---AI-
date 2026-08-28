
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.payment_router import router as payment_router


# ==========================================
# CREATE FASTAPI APP
# ==========================================

app = FastAPI(
    title="RePay API",
    description="AI-Powered Autonomous Payment Recovery Agent",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

configured_origins = os.getenv("CORS_ORIGINS", "").split(",")
allowed_origins = [
    origin.strip()
    for origin in configured_origins
    if origin.strip()
]

allowed_origins.extend([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://repay-ai.onrender.com",
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# INCLUDE PAYMENT ROUTER
# ==========================================

app.include_router(payment_router)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Welcome to RePay AI Payment Recovery Agent"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }