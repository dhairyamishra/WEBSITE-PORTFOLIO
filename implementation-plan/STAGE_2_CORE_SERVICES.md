# Stage 2: Core Services Development
## Phases 2-4: Building Web, API, and Demos

**Duration:** 1-2 weeks  
**Prerequisites:** Stage 1 completed  
**Deliverables:** Functional Astro website, FastAPI backend, and Streamlit demos

---

## Overview

This stage focuses on building the three core services of your portfolio platform:
1. **Web (AstroWind)** - Static portfolio website based on AstroWind template with React islands
2. **API (FastAPI)** - Backend for contact form and future endpoints
3. **Demos (Streamlit)** - Interactive ML demonstrations

Each service will be developed and tested independently before containerization.

### AstroWind Implementation Notes

**What is AstroWind?**
- Professional Astro + Tailwind template for landing pages and portfolios
- Pre-built components, layouts, and responsive design
- Configured for static output (perfect for nginx deployment)

**Our Approach:**
- Use AstroWind as the base UI scaffold
- Remove blog and unused features
- Customize for portfolio: Home, About, Projects, Contact
- Keep static build mode (no SSR)
- Connect contact form to `/api/contact` endpoint

---

## Phase 2: Build the Astro Web (MVP)

### Objectives
- Create a fast, SEO-optimized portfolio website using AstroWind template
- Customize AstroWind for portfolio use (remove blog, keep only needed pages)
- Add React islands for interactive components
- Achieve Lighthouse 100 scores

> **Implementation Note:**  
> - Web UI uses **AstroWind** as the base template  
> - Deploy mode stays **static build**; nginx serves `/dist`  
> - Only customization required: remove unused AstroWind pages and connect contact form to `/api/contact`

---

### Task 2.1: Initialize from AstroWind Template

```bash
# Navigate to apps directory
cd apps

# Clone AstroWind template
npm create astro@latest web -- --template onwidget/astrowind

# Choose options:
# - TypeScript: Yes (strict)
# - Install dependencies: Yes
# - Git: No (already initialized)

cd web
```

**Verify AstroWind setup:**

```bash
# Check that it's configured for static output
# In astro.config.mjs, ensure: output: 'static'

# AstroWind comes with:
# - Tailwind CSS (already integrated)
# - React support (already integrated)
# - Sitemap (already integrated)
```

**Install any additional dependencies:**

```bash
# If needed for contact form
npm install clsx tailwind-merge
```

---

### Task 2.2: Verify and Update Astro Config

AstroWind comes pre-configured, but verify these settings in `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
// AstroWind already includes tailwind, react, sitemap, etc.

export default defineConfig({
  site: 'https://yourdomain.com', // Update with your domain
  output: 'static', // CRITICAL: Ensure this is 'static', not 'server'
  // AstroWind includes other integrations - keep them
  // Just verify output mode is static for nginx deployment
});
```

**Key verification:**
- ✅ `output: 'static'` - Required for nginx deployment
- ✅ Tailwind, React, Sitemap already configured by AstroWind
- ✅ No SSR adapters (Vercel, Netlify, Node) - we're deploying static files

---

### Task 2.3: Customize AstroWind Design (Optional)

AstroWind comes with a complete design system. You can either:
1. **Use as-is** - AstroWind's default styling is professional
2. **Customize** - Modify colors, fonts, components to match your brand

If customizing, update `src/styles/global.css` or AstroWind's existing styles:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: 59 130 246; /* blue-500 */
    --color-secondary: 139 92 246; /* violet-500 */
    --color-accent: 236 72 153; /* pink-500 */
    --color-background: 255 255 255;
    --color-text: 15 23 42; /* slate-900 */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: 15 23 42; /* slate-900 */
      --color-text: 248 250 252; /* slate-50 */
    }
  }

  body {
    @apply bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50;
    @apply transition-colors duration-200;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg;
    @apply transition-colors duration-200 font-medium;
  }

  .btn-secondary {
    @apply px-6 py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-50;
    @apply dark:hover:bg-blue-950 rounded-lg transition-colors duration-200 font-medium;
  }

  .card {
    @apply bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6;
    @apply border border-slate-200 dark:border-slate-700;
  }
}
```

Update `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
```

---

### Task 2.4: Create Base Layout

Create `src/layouts/Layout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Full-stack developer and ML enthusiast" } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    
    <!-- SEO -->
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    
    <!-- Fonts (optional) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="font-sans">
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
  
  body {
    font-family: 'Inter', system-ui, sans-serif;
  }
