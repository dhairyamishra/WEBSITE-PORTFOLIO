# Portfolio Website Implementation Plan
## Full-Stack Web + API + Streamlit ML Demos on GCP (Compute Engine VM)

**Last Updated:** December 20, 2025  
**Target Platform:** Google Cloud Platform  
**Primary Deploy:** Compute Engine VM + Docker Compose + Nginx  
**Repo Style:** Microservices in a single monorepo

---

## Executive Summary

### Project Goals
- **Fast, professional portfolio site** (projects, experience, resume, contact)
- **Interactive ML demos** using **Streamlit** (hands-on + educational)
- **Production-grade API** for contact + anti-spam + email delivery
- **One-command local dev** (PM2) and **production-parity** local testing (Docker Compose)
- **CI/CD**: push to `main` → deploys to GCP VM
- **Single domain + path routing** to avoid CORS complexity
- **Full VM control** for future flexibility and customization

---

## Architecture Overview

### High-level routing (single domain, path-based)

```
User Browser
     ↓
HTTPS (yourdomain.com) → Compute Engine VM
     ↓
Nginx (reverse proxy on VM)
     ↓
     ├─→ / (root)                    → Docker Container: homepage (port 4321) [Astro]
     ├─→ /api/*                      → Docker Container: api (port 8080) [Fastify]
     ├─→ /demos/*                    → Docker Container: ml-demos (port 7860) [Streamlit]
     ├─→ /projects/chatbot/*         → Docker Container: project-chatbot (port 8001)
     ├─→ /projects/cv-app/*          → Docker Container: project-cv-app (port 8002)
     └─→ /projects/[project-name]/*  → Docker Container: project-* (port 800X)
```

**All services run on a single VM using Docker Compose, with Nginx as the reverse proxy.**

**Portfolio as a Platform:**
- Homepage serves as resume/overview with project gallery
- Each project runs in its own isolated container
- Users navigate from homepage → individual project demos
- Single domain for SEO, easier SSL, cleaner UX

---

## Key Design Decisions (with rationale)

This section is the "why" behind the architecture, so future changes stay consistent.

### 1) Why microservices (homepage + api + demos + projects) instead of one app?
**Decision:** Split into multiple services: Homepage, API, ML Demos, and individual Project containers.

**Why:**
- **Separation of concerns**: homepage is resume/overview, API is backend logic, demos showcase ML, projects are full-featured apps
- **Independent scaling**: projects may need more resources; homepage stays lightweight
- **Portfolio as a platform**: each project runs in isolation, can use different tech stacks
- **Deployment safety**: updating one project doesn't affect homepage or other projects
- **Professional showcase**: demonstrates microservices architecture and DevOps skills

**Architecture:**
- **Homepage**: Resume/overview with project gallery (React)
- **API**: Backend for contact form, analytics (Fastify)
- **ML Demos**: Interactive Streamlit demos (Streamlit)
- **Projects**: Individual project containers (various tech stacks)
  - `/projects/chatbot` → AI chatbot with RAG
  - `/projects/cv-app` → Computer vision application
  - `/projects/game` → Real-time multiplayer game
  - Add more projects over time...

**Alternative considered:** single combined server  
**Tradeoff:** simpler ops, but tightly coupled deployments and can't showcase individual projects as production apps.

---

### 2) Why a monorepo (instead of multiple repos)?
**Decision:** Keep all services in one repository.

**Why:**
- One place to manage versions, issues, docs, and CI/CD.
- Easier to share conventions (lint rules, naming, scripts).
- Easier to coordinate changes like "web UI expects `/api/contact`".

**Tradeoff:** repo is bigger, but still manageable with `apps/*` boundaries.

---

### 3) Why Astro + TypeScript for the web?
**Decision:** Use Astro + TS (with React islands) for frontend.

**Why:**
- **Zero JS by default** → Lighthouse 100 scores, perfect SEO
- **Static HTML** → Instant page loads, ideal for portfolios
- **React islands** → Interactive components only where needed (contact form, filters)
- **Content-first** → Built for portfolios, blogs, marketing sites
- **Fast builds** → Much faster than SPAs for static content
- **TypeScript support** → Full type safety

**Alternative considered:** Vite + React, Next.js  
**Why not:** SPAs ship unnecessary JS; Astro gives better performance and SEO out of the box.

---

### 4) Why Fastify (Node) for the API?
**Decision:** Use Node + Fastify for `/api/*`.

**Why:**
- Fastify is **high-performance** and clean for small APIs.
- Great plugin ecosystem for validation, rate limiting, and logging.
- Node fits naturally with the web stack and CI workflows.

**Alternative considered:** Python FastAPI  
**Why not:** we already have Python in the demo service; keep the API focused and small.

---

### 5) Why Streamlit for demos (vs Gradio)?
**Decision:** Use **Streamlit** for interactive demos.

**Why:**
- **More flexible UI** for "mini apps" and dashboards (filters, charts, layout control).
- Perfect for "demo + explanation + limitations + metrics explorer" style pages.
- Streamlit feels like a small product, which complements the portfolio.

**Tradeoff:** slightly more boilerplate than Gradio for pure model I/O demos.

---

### 6) Why one domain + path routing?
**Decision:** Route `/`, `/api/*`, `/demos/*` under the same domain.

