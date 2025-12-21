# Portfolio Architecture

## Overview

**Portfolio as a Platform** - A microservices architecture where the homepage serves as a gateway to individual project containers.

## System Architecture

```
User Browser
     ↓
HTTPS (yourdomain.com) → Compute Engine VM
     ↓
Nginx (reverse proxy)
     ↓
     ├─→ /                        → homepage (port 4321) [Astro]
     ├─→ /api/*                   → api (port 8080) [Fastify]
     ├─→ /demos/*                 → ml-demos (port 7860) [Streamlit]
     └─→ /projects/[name]/*       → project-* (port 800X) [Various]
```

## Service Responsibilities

### Homepage (Port 4321)
- **Tech**: Astro + TypeScript (with React islands)
- **Purpose**: Resume/overview with project gallery
- **Key Features**: Static HTML pages, React islands for interactivity (contact form, filters)
- **Why Astro**: Zero JS by default, perfect SEO, 100 Lighthouse scores, faster than SPAs

### API (Port 8080)
- **Tech**: Node.js + Fastify + TypeScript
- **Purpose**: Backend logic and integrations
- **Endpoints**: `/api/health`, `/api/contact`

### ML Demos (Port 7860)
- **Tech**: Python + Streamlit
- **Purpose**: Interactive ML demonstrations
- **Features**: Multiple demos with educational content

### Project Containers (Ports 8001+)
- **Tech**: Various (React, Next.js, Flask, FastAPI, etc.)
- **Purpose**: Full-featured project demos
- **Isolation**: Each project in its own container

## Design Decisions

### Why Microservices?
- **Separation of concerns**: Each service has a single responsibility
- **Independent scaling**: Projects can use different tech stacks
- **Deployment safety**: Update one service without affecting others
- **Professional showcase**: Demonstrates DevOps skills

### Why Astro for Homepage?
- **Performance**: Zero JS by default → Lighthouse 100 scores
- **SEO**: Static HTML → Perfect for search engines
- **Developer Experience**: HTML-like `.astro` components, easy to maintain
- **React Islands**: Interactive components only where needed (contact form, filters)
- **Content-First**: Built for portfolios, blogs, and marketing sites
- **Fast Builds**: Much faster than Vite for static content

### Why Monorepo?
- Single source of truth for all services
- Shared tooling and conventions
- Easier dependency management
- Coordinated changes across services

### Why VM over Serverless?
- Full control (SSH, custom tools, databases)
- No cold starts (always-on)
- Persistent storage for ML models
- Predictable cost (~$32-58/month)

### Why Path Routing?
- Single domain (better SEO)
- No CORS complexity
- Easier SSL management
- Cleaner UX

## Port Allocation

| Service | Port | Path |
|---------|------|------|
| Homepage | 4321 | `/` |
| API | 8080 | `/api/*` |
| ML Demos | 7860 | `/demos/*` |
| Project 1 | 8001 | `/projects/chatbot/*` |
| Project 2 | 8002 | `/projects/cv-app/*` |
| Project 3 | 8003 | `/projects/game/*` |
| Project N | 800X | `/projects/[name]/*` |

**Note**: Document port allocations in `PORTS.md` to avoid conflicts.

## Data Storage

### Boot Disk (20GB)
- OS and system files
- Application code (git repo)
- Docker images
- Nginx configs

### Persistent Disk (100GB+)
- Model checkpoints (`.pth`, `.h5`, `.pkl`, `.onnx`)
- Training datasets (images, text, CSV)
- AI-generated outputs
- User uploads
- Database files (if added later)

**Mount Point**: `/mnt/data` → symlinked to `~/portfolio/data`

## Cost Estimate

| Component | Monthly Cost |
|-----------|--------------|
| VM (e2-medium) | $25-30 |
| Persistent Disk (100GB) | $4 |
| Static IP | $3 |
| Data Transfer | $1-5 |
| **Total** | **$32-42** |

Scale to 500GB disk: ~$48-58/month