</style>
```

---

### Task 2.5: Create Navigation Component

Create `src/components/Navigation.astro`:

```astro
---
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Demos', href: '/demos' },
  { name: 'Contact', href: '/contact' },
];

const currentPath = Astro.url.pathname;
---

<nav class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <a href="/" class="text-2xl font-bold text-blue-500">
        Portfolio
      </a>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-8">
        {navItems.map((item) => (
          <a
            href={item.href}
            class={`transition-colors ${
              currentPath === item.href
                ? 'text-blue-500 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
            }`}
          >
            {item.name}
          </a>
        ))}
      </div>
      
      <!-- Mobile Menu Button (add mobile menu later if needed) -->
      <div class="md:hidden">
        <button class="text-slate-600 dark:text-slate-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>
```

---

### Task 2.6: Customize AstroWind Pages for Portfolio

**Remove unused AstroWind features:**
- Delete or disable blog-related pages (if you don't need a blog)
- Remove extra demo pages
- Keep only: Home, About, Projects, Contact

**Adapt existing AstroWind pages:**

#### Home Page: Customize `src/pages/index.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
---

<Layout title="Home - Your Name">
  <Navigation />
  
  <main>
    <!-- Hero Section -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
          Full-Stack Developer & ML Engineer
        </h1>
        <p class="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
          Building modern web applications and intelligent systems
        </p>
        <div class="flex gap-4 justify-center">
          <a href="/projects" class="btn-primary">View Projects</a>
          <a href="/contact" class="btn-secondary">Get in Touch</a>
        </div>
      </div>
    </section>
    
    <!-- Skills Section -->
    <section class="py-20 px-4 bg-slate-50 dark:bg-slate-800/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Skills & Technologies</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <!-- Add skill cards here -->
          <div class="card text-center">
            <h3 class="font-semibold mb-2">Frontend</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">React, Astro, TypeScript</p>
          </div>
          <div class="card text-center">
            <h3 class="font-semibold mb-2">Backend</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Python, FastAPI, Node.js</p>
          </div>
          <div class="card text-center">
            <h3 class="font-semibold mb-2">ML/AI</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">PyTorch, Streamlit, NLP</p>
          </div>
          <div class="card text-center">
            <h3 class="font-semibold mb-2">DevOps</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Docker, GCP, CI/CD</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Projects Section -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Featured Projects</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Project cards will be added via content collections -->
          <p class="text-center text-slate-600 dark:text-slate-400 col-span-full">
            Projects coming soon...
          </p>
        </div>
      </div>
    </section>
  </main>
  
  <!-- Footer -->
  <footer class="py-8 px-4 border-t border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto text-center text-slate-600 dark:text-slate-400">
      <p>&copy; 2025 Your Name. All rights reserved.</p>
    </div>
  </footer>
</Layout>
```

#### About Page: `src/pages/about.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
---

<Layout title="About - Your Name" description="Learn more about my background and experience">
  <Navigation />
  
  <main class="py-20 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-8">About Me</h1>
      
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <p class="text-xl text-slate-600 dark:text-slate-300 mb-6">
          I'm a full-stack developer and ML engineer passionate about building intelligent, user-friendly applications.
        </p>
        
        <h2 class="text-2xl font-bold mt-12 mb-4">Experience</h2>
        <div class="space-y-6">
          <!-- Add experience items -->
          <div class="card">
            <h3 class="font-semibold text-lg">Software Engineer</h3>
            <p class="text-slate-600 dark:text-slate-400">Company Name • 2023 - Present</p>
            <p class="mt-2">Description of role and achievements...</p>
          </div>
        </div>
        
        <h2 class="text-2xl font-bold mt-12 mb-4">Education</h2>
        <div class="card">
          <h3 class="font-semibold text-lg">Bachelor of Science in Computer Science</h3>
          <p class="text-slate-600 dark:text-slate-400">University Name • 2019 - 2023</p>
        </div>
      </div>
    </div>
  </main>
</Layout>
```

#### Projects Page: `src/pages/projects/index.astro`

```astro
---
import Layout from '../../layouts/Layout.astro';
import Navigation from '../../components/Navigation.astro';
---