**Why:**
- **CORS-free by design**: frontend calls API with relative paths (`/api/contact`).
- Cleaner UX (one domain feels "professional").
- Centralizes TLS/HTTPS configuration.

**Alternative considered:** subdomains (`api.yourdomain.com`, `demos.yourdomain.com`)  
**Why not:** path routing is nicer for UX; subdomains can be used later if needed.

---

### 7) Why Compute Engine VM (instead of Cloud Run)?
**Decision:** Use a single Compute Engine VM with Docker Compose + Nginx.

**Why:**
- **Full control**: SSH access, custom configurations, easier debugging
- **Future flexibility**: Can install any tools, databases, or services needed
- **Predictable cost**: Fixed monthly cost (~$25-30), no surprises
- **Always-on**: No cold starts, instant response times
- **Simpler mental model**: One machine, one nginx, one docker-compose
- **Better for learning**: Hands-on experience with server management

**Tradeoff:** More operational overhead (OS updates, security patches, monitoring) compared to serverless.

> **When to use Cloud Run instead:** If you want zero ops, automatic scaling, and don't need SSH access or custom system-level tools.

---

### 8) Why Docker for production parity?
**Decision:** Every service ships as a container.

**Why:**
- VM runs containers; Docker ensures **local == prod** runtime.
- Prevents "works on my machine" drift (Node/Python versions, deps).
- Enables reproducible CI/CD builds.

---

### 9) Why separate Persistent Disk for data storage?
**Decision:** Use a separate Persistent Disk mounted to the VM for large data files.

**Why:**
- **Separation of concerns**: Code (boot disk) vs data (persistent disk)
- **Easy backup**: Snapshot the data disk independently
- **Scalability**: Can resize data disk without touching the OS
- **Performance**: Can choose SSD vs Standard based on workload
- **Cost optimization**: Use cheaper Standard disk for large datasets
- **Data persistence**: If VM is recreated, data disk can be reattached

**What goes on the data disk:**
- Model checkpoints (`.pth`, `.h5`, `.pkl`, `.onnx`)
- Training datasets (images, text, CSV files)
- AI-generated responses and outputs
- User uploads (if applicable)
- Database files (if you add PostgreSQL/MongoDB later)

**What stays on boot disk:**
- OS and system files
- Application code (git repo)
- Docker images
- Nginx configs

---

### 10) Why PM2 locally (when we already have docker-compose)?
**Decision:** Use **PM2 for fast local dev**, and docker-compose for integration parity.

**Why PM2:**
- One command to run all services with live logs.
- Great when iterating rapidly across web/api/demos without rebuilds.

**Why docker-compose too:**
- Ensures the container runtime behaves like production.
- Catches port/binding/env issues before you deploy.

---

## Service Responsibilities

### A) Homepage Service (Portfolio Frontend)
- **Tech:** Astro + TypeScript (with React islands)
- **Responsibilities:**
  - Static pages: Hero, Skills, Projects gallery, About
  - React islands: Contact form (client:load), Project filters (client:visible)
  - Content collections for project data
  - SEO optimization (built-in)
  - Zero JS by default for maximum performance
