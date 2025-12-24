"""
Email sending utility using SendGrid
"""
import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)

async def send_contact_email(name: str, email: str, message: str) -> bool:
    """
    Send contact form email via SendGrid
    
    Args:
        name: Sender's name
        email: Sender's email
        message: Message content
        
    Returns:
        bool: True if email sent successfully
    """
    try:
        # Get environment variables
        sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        from_email = os.getenv("FROM_EMAIL", "noreply@yourdomain.com")
        to_email = os.getenv("TO_EMAIL", "your@email.com")
        
        if not sendgrid_api_key:
            logger.error("SENDGRID_API_KEY not configured")
            return False
        
        # Create email
        email_content = f"""
        New contact form submission:
        
        Name: {name}
        Email: {email}
        
        Message:
        {message}
        """
        
        mail = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=f"Portfolio Contact: {name}",
            plain_text_content=email_content
        )
        
        # Send email
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(mail)
        
        logger.info(f"Email sent successfully. Status code: {response.status_code}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False