<Layout title="Projects - Your Name" description="Explore my portfolio of projects">
  <Navigation />
  
  <main class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-8">Projects</h1>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Project cards will be dynamically generated -->
        <p class="text-slate-600 dark:text-slate-400 col-span-full">
          Projects will be added via content collections...
        </p>
      </div>
    </div>
  </main>
</Layout>
```

#### Contact Page: `src/pages/contact.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
import ContactForm from '../components/ContactForm';
---

<Layout title="Contact - Your Name" description="Get in touch with me">
  <Navigation />
  
  <main class="py-20 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-8">Get in Touch</h1>
      
      <p class="text-xl text-slate-600 dark:text-slate-300 mb-12">
        Have a question or want to work together? Send me a message!
      </p>
      
      <ContactForm client:load />
    </div>
  </main>
</Layout>
```

---

### Task 2.7: Create Contact Form (React Island)

Create `src/components/ContactForm.tsx`:

```typescript
import { useState, type FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
  honeypot: string; // Anti-spam field
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.honeypot) {
      console.log('Bot detected');
      return;
    }
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send message');
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />
      
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
      
      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
          ✅ Message sent successfully! I'll get back to you soon.
        </div>
      )}
      
      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
          ❌ {errorMessage}
        </div>
      )}
    </form>
  );
}
```

---

### Task 2.8: Test Astro Locally

```bash
# From apps/web directory
npm run dev

# Visit http://localhost:4321
# Test all pages and navigation
```

**Deliverable:** ✅ Functional Astro website with all core pages

---

## Phase 3: Build FastAPI API (MVP)

### Objectives
- Create a production-ready API for contact form
- Implement anti-spam measures
- Add email delivery integration
- Set up proper logging and error handling

---

### Task 3.1: Scaffold FastAPI Application

```bash
# Navigate to apps directory
cd apps

# Create API directory
mkdir api
cd api

# Create directory structure
mkdir -p app/routes app/models app/utils
touch app/__init__.py app/main.py
touch app/routes/__init__.py app/routes/health.py app/routes/contact.py
touch app/models/__init__.py app/models/contact.py
touch app/utils/__init__.py app/utils/email.py app/utils/rate_limit.py
```

---

### Task 3.2: Create `requirements.txt`

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
pydantic-settings==2.1.0
email-validator==2.1.0.post1
python-multipart==0.0.6
python-dotenv==1.0.0

# Email
sendgrid==6.11.0
# OR use mailgun if preferred:
# mailgun==0.1.1

# Rate limiting
slowapi==0.1.9

# CORS
python-jose[cryptography]==3.3.0

# Logging
python-json-logger==2.0.7
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### Task 3.3: Create Main Application

Create `app/main.py`:

```python
"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging

from app.routes import health, contact

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title="Portfolio API",
    description="Backend API for portfolio website",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(contact.router, prefix="/api", tags=["contact"])

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 API server starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 API server shutting down...")
```

---

### Task 3.4: Create Health Check Route

Create `app/routes/health.py`:

```python
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
```

---

### Task 3.5: Create Contact Models

Create `app/models/contact.py`:

```python
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
```

---

### Task 3.6: Create Email Utility

Create `app/utils/email.py`:

```python
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
```

---

### Task 3.7: Create Contact Route

Create `app/routes/contact.py`:

```python
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
```

---

### Task 3.8: Create `.env` File

Create `apps/api/.env`:

```bash
# Environment
ENVIRONMENT=development

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=your@email.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=5

# CORS
CORS_ORIGINS=http://localhost:4321,https://yourdomain.com
```

---

### Task 3.9: Test API Locally

```bash
# From apps/api directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Test health endpoint
curl http://localhost:8000/api/health

# Test contact endpoint
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from the API"
  }'

# Visit API docs
# http://localhost:8000/api/docs
```

**Deliverable:** ✅ Functional FastAPI backend with contact endpoint

---

## Phase 4: Build Streamlit Demos (MVP)

### Objectives
- Create interactive ML demonstrations
- Configure Streamlit for `/demos` subpath
- Add educational content
- Optimize for performance

---

### Task 4.1: Scaffold Streamlit Application

```bash
# Navigate to apps directory
cd apps