- **Port:** `4321` (Astro's default port)
- **Nginx proxies:** `/` → `http://localhost:4321`

### B) API Service (Backend)
- **Tech:** Node.js + Fastify + TypeScript
- **Responsibilities:**
  - `GET /api/health`
  - `POST /api/contact` (validation, rate limit, spam prevention, email delivery)
  - Optional: analytics, project metadata API
- **Port:** `8080` (both local and production container)
- **Nginx proxies:** `/api/*` → `http://localhost:8080`

### C) ML Demos Service (Streamlit)
- **Tech:** Python + Streamlit
- **Responsibilities:**
  - Interactive ML demos (2–3 initially)
  - Educational content: "How it works", "Limitations"
  - Showcases ML/AI capabilities
- **Port:** `7860` (both local and production container)
- **Nginx proxies:** `/demos/*` → `http://localhost:7860`

### D) Project Containers (Individual Projects)
- **Tech:** Various (React, Next.js, Flask, FastAPI, etc.)
- **Responsibilities:**
  - Full-featured project demos
  - Each project is a complete, production-ready application
  - Isolated from other projects (own container, own port)
- **Ports:** `8001`, `8002`, `8003`, etc. (one per project)
- **Nginx proxies:** `/projects/[name]/*` → `http://localhost:800X`

**Example Projects:**
- `/projects/chatbot` → AI chatbot with RAG (Python + React)
- `/projects/cv-app` → Computer vision analyzer (Streamlit)
- `/projects/game` → Real-time multiplayer game (Node.js + WebSocket)

---

## Monorepo Structure

```
portfolio/
├── apps/
│   ├── homepage/                 # Portfolio homepage (Vite + React + TS)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx      # Hero, skills, featured projects
│   │   │   │   ├── Projects.tsx  # Full project gallery
│   │   │   │   ├── About.tsx     # Bio, experience
│   │   │   │   └── Contact.tsx   # Contact form
│   │   │   └── components/
│   │   │       └── ProjectCard.tsx  # Links to /projects/...
│   │   ├── public/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── api/                      # Backend (Fastify + TS)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── demos/                    # ML Demos (Streamlit)
│   │   ├── app.py
│   │   ├── demos/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   └── projects/                 # Individual project containers
│       ├── chatbot/              # Project 1: AI Chatbot
│       │   ├── frontend/         # React
│       │   ├── backend/          # Python/FastAPI
│       │   ├── docker-compose.yml
│       │   ├── Dockerfile
│       │   └── README.md
│       │
│       ├── cv-analyzer/          # Project 2: CV Application
│       │   ├── app.py            # Streamlit or Flask
│       │   ├── Dockerfile
│       │   └── README.md
│       │
│       └── realtime-game/        # Project 3: WebSocket Game
│           ├── server/           # Node.js
│           ├── client/           # React
│           ├── Dockerfile
│           └── README.md
├── data/                         # Data directory (mounted from persistent disk on VM)
│   ├── models/                   # Model checkpoints
│   │   ├── nlp_model.pth
│   │   └── cv_model.h5
│   ├── datasets/                 # Training/inference datasets
│   │   ├── images/
│   │   └── text/
│   ├── outputs/                  # AI-generated responses
│   └── uploads/                  # User uploads (if applicable)
├── .github/workflows/
│   └── deploy-vm.yml             # CI/CD pipeline
├── docker-compose.yml            # Local integration testing
├── docker-compose.prod.yml       # Production with volume mounts
├── ecosystem.config.cjs          # PM2 configuration
├── .gitignore                    # Excludes data/ directory
├── README.md
└── IMPLEMENTATION_PLAN.md        # This file
```

**Note:** The `data/` directory is **gitignored** and mounted from a persistent disk on the VM.

---

## Implementation Phases (What we build, in what order)

### Phase 1: Local Development Environment
- scaffold apps (homepage/api/demos)
- PM2 orchestration
- minimal health endpoints

### Phase 2: Homepage Frontend
- implement pages (Home, Projects Gallery, About, Contact)
- design system + project card components
- contact form + UI states
- SEO + performance

### Phase 3: Backend API
- contact pipeline + validation
- rate limiting + honeypot (+ optional CAPTCHA)
- email provider integration + secrets

### Phase 4: Streamlit Demos
- core layout (sidebar + tabs)
- 2–3 demos + educational sections
- optimize startup time

### Phase 5: Containerization
- production Dockerfiles
- docker-compose production configuration

### Phase 6: GCP VM & Storage Setup
- Create Compute Engine VM
- Create and attach Persistent Disk for data storage
- Format and mount persistent disk
- Install Docker + Docker Compose
- Configure firewall rules
- Set up SSH access

### Phase 7: Nginx Configuration
- Install and configure Nginx as reverse proxy
- Set up Let's Encrypt SSL certificates (certbot)
- Configure path-based routing

### Phase 8: Deployment & CI/CD
- Deploy docker-compose to VM
- Set up GitHub Actions for automated deployment
- Configure secrets and environment variables

### Phase 9: Production Hardening
- Set up monitoring and alerts
- Configure automatic updates
- Set up backups
- Optimize security (firewall, fail2ban, etc.)

---

## Complete Task Checklist (End-to-End)

### Phase 1: Local Development Environment
- [ ] Create monorepo directory structure
- [ ] Initialize Git repository and `.gitignore`
- [ ] Initialize homepage app (Vite + React + TypeScript)
- [ ] Initialize API app (Node + Fastify + TypeScript)
- [ ] Initialize demos app (Python + Streamlit)
- [ ] Create `apps/projects/` directory for future projects
- [ ] Create `ecosystem.config.cjs` for PM2
- [ ] Test all services run locally via PM2

### Phase 2: Homepage Frontend (Portfolio Site)
- [ ] Tailwind CSS + design system
- [ ] Hero section (name, title, photo, CTA)
- [ ] Skills section (tech stack badges)
- [ ] Featured projects section (3-4 cards)
- [ ] Projects gallery page (grid with filters)
- [ ] About page (bio, experience timeline)
- [ ] Contact page with form (calls `/api/contact`)
- [ ] ProjectCard component (links to `/projects/[name]`)
- [ ] SEO: meta, OG, robots.txt, sitemap
- [ ] Perf: optimize images, Lighthouse target > 90

### Phase 3: Backend API
- [ ] Implement `/api/health`
- [ ] Implement `/api/contact`
- [ ] Rate limiting (ex: 5 requests / 15 minutes per IP)
- [ ] Honeypot spam prevention (and optional CAPTCHA)
- [ ] Email provider integration (SendGrid/Mailgun)
- [ ] Safe logging (no PII dumps)

### Phase 4: Streamlit Demos
- [ ] Sidebar navigation + tabs (Demo / How it works / Limitations)
- [ ] Build 2–3 demos
- [ ] Startup time optimization
- [ ] Ensure binds to `0.0.0.0:$PORT` for Cloud Run

### Phase 5: Containerization
- [ ] Dockerfiles for homepage/api/demos
- [ ] docker-compose.yml for local integration
- [ ] docker-compose.prod.yml with volume mounts
- [ ] Validate `docker compose up --build` end-to-end

### Phase 5.5: First Project Container (Optional - can add later)
- [ ] Choose first project to containerize
- [ ] Create `apps/projects/[project-name]/`
- [ ] Build Dockerfile for project
- [ ] Add to docker-compose.prod.yml
- [ ] Test project routing via Nginx

### Phase 6: GCP VM & Storage Setup
- [ ] Create GCP project and enable Compute Engine API
- [ ] Create VM instance (e2-medium, Ubuntu 22.04 LTS, 20GB boot disk)
- [ ] Create Persistent Disk for data (100GB+ Standard or SSD)
- [ ] Attach persistent disk to VM
- [ ] Format and mount persistent disk to `/mnt/data`
- [ ] Set up automatic mount on reboot (fstab)
- [ ] Reserve static external IP address
- [ ] Configure firewall rules (allow HTTP 80, HTTPS 443, SSH 22)
- [ ] Set up SSH key authentication
- [ ] Install Docker and Docker Compose on VM
- [ ] Clone repository to VM
- [ ] Create symlink: `ln -s /mnt/data ~/portfolio/data`

### Phase 7: Nginx & SSL Configuration
- [ ] Install Nginx on VM
- [ ] Configure Nginx as reverse proxy (path routing)
- [ ] Install Certbot (Let's Encrypt)
- [ ] Obtain SSL certificate for domain
- [ ] Set up automatic certificate renewal
- [ ] Test HTTPS and HTTP → HTTPS redirect

### Phase 8: Production Deployment
- [ ] Create production `.env` file with secrets
- [ ] Deploy services with `docker compose up -d`
- [ ] Verify all services are running
- [ ] Test end-to-end (web, API, demos)
- [ ] Update DNS to point to VM's static IP

### Phase 9: CI/CD with GitHub Actions
- [ ] Set up SSH key for GitHub Actions
- [ ] Create deployment workflow (SSH → pull → rebuild → restart)
- [ ] Add health checks after deployment
- [ ] Test automated deployment

### Phase 10: Production Hardening
- [ ] Set up UFW firewall (deny all except 22, 80, 443)
- [ ] Install and configure fail2ban (SSH protection)
- [ ] Set up unattended-upgrades (automatic security updates)
- [ ] Configure log rotation
- [ ] Set up monitoring (uptime checks, disk space alerts)
- [ ] Create backup strategy (docker volumes, configs)
- [ ] Document rollback procedure

### Phase 11: Launch
- [ ] Write documentation
- [ ] Perform security and performance audits
- [ ] Test entire user flow
- [ ] Launch! 🚀

---

## Key Technical Details

## Development Environments & Workflows

### Environment 1: Local Development (PM2)
**Use case:** Fast iteration during development (no container overhead)

**Setup:**
```bash
# Install PM2 globally
npm install -g pm2

# Start all services
pm2 start ecosystem.config.cjs

# View logs
pm2 logs

# Restart specific service
pm2 restart homepage

# Stop all
pm2 stop all
```

**PM2 Configuration (`ecosystem.config.cjs`):**
> Note: Using `python -m streamlit` is often more reliable than calling `streamlit` directly (PATH/venv issues).

```javascript
module.exports = {
  apps: [
    {
      name: "homepage",
      cwd: "./apps/homepage",
      script: "npm",
      args: "run dev -- --host 0.0.0.0",  // Astro uses port 4321 by default
      env: { NODE_ENV: "development" }
    },
    {
      name: "api",
      cwd: "./apps/api",
      script: "npm",
      args: "run dev",
      env: { PORT: "8080", NODE_ENV: "development" }
    },
    {
      name: "demos",
      cwd: "./apps/demos",
      script: "python",
      args: "-m streamlit run app.py --server.address 0.0.0.0 --server.port 7860",
      env: { PORT: "7860" }
    }
    // Add project containers as you build them
  ]
};
```

**Access:**
- Homepage: http://localhost:4321 (Astro dev server)
- API: http://localhost:8080/api/health
- Demos: http://localhost:7860

**Pros:**
- ✅ Fast startup
- ✅ Hot reload works natively
- ✅ Easy debugging
- ✅ No container overhead

**Cons:**
- ❌ Not production-parity
- ❌ Dependency conflicts possible

---

### Environment 2: Local Docker (Production Parity)
**Use case:** Test containerized environment before deploying to GCP

**Setup:**
```bash
# Create local data directories
mkdir -p data/{models,datasets,outputs,uploads}

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your local values

# Build and start all services
docker compose up --build

# Or run in background
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

**docker-compose.yml** (Local):
```yaml
version: '3.8'

services:
  homepage:
    build: ./apps/homepage
    ports:
      - "4321:4321"  # Astro dev server
    volumes:
      - ./apps/homepage/src:/app/src  # Hot reload
    environment:
      - NODE_ENV=development

  api:
    build: ./apps/api
    ports:
      - "8080:8080"
    volumes:
      - ./apps/api/src:/app/src  # Hot reload
      - ./data/uploads:/app/uploads
    env_file:
      - .env.local

  demos:
    build: ./apps/demos
    ports:
      - "7860:7860"
    volumes:
      - ./apps/demos:/app  # Hot reload
      - ./data/models:/app/models:ro
      - ./data/datasets:/app/datasets:ro
      - ./data/outputs:/app/outputs:rw
```

**Access:** Same as PM2 (localhost:4321, etc.)

**Pros:**
- ✅ Production parity
- ✅ Tests Docker builds
- ✅ Catches port/volume issues
- ✅ Tests multi-container networking

**Cons:**
- ❌ Slower startup than PM2
- ❌ Requires Docker installed

---

### Environment 3: GCP Production (VM + Docker Compose)
**Use case:** Production deployment

**Setup on VM:**
```bash
# SSH into VM
ssh user@YOUR_VM_IP

# Clone repository
cd ~
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Create .env file with production secrets
nano .env
# Add production values (SendGrid key, etc.)

# Create symlink to persistent disk
ln -s /mnt/data data

# Build and start services
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker compose -f docker-compose.prod.yml restart api
```

**docker-compose.prod.yml** (Production):
```yaml
version: '3.8'

services:
  homepage:
    build: ./apps/homepage
    ports:
      - "4321:4321"  # Astro production server
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  api:
    build: ./apps/api
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    env_file:
      - .env  # Production secrets
    volumes:
      - /mnt/data/uploads:/app/uploads  # Persistent disk
    restart: unless-stopped

  demos:
    build: ./apps/demos
    ports:
      - "7860:7860"
    volumes:
      - /mnt/data/models:/app/models:ro
      - /mnt/data/datasets:/app/datasets:ro
      - /mnt/data/outputs:/app/outputs:rw
    restart: unless-stopped
```

**Access:** https://yourdomain.com (via Nginx reverse proxy)

**Pros:**
- ✅ Production environment
- ✅ Persistent storage
- ✅ Automatic restarts
- ✅ Log rotation

---

### Workflow Comparison

| Task | PM2 (Local) | Docker (Local) | Docker (GCP) |
|------|-------------|----------------|--------------|
| **Initial setup** | Fast | Medium | Slow |
| **Hot reload** | Native | Via volumes | N/A |
| **Production parity** | ❌ | ✅ | ✅ |
| **Debugging** | Easy | Medium | Hard |
| **Port conflicts** | Possible | Isolated | Isolated |
| **Data persistence** | Local files | Local files | Persistent disk |
| **When to use** | Daily dev | Pre-deploy test | Production |

---

### Recommended Development Workflow

```
1. Local Development (PM2)
   ├─ Write code
   ├─ Test features
   └─ Debug issues
        ↓
2. Local Docker Testing
   ├─ Build containers
   ├─ Test multi-service
   └─ Verify volumes
        ↓
3. Commit & Push
   ├─ git add .
   ├─ git commit
   └─ git push origin main
        ↓
4. Deploy to GCP (CI/CD or Manual)
   ├─ SSH into VM
   ├─ git pull
   ├─ docker compose up -d --build
   └─ Test production
```

---

### Docker Commands (local & production)
```bash
# Local integration parity
docker compose up --build

# Production deployment on VM
docker compose -f docker-compose.prod.yml up -d --build

# Tail logs
docker compose logs -f

# Restart specific service
docker compose restart portfolio-api

# Stop all services
docker compose down
```

### VM Setup Commands
```bash
# SSH into VM
gcloud compute ssh portfolio-vm --zone=us-central1-a

# Or with standard SSH
ssh -i ~/.ssh/portfolio_key user@YOUR_VM_IP

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Nginx Configuration (on VM)
```nginx
# /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API backend (Fastify) - must come before / to avoid conflicts
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ML Demos (Streamlit)
    location /demos/ {
        proxy_pass http://localhost:7860/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Individual Project Containers
    # Project 1: AI Chatbot
    location /projects/chatbot/ {
        proxy_pass http://localhost:8001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Project 2: CV Analyzer
    location /projects/cv-app/ {
        proxy_pass http://localhost:8002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Project 3: Real-time Game
    location /projects/game/ {
        proxy_pass http://localhost:8003/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Add more projects as needed...
    # location /projects/[new-project]/ {
    #     proxy_pass http://localhost:800X/;
    #     ...
    # }

    # Homepage - Astro (must be last to catch all other routes)
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Note:** More specific location blocks (`/api/`, `/demos/`, `/projects/`) must come **before** the catch-all `/` location.

### SSL Certificate Setup (Let's Encrypt)
```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run

# Certbot will automatically set up a cron job for renewal
```

---

## Environment Setup & Prerequisites

### Local Development Prerequisites

**Required Software:**
```bash
# Node.js 20+ (for homepage and API)
node --version  # Should be v20.x.x or higher
npm --version

# Python 3.11+ (for demos)
python --version  # Should be 3.11 or higher
pip --version

# PM2 (for local orchestration)
npm install -g pm2
pm2 --version

# Docker & Docker Compose (for containerized testing)
docker --version
docker compose version

# Git (for version control)
git --version
```

**Optional but Recommended:**
- VS Code with extensions: ESLint, Prettier, Python, Docker
- Postman or Thunder Client (for API testing)
- DBeaver or similar (if you add a database later)

---

### Initial Project Setup

**Automated Setup (Recommended):**
```bash
# Run the cross-platform setup script
python scripts/setup-local.py
```

This Python script will:
- ✅ Check all prerequisites (Node.js, Python, Docker, PM2)
- ✅ Create data directory structure
- ✅ Copy `.env.example` to `.env.local`
- ✅ Install dependencies for all apps
- ✅ Works on Windows, Linux, and macOS

**Manual Setup (if needed):**

**1. Clone and Initialize:**
```bash
# Clone repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Create local data directories
mkdir -p data/{models,datasets,outputs,uploads}
mkdir -p data/models/{nlp,cv,audio}
mkdir -p data/datasets/{images,text,audio}
mkdir -p data/outputs/{generated_text,generated_images}

# Create environment file
cp .env.example .env.local
# Edit .env.local with your local values
```

**2. Install Dependencies:**
```bash
# Homepage (once created)
cd apps/homepage
npm install
cd ../..

# API (once created)
cd apps/api
npm install
cd ../..

# Demos (once created)
cd apps/demos
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

**3. Verify Setup:**
```bash
# Test PM2
pm2 start ecosystem.config.cjs
pm2 logs
pm2 stop all

# Test Docker
docker compose up --build
# Ctrl+C to stop
docker compose down
```

---

### Common Issues & Troubleshooting

**Issue: PM2 can't find Python/Streamlit**
```bash
# Solution: Use full path to Python
which python  # Copy this path
# Update ecosystem.config.cjs with full path
```

**Issue: Port already in use**
```bash
# Find process using port
# Windows:
netstat -ano | findstr :4321
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :4321
kill -9 <PID>
```

**Issue: Docker build fails**
```bash
# Clear Docker cache
docker system prune -a
docker compose build --no-cache
```

**Issue: Volume permissions (Linux)**
```bash
# Fix permissions for data directory
sudo chown -R $USER:$USER data/
chmod -R 755 data/
```

**Issue: Hot reload not working in Docker**
```bash
# Ensure volumes are mounted correctly in docker-compose.yml
# Check that source code is mounted:
volumes:
  - ./apps/homepage/src:/app/src
```

---

## Persistent Disk Setup (Data Storage)

### Why Separate Persistent Disk?
For large data files (model checkpoints, datasets, AI outputs), we use a **separate Persistent Disk** attached to the VM:
- **Separation**: Code vs data (easier backup and management)
- **Scalability**: Resize data disk independently
- **Performance**: Choose SSD for models, Standard for datasets
- **Cost**: Standard disk is ~$0.04/GB/month (much cheaper than SSD)
- **Persistence**: Survives VM recreation

### Create and Attach Persistent Disk

```bash
# Set variables
export PROJECT_ID="your-portfolio-project"
export ZONE="us-central1-a"
export VM_NAME="portfolio-vm"
export DISK_NAME="portfolio-data-disk"
export DISK_SIZE="100GB"  # Adjust based on your needs

# Create persistent disk (Standard for cost, or SSD for performance)
gcloud compute disks create $DISK_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --size=$DISK_SIZE \
  --type=pd-standard  # or pd-ssd for better performance

# Attach disk to VM
gcloud compute instances attach-disk $VM_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --disk=$DISK_NAME
```

### Format and Mount Persistent Disk (on VM)

```bash
# SSH into VM
gcloud compute ssh $VM_NAME --zone=$ZONE

# Find the disk device name
lsblk
# Look for the new disk (e.g., sdb)

# Format the disk (ONLY DO THIS ONCE - will erase data!)
sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/sdb

# Create mount point
sudo mkdir -p /mnt/data

# Mount the disk
sudo mount -o discard,defaults /dev/sdb /mnt/data

# Set permissions (allow your user to write)
sudo chmod a+w /mnt/data
sudo chown $USER:$USER /mnt/data

# Verify mount
df -h /mnt/data
```

### Configure Automatic Mount on Reboot

```bash
# Get the disk UUID
sudo blkid /dev/sdb
# Copy the UUID value

# Edit fstab
sudo nano /etc/fstab

# Add this line (replace UUID with your actual UUID):
UUID=YOUR-UUID-HERE /mnt/data ext4 discard,defaults,nofail 0 2

# Test the fstab entry
sudo umount /mnt/data
sudo mount -a
df -h /mnt/data  # Should show the disk mounted
```

### Create Data Directory Structure

```bash
# Create directory structure on persistent disk
cd /mnt/data
mkdir -p models datasets outputs uploads

# Create subdirectories for organization
mkdir -p models/{nlp,cv,audio}
mkdir -p datasets/{images,text,audio}
mkdir -p outputs/{generated_text,generated_images}
mkdir -p uploads/user_files

# Create symlink from project directory
cd ~/portfolio
ln -s /mnt/data data

# Verify
ls -la data/  # Should show the symlinked directories
```

### Docker Compose with Volume Mounts

Create `docker-compose.prod.yml` with persistent disk mounts:

```yaml
version: '3.8'

services:
  homepage:
    build: ./apps/homepage
    ports:
      - "4321:4321"  # Astro
    restart: unless-stopped

  api:
    build: ./apps/api
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - /mnt/data/uploads:/app/uploads  # User uploads
    restart: unless-stopped

  demos:
    build: ./apps/demos
    ports:
      - "7860:7860"
    volumes:
      # Mount model checkpoints (read-only for safety)
      - /mnt/data/models:/app/models:ro
      # Mount datasets (read-only)
      - /mnt/data/datasets:/app/datasets:ro
      # Mount outputs (read-write for generated content)
      - /mnt/data/outputs:/app/outputs:rw
    restart: unless-stopped

  # Individual Project Containers
  project-chatbot:
    build: ./apps/projects/chatbot
    ports:
      - "8001:8000"
    volumes:
      - /mnt/data/models/nlp:/app/models:ro
      - /mnt/data/outputs/chatbot:/app/outputs:rw
    restart: unless-stopped

  project-cv-app:
    build: ./apps/projects/cv-analyzer
    ports:
      - "8002:8501"
    volumes:
      - /mnt/data/models/cv:/app/models:ro
      - /mnt/data/datasets/images:/app/datasets:ro
      - /mnt/data/outputs/cv-app:/app/outputs:rw
    restart: unless-stopped

  project-game:
    build: ./apps/projects/realtime-game
    ports:
      - "8003:3000"
    restart: unless-stopped
```

### Data Management Best Practices

**1. Backup Strategy**
```bash
# Create snapshot of data disk (can be automated)
gcloud compute disks snapshot $DISK_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --snapshot-names=portfolio-data-$(date +%Y%m%d)

# List snapshots
gcloud compute snapshots list

# Restore from snapshot (if needed)
gcloud compute disks create portfolio-data-disk-restored \
  --source-snapshot=portfolio-data-20251220 \
  --zone=$ZONE
```

**2. Disk Resizing** (if you need more space)
```bash
# Resize disk (can only increase, not decrease)
gcloud compute disks resize $DISK_NAME \
  --size=200GB \
  --zone=$ZONE

# SSH into VM and resize filesystem
sudo resize2fs /dev/sdb

# Verify new size
df -h /mnt/data
```

**3. Data Organization**
```
/mnt/data/
├── models/
│   ├── nlp/
│   │   ├── bert-base-uncased/      # Hugging Face models
│   │   └── custom-classifier.pth   # Your trained models
│   ├── cv/
│   │   ├── yolov8.pt
│   │   └── stable-diffusion/
│   └── audio/
│       └── whisper-base/
├── datasets/
│   ├── images/
│   │   ├── training/
│   │   └── validation/
│   ├── text/
│   │   └── corpus.txt
│   └── audio/
├── outputs/
│   ├── generated_text/
│   │   └── responses_2025-12-20.json
│   └── generated_images/
│       └── batch_001/
└── uploads/
    └── user_files/
```

**4. .gitignore Configuration**
```gitignore
# Add to .gitignore
data/
*.pth
*.h5
*.pkl
*.onnx
*.bin
datasets/
outputs/
uploads/
```

### Cost Optimization Tips

**Disk Type Selection:**
- **pd-standard**: $0.04/GB/month - Use for datasets, outputs (most data)
- **pd-balanced**: $0.10/GB/month - Good middle ground
- **pd-ssd**: $0.17/GB/month - Use only for frequently accessed models

**Example Cost Breakdown:**
- 100GB Standard disk: ~$4/month
- 200GB Standard disk: ~$8/month
- 500GB Standard disk: ~$20/month

**Recommendation:** Start with 100GB Standard, resize as needed.

### Monitoring Disk Usage

```bash
# Check disk usage
df -h /mnt/data

# Check directory sizes
du -sh /mnt/data/*

# Find large files
find /mnt/data -type f -size +100M -exec ls -lh {} \;

# Set up disk usage alert (add to cron)
# Alert if disk usage > 80%
```

---

## Adding New Projects to Your Portfolio

### Step-by-Step Guide

**1. Create Project Directory**
```bash
cd apps/projects
mkdir my-new-project
cd my-new-project
```

**2. Build Your Project**
- Develop your project (any tech stack)
- Ensure it can run in a container
- Make sure it listens on a configurable port

**3. Create Dockerfile**
```dockerfile
# apps/projects/my-new-project/Dockerfile
FROM node:20-alpine  # or python:3.11-slim, etc.
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8004
CMD ["npm", "start"]
```

**4. Add to docker-compose.prod.yml**
```yaml
  project-my-new-project:
    build: ./apps/projects/my-new-project
    ports:
      - "8004:8004"  # Next available port
    volumes:
      - /mnt/data/models/my-project:/app/models:ro  # If needed
    restart: unless-stopped
```

**5. Add Nginx Location Block**
```nginx
# Add to /etc/nginx/sites-available/portfolio
location /projects/my-new-project/ {
    proxy_pass http://localhost:8004/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**6. Add Project Card to Homepage**
```typescript
// apps/homepage/src/data/projects.ts
{
  id: "my-new-project",
  title: "My Awesome Project",
  description: "A full-stack application that does amazing things",
  tags: ["React", "Node.js", "PostgreSQL"],
  thumbnail: "/images/my-project-thumb.png",
  demoUrl: "/projects/my-new-project",
  githubUrl: "https://github.com/yourusername/my-new-project",
  featured: true
}
```

**7. Deploy**
```bash
# SSH into VM
ssh user@YOUR_VM_IP

# Pull latest code
cd ~/portfolio
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build project-my-new-project

# Reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

**8. Test**
```bash
# Visit your new project
https://yourdomain.com/projects/my-new-project
```

### Port Allocation Strategy

Keep track of ports to avoid conflicts:

| Service | Port | URL Path | Tech |
|---------|------|----------|------|
| Homepage | 4321 | `/` | Astro |
| API | 8080 | `/api/*` | Fastify |
| ML Demos | 7860 | `/demos/*` | Streamlit |
| Project 1 | 8001 | `/projects/chatbot/*` | Various |
| Project 2 | 8002 | `/projects/cv-app/*` | Various |
| Project 3 | 8003 | `/projects/game/*` | Various |
| Project 4 | 8004 | `/projects/my-new-project/*` | Various |
| ... | 800X | `/projects/[name]/*` | Various |

**Recommendation:** Document your port allocations in a `PORTS.md` file.

---

## Cost Estimate (VM Deployment with Persistent Disk)

### Monthly Costs
- **Compute Engine VM (e2-medium)**: ~$25-30/month
  - 2 vCPUs, 4 GB RAM
  - 20GB boot disk (included)
  - Always-on, no cold starts
- **Persistent Disk (data storage)**: ~$4-20/month
  - 100GB Standard: ~$4/month
  - 200GB Standard: ~$8/month
  - 500GB Standard: ~$20/month
- **Static External IP**: ~$3/month
- **Egress (data transfer)**: ~$1-5/month (low traffic)
- **Snapshots (backups)**: ~$0.026/GB/month (optional)
  - 100GB snapshot: ~$2.60/month
- **Total**: **~$32-58/month** (depending on data storage needs)

### VM Sizing Recommendations
- **e2-micro** (free tier eligible): 0.25-2 vCPUs, 1 GB RAM - **too small** for 3 services
- **e2-small**: 0.5-2 vCPUs, 2 GB RAM - might work but tight
- **e2-medium** (recommended): 2 vCPUs, 4 GB RAM - comfortable for all 3 services
- **e2-standard-2**: 2 vCPUs, 8 GB RAM - if you need more memory for ML models

**Cost comparison:**
- VM deployment (100GB data): ~$32-42/month (predictable)
- VM deployment (500GB data): ~$48-58/month (predictable)
- Cloud Run + LB: $20-35/month (variable, scales to zero, no persistent storage)

**Why VM + Persistent Disk is worth it for you:**
- Full control and future flexibility
- No cold starts (always instant)
- Can install databases, cron jobs, custom tools
- **Persistent storage for large ML models and datasets**
- Easy backup/restore with disk snapshots
- Better for learning server management

**Cost Optimization Tips:**
- Start with 100GB Standard disk (~$4/month)
- Resize as needed (can increase anytime)
- Use snapshots sparingly (only for important backups)
- Delete old snapshots to save costs

---

## Security Checklist

- [ ] HTTPS enforced (HTTP → HTTPS redirect)
- [ ] Security headers (CSP, X-Frame-Options, etc.)
- [ ] Secrets in Secret Manager (not in code)
- [ ] Input validation on all endpoints
- [ ] Rate limiting prevents abuse
- [ ] No PII in logs
- [ ] Honeypot spam prevention

---

## Monitoring & Alerts

- [ ] Uptime checks for web and API
- [ ] Alert policies for errors and downtime
- [ ] Budget alerts (50%, 90%, 100%)
- [ ] Cloud Monitoring dashboard

---

## Rollback Procedure (VM Deployment)

```bash
# SSH into VM
ssh user@YOUR_VM_IP

# Navigate to project directory
cd /home/user/portfolio

# Check git history
git log --oneline

# Rollback to previous commit
git checkout <previous-commit-hash>

# Rebuild and restart services
docker compose down
docker compose up -d --build

# Or rollback to a specific tag
git checkout v1.2.3
docker compose up -d --build

# View logs to verify
docker compose logs -f
```

**Best Practice:** Tag stable releases before deploying:
```bash
git tag -a v1.0.0 -m "Production release 1.0.0"
git push origin v1.0.0
```

---

## Scripting Standards

**IMPORTANT: All automation scripts MUST be written in Python**

### Why Python Only?

✅ **Cross-Platform**: Works on Windows, Linux, and macOS  
✅ **No Permission Issues**: No execution policy or chmod needed  
✅ **Project Dependency**: Python already required for demos  
✅ **Better Error Handling**: Proper exception handling  
✅ **More Maintainable**: Easier to read, debug, and extend

### Prohibited Script Types

❌ **Shell Scripts (`.sh`)**: Not compatible with Windows  
❌ **PowerShell (`.ps1`)**: Not compatible with Linux/macOS  
❌ **Batch Files (`.bat`)**: Limited functionality, Windows-only

### Current Scripts

All scripts in `scripts/` directory:
- ✅ `setup-local.py` - Cross-platform environment setup
- ✅ (Future scripts will also be Python)

### Adding New Scripts

When creating new automation scripts:

1. **Use Python**: Create `.py` files in `scripts/` directory
2. **Add Shebang**: Start with `#!/usr/bin/env python3`
3. **Cross-Platform**: Use `pathlib.Path` instead of string paths
4. **Error Handling**: Use try/except blocks
5. **User Feedback**: Use colored output for clarity
6. **Documentation**: Add docstrings and comments

**Example Template:**
```python
#!/usr/bin/env python3
"""
Script Description
"""
import sys
from pathlib import Path

def main():
    """Main function"""
    try:
        # Your code here
        pass
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

---

## Next Steps

1. **Review this plan** and confirm alignment with your goals
2. **Run setup script**: `python scripts/setup-local.py`
3. **Start with Phase 1**: Set up local development environment
4. **Iterate quickly**: Build → Test → Deploy
5. **Ask questions**: Clarify any unclear sections

Ready to start implementation? Let's build this! 🚀
