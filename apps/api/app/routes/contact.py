"""
Contact form endpoint
"""
from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging

from app.models.contact import ContactRequest, ContactResponse
from app.utils.email import send_contact_email

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/contact", response_model=ContactResponse)
@limiter.limit("5/minute")  # Rate limit: 5 requests per minute
async def submit_contact_form(request: Request, contact: ContactRequest):
    """
    Handle contact form submission
    
    - Validates input
    - Checks rate limits
    - Sends email notification
    """
    try:
        # Log submission (without PII in production)
        logger.info(f"Contact form submission from {contact.email}")
        
        # Send email
        email_sent = await send_contact_email(
            name=contact.name,
            email=contact.email,
            message=contact.message
        )
        
        if not email_sent:
            raise HTTPException(
                status_code=500,
                detail="Failed to send email. Please try again later."
            )
        
        return ContactResponse(
            success=True,
            message="Thank you for your message! I'll get back to you soon."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred. Please try again later."
        )