# Create demos directory
mkdir demos
cd demos

# Create directory structure
mkdir -p demos .streamlit
touch app.py
touch demos/__init__.py demos/demo1.py demos/demo2.py
```

---

### Task 4.2: Configure Streamlit

Create `.streamlit/config.toml`:

```toml
[server]
baseUrlPath = "demos"
enableCORS = false
enableXsrfProtection = true
headless = true
port = 7860

[browser]
gatherUsageStats = false

[theme]
primaryColor = "#3b82f6"
backgroundColor = "#ffffff"
secondaryBackgroundColor = "#f1f5f9"
textColor = "#0f172a"
font = "sans serif"
```

---

### Task 4.3: Create `requirements.txt`

```txt
streamlit==1.31.0
pandas==2.1.4
numpy==1.26.3
plotly==5.18.0
scikit-learn==1.4.0
# Add ML libraries as needed:
# torch==2.1.2
# transformers==4.36.2
# pillow==10.2.0
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### Task 4.4: Create Main App

Create `app.py`:

```python
"""
Streamlit ML Demos Application
"""
import streamlit as st

# Page config
st.set_page_config(
    page_title="ML Demos",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sidebar navigation
st.sidebar.title("🤖 ML Demos")
st.sidebar.markdown("---")

demo_choice = st.sidebar.radio(
    "Choose a demo:",
    ["Overview", "Demo 1: Text Analysis", "Demo 2: Data Visualization", "How It Works", "Limitations"]
)

# Main content
if demo_choice == "Overview":
    st.title("Machine Learning Demonstrations")
    st.markdown("""
    Welcome to my ML demos! This section showcases various machine learning capabilities
    with interactive examples.
    
    ## Available Demos
    
    1. **Text Analysis** - Sentiment analysis and text classification
    2. **Data Visualization** - Interactive data exploration
    
    ## How to Use
    
    1. Select a demo from the sidebar
    2. Adjust parameters and inputs
    3. View real-time results
    
    ## Technologies Used
    
    - **Streamlit** - Interactive web framework
    - **Python** - Core programming language
    - **scikit-learn** - Machine learning library
    - **Plotly** - Interactive visualizations
    """)
    
elif demo_choice == "Demo 1: Text Analysis":
    from demos.demo1 import run_demo
    run_demo()
    
elif demo_choice == "Demo 2: Data Visualization":
    from demos.demo2 import run_demo
    run_demo()
    
elif demo_choice == "How It Works":
    st.title("How It Works")
    st.markdown("""
    ## Architecture
    
    These demos run on a Streamlit server that:
    1. Accepts user input through interactive widgets
    2. Processes data using ML models
    3. Displays results in real-time
    
    ## Model Details
    
    - **Demo 1**: Uses pre-trained sentiment analysis models
    - **Demo 2**: Implements statistical analysis and visualization
    
    ## Performance Considerations
    
    - Models are cached for faster subsequent runs
    - Large datasets are sampled for responsiveness
    - Results are computed on-demand
    """)
    
elif demo_choice == "Limitations":
    st.title("Limitations & Considerations")
    st.markdown("""
    ## Current Limitations
    
    1. **Model Size**: Using smaller models for faster inference
    2. **Data Privacy**: No data is stored; all processing is ephemeral
    3. **Rate Limits**: Heavy usage may experience throttling
    4. **Accuracy**: Demo models prioritize speed over accuracy
    
    ## Future Improvements
    
    - [ ] Add more sophisticated models
    - [ ] Implement user authentication
    - [ ] Add data export functionality
    - [ ] Expand demo variety
    
    ## Feedback
    
    Have suggestions? [Contact me](/contact) with your ideas!
    """)

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("Built with ❤️ using Streamlit")
```

---

### Task 4.5: Create Demo 1 (Text Analysis)

Create `demos/demo1.py`:

