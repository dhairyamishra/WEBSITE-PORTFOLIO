"""
Health check endpoint
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    Returns 200 if service is running
    """
    return {
        "status": "ok",
        "service": "portfolio-api",
        "version": "1.0.0"
    }
