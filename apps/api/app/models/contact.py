"""
Pydantic models for contact form
"""
from pydantic import BaseModel, EmailStr, Field

class ContactRequest(BaseModel):
    """Contact form request model"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=5000)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "message": "Hello, I'd like to discuss a project..."
            }
        }

class ContactResponse(BaseModel):
    """Contact form response model"""
    success: bool
    message: str