```python
"""
Demo 1: Text Analysis
Simple sentiment analysis demo
"""
import streamlit as st
from textblob import TextBlob  # Simple sentiment analysis
import plotly.graph_objects as go

def run_demo():
    st.title("📝 Text Analysis Demo")
    
    st.markdown("""
    This demo analyzes the sentiment of your text using natural language processing.
    """)
    
    # User input
    user_text = st.text_area(
        "Enter text to analyze:",
        placeholder="Type or paste your text here...",
        height=150
    )
    
    if user_text:
        # Analyze sentiment
        blob = TextBlob(user_text)
        sentiment = blob.sentiment
        
        # Display results
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("Polarity", f"{sentiment.polarity:.2f}")
            st.caption("Range: -1 (negative) to +1 (positive)")
            
        with col2:
            st.metric("Subjectivity", f"{sentiment.subjectivity:.2f}")
            st.caption("Range: 0 (objective) to 1 (subjective)")
        
        # Visualization
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=['Polarity', 'Subjectivity'],
            y=[sentiment.polarity, sentiment.subjectivity],
            marker_color=['#3b82f6', '#8b5cf6']
        ))
        fig.update_layout(
            title="Sentiment Analysis Results",
            yaxis_range=[-1, 1],
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)
        
        # Interpretation
        if sentiment.polarity > 0.1:
            st.success("✅ Positive sentiment detected")
        elif sentiment.polarity < -0.1:
            st.error("❌ Negative sentiment detected")
        else:
            st.info("ℹ️ Neutral sentiment detected")
```

Note: Add `textblob==0.17.1` to requirements.txt

---

### Task 4.6: Create Demo 2 (Data Visualization)

Create `demos/demo2.py`:

```python
"""
Demo 2: Data Visualization
Interactive data exploration demo
"""
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

def run_demo():
    st.title("📊 Data Visualization Demo")
    
    st.markdown("""
    This demo generates and visualizes random datasets with interactive controls.
    """)
    
    # Parameters
    col1, col2 = st.columns(2)
    with col1:
        num_points = st.slider("Number of data points", 10, 1000, 100)
    with col2:
        chart_type = st.selectbox("Chart type", ["Scatter", "Line", "Bar", "Histogram"])
    
    # Generate data
    np.random.seed(42)
    df = pd.DataFrame({
        'x': np.random.randn(num_points),
        'y': np.random.randn(num_points),
        'category': np.random.choice(['A', 'B', 'C'], num_points)
    })
    
    # Create visualization
    if chart_type == "Scatter":
        fig = px.scatter(df, x='x', y='y', color='category', title="Scatter Plot")
    elif chart_type == "Line":
        fig = px.line(df.sort_values('x'), x='x', y='y', color='category', title="Line Chart")
    elif chart_type == "Bar":
        fig = px.bar(df.groupby('category').size().reset_index(name='count'), 
                     x='category', y='count', title="Bar Chart")
    else:  # Histogram
        fig = px.histogram(df, x='x', color='category', title="Histogram")
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Statistics
    st.subheader("Dataset Statistics")
    st.dataframe(df.describe())
```

---

### Task 4.7: Test Streamlit Locally

```bash
# From apps/demos directory
streamlit run app.py --server.port 7860 --server.baseUrlPath demos

# Visit http://localhost:7860/demos/
# Test all demos and navigation
```

**Deliverable:** ✅ Functional Streamlit demos with educational content

---

## Stage 2 Completion Checklist

By the end of Stage 2, you should have:

- [x] Astro website with all core pages (Home, About, Projects, Contact)
- [x] Navigation component working across all pages
- [x] Contact form (React island) implemented
- [x] FastAPI backend with health and contact endpoints
- [x] Anti-spam measures (honeypot, rate limiting)
- [x] Email delivery configured (SendGrid/Mailgun)
- [x] Streamlit demos with 2+ interactive examples
- [ ] All services tested locally and working independently

---

## Next Steps

Once Stage 2 is complete, proceed to:

**[Stage 3: Containerization & Local Testing](STAGE_3_CONTAINERIZATION.md)** - Dockerize all services and test with Docker Compose.

---

## Troubleshooting

### Astro Build Issues

**Problem:** Build fails with TypeScript errors
```bash
# Check tsconfig.json
# Ensure all imports are correct
npm run build -- --verbose
```

### FastAPI CORS Issues

**Problem:** Frontend can't reach API
```python
# Update CORS origins in app/main.py
allow_origins=["http://localhost:4321"]
```

### Streamlit Not Loading

**Problem:** Assets not loading under /demos
```toml
# Verify .streamlit/config.toml
[server]
baseUrlPath = "demos"
```

---

**Stage 2 Complete!** 🎉

You now have all three core services built and tested. Move on to Stage 3 to containerize everything.
