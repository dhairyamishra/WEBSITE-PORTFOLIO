# Portfolio Website Implementation Plan (v2)
## Astro Web + FastAPI API + Streamlit Demos on GCP (Compute Engine VM)

**Last Updated:** December 21, 2025  
**Target Platform:** Google Cloud Platform  
**Primary Deploy:** Compute Engine VM + Docker Compose + Nginx (host reverse proxy)  
**Repo Style:** Monorepo (multi-service, production-ready)

---

## Executive Summary

### What You're Building

A single-domain portfolio platform that serves:
- **Fast static portfolio website** (Astro)
- **Production API** for contact + anti-spam + email delivery (FastAPI)
- **Interactive ML demos** (Streamlit) under `/demos`
- **Optional project mini-apps** under `/projects/*` (add later)

### Why This Architecture

- **Single domain + path routing** → no CORS pain, clean UX, better SEO
- **VM + Docker Compose** → full control, easy to host many future project containers
- **Astro static-first** → portfolio loads instantly and ranks well
- **FastAPI + Streamlit** → Python-first backend + demos, consistent tooling

---

## Key Decisions (and Why)

### 1) Why Astro for the Web

**Decision:** Use Astro for the portfolio website.

**Why:**
- Portfolio sites are mostly content → Astro ships static HTML by default
- Better performance/SEO than a typical SPA
- React islands only for truly interactive bits (contact form, project filter)

**Important production note:** Astro should be built to static output and served by nginx in a container (not Astro dev server).

---

### 2) Why FastAPI for /api

**Decision:** Use FastAPI (Python) for the backend.

**Why:**
- **Python-first stack** → consistent with Streamlit and ML demos
- **Excellent validation** (Pydantic) → type-safe request/response
- **Clean routing** → easy to add endpoints
- **Easy email integrations** → SendGrid/Mailgun Python SDKs
- **Fast** → comparable to Node.js frameworks
- **Async support** → handles concurrent requests efficiently

**Alternative considered:** Fastify (Node.js)  
**Why not:** Keeping the entire backend in Python simplifies the stack and leverages Python's ML ecosystem.

---

### 3) Why Streamlit for /demos

**Decision:** Use Streamlit for demos.

**Why:**
- More flexible UI than Gradio for dashboards/explainers
- Perfect for "demo + how it works + limitations + metrics" pages
- Easy to iterate quickly

**Important routing note:** Running under `/demos` requires Streamlit `baseUrlPath="demos"`.

---

### 4) Why Single Domain Path Routing

**Decision:** Use:
- `/` → web
- `/api/*` → API
- `/demos/*` → demos
- `/projects/*` → optional project containers

**Why:**
- Frontend calls API with `fetch("/api/contact")` → no CORS
- One professional domain, simpler TLS/SEO

---

### 5) Why VM over Cloud Run

**Decision:** VM + Docker Compose + Nginx.

**Why:**
- Easiest path to host many project containers under `/projects/*`
- Always-on (no cold starts)
- SSH debugging + full system control

**Tradeoff:** More ops (patching, monitoring, hardening) than Cloud Run.

---

## Target Architecture

### Request Flow

```
Browser → https://yourdomain.com
        → VM (Nginx reverse proxy)
            ├── /         → web container (nginx serves Astro static)
            ├── /api/*    → api container (FastAPI/uvicorn)
            ├── /demos/*  → demos container (Streamlit w/ baseUrlPath=demos)
            └── /projects/* (optional) → project containers
```

### Port Plan (Internal Only; Not Publicly Exposed)

| Service | Internal Port | Exposed Publicly |
|---------|---------------|------------------|
| web (nginx in container) | 8080 | via host Nginx 443 |
| api (FastAPI) | 8000 | via host Nginx 443 |
| demos (Streamlit) | 7860 | via host Nginx 443 |
| projects (optional) | 8001+ | via host Nginx 443 |

**Security best practice:** In production, bind containers to `127.0.0.1` only so only host Nginx is reachable.

---

## Monorepo Layout (Recommended)

```
portfolio/
├── apps/
│   ├── web/                      # Astro site (static build served by nginx)
│   ├── api/                      # FastAPI (Python)
│   ├── demos/                    # Streamlit (Python)
│   └── projects/                 # optional future project containers
├── infra/
│   └── nginx/
│       └── portfolio.conf        # host nginx site config
├── scripts/                      # Python-only automation scripts
│   ├── setup_local.py
│   ├── sync_secrets.py           # optional
│   └── deploy_smoke_test.py      # optional
├── docker-compose.dev.yml        # hot reload dev
├── docker-compose.prod.yml       # production (pull images, localhost binds, volumes)
├── ecosystem.config.cjs          # optional PM2 local runner (config, not automation)
├── .env.example
├── .gitignore
├── README.md
└── IMPLEMENTATION_PLAN.md
```

---

## Service Implementation Details

### A) Web (Astro)

**Responsibilities:**
- Pages: Home, About, Experience, Projects, Contact
- Content collections or JSON for projects
- React islands only when needed:
  - `ContactForm.tsx` as `client:load`
  - Optional filter/search as `client:visible`

**Local dev:**
- Astro dev server on `http://localhost:4321`

**Production:**
- `astro build` → static output
- Serve static using nginx inside the web container (fast + reliable)

---

### B) API (FastAPI)

**Endpoints (recommended):**
- `GET /api/health` → `{status: "ok"}`
- `POST /api/contact` → validates payload + anti-spam + sends email

**Contact anti-spam (do this early):**
- Honeypot field (cheap + effective)
- Rate limit by IP (basic)
- Optional later: CAPTCHA if spam appears

**Email delivery options:**
- **Simplest:** SendGrid/Mailgun API (via Python SDK)
- **Alternate:** SMTP (less ideal in production)

**Secrets handling on VM:**
- Store in a protected file on VM: `/etc/portfolio/.env` (chmod 600)
- Docker Compose reads it via `env_file`:

```yaml
api:
  env_file:
    - /etc/portfolio/.env
```

---

### C) Demos (Streamlit)

**Must-have config for /demos:**

Create `apps/demos/.streamlit/config.toml`:

```toml
[server]
baseUrlPath = "demos"
enableCORS = false
enableXsrfProtection = true
headless = true
```

**UX structure (recommended):**
- Sidebar navigation: "Overview", "Demo 1", "Demo 2", "How it works", "Limitations"
- Keep models small / cached for performance
- Load artifacts from `/mnt/data/models` (mounted read-only)

---

## Dockerization

### 1) Web Dockerfile (Astro → static → nginx)

**Goal:** build once, serve static reliably.

```dockerfile
# apps/web/Dockerfile

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Internal port:** 8080

---

### 2) API Dockerfile (FastAPI)

```dockerfile
# apps/api/Dockerfile

FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

### 3) Demos Dockerfile (Streamlit)

```dockerfile
# apps/demos/Dockerfile

FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["streamlit", "run", "app.py", "--server.address", "0.0.0.0", "--server.port", "7860"]
```

---

## Docker Compose

### A) Dev Compose (Hot Reload; Convenience)

**docker-compose.dev.yml**

- web runs Astro dev server
- api runs uvicorn with `--reload`
- demos runs streamlit with file mount

**Use this for daily iteration.**

```yaml
version: '3.8'

services:
  web:
    build: ./apps/web
    ports:
      - "4321:4321"
    volumes:
      - ./apps/web/src:/app/src
    environment:
      - NODE_ENV=development

  api:
    build: ./apps/api
    ports:
      - "8000:8000"
    volumes:
      - ./apps/api:/app
    environment:
      - RELOAD=true
    env_file:
      - .env.local

  demos:
    build: ./apps/demos
    ports:
      - "7860:7860"
    volumes:
      - ./apps/demos:/app
      - ./data/models:/app/models:ro
      - ./data/datasets:/app/datasets:ro
      - ./data/outputs:/app/outputs:rw
```

---

### B) Prod Compose (Real Production Posture)

**docker-compose.prod.yml**

**Key properties:**
- Uses versioned images from registry (no building on VM)
- Binds all service ports to `127.0.0.1:*`
- Mounts persistent disk data paths
- Uses `restart: unless-stopped`
- Log rotation options

```yaml
version: '3.8'

services:
  web:
    image: REGION-docker.pkg.dev/PROJECT/portfolio/web:latest
    ports:
      - "127.0.0.1:8080:8080"
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  api:
    image: REGION-docker.pkg.dev/PROJECT/portfolio/api:latest
    env_file:
      - /etc/portfolio/.env
    ports:
      - "127.0.0.1:8000:8000"
    volumes:
      - /mnt/data/uploads:/app/uploads
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  demos:
    image: REGION-docker.pkg.dev/PROJECT/portfolio/demos:latest
    ports:
      - "127.0.0.1:7860:7860"
    volumes:
      - /mnt/data/models:/app/models:ro
      - /mnt/data/datasets:/app/datasets:ro
      - /mnt/data/outputs:/app/outputs:rw
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## Host Nginx Configuration (VM)

**infra/nginx/portfolio.conf** (conceptual)

**Requirements:**
- TLS via Let's Encrypt (Certbot)
- Proxy `/api/` to FastAPI
- Proxy `/demos/` to Streamlit (WebSocket headers included)
- Proxy `/` to web container (static served by container nginx)

**Critical Nginx notes:**
- Put `/api/`, `/demos/`, `/projects/` blocks **before** `location /`
- Include upgrade headers for Streamlit

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API (FastAPI)
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Demos (Streamlit with WebSocket support)
    location /demos/ {
        proxy_pass http://127.0.0.1:7860/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Web (Astro static served by nginx container)
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## GCP VM + Persistent Disk Setup

### VM Recommended Baseline

- **OS:** Ubuntu 22.04 LTS
- **Machine type:** e2-medium (2 vCPU, 4GB) minimum
- **Reserve a static external IP**
- **Firewall:** Allow inbound: 80, 443, 22 (or restrict 22 by IP)

### Persistent Disk

- Mount to `/mnt/data`
- Symlink repo `data/` → `/mnt/data` (but keep `/mnt/data` as source of truth)

**What goes on persistent disk:**
- models, datasets, outputs, uploads, future db files

**Setup:**

```bash
# Format disk
sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/sdb

# Mount
sudo mkdir -p /mnt/data
sudo mount -o discard,defaults /dev/sdb /mnt/data
sudo chown $USER:$USER /mnt/data

# Auto-mount on boot
sudo blkid /dev/sdb  # Copy UUID
sudo nano /etc/fstab
# Add: UUID=YOUR-UUID /mnt/data ext4 discard,defaults,nofail 0 2

# Create data structure
cd /mnt/data
mkdir -p models/{nlp,cv,audio} datasets/{images,text,audio} outputs/{generated_text,generated_images} uploads/user_files
```

---

## CI/CD (Recommended: Build in GitHub, Pull on VM)

### Why Not Build on the VM

- Slower, inconsistent, and harder to debug
- Ties deployments to VM state

### Recommended Pipeline

**On push to main, GitHub Actions:**
1. Builds 3 images (web/api/demos)
2. Pushes to Artifact Registry
3. SSH to VM and runs:
   ```bash
   docker compose pull
   docker compose up -d
   ```
4. Smoke tests (`/`, `/api/health`, `/demos/`)

### VM Access to Artifact Registry

Attach a VM service account with read access to Artifact Registry, so pulls work without manual logins.

---

## Local Development Options

### Option 1: PM2 (Fast Local Iteration)

Use PM2 to run:
- `astro dev`
- `uvicorn --reload`
- `streamlit run ...`

**Note:** PM2 config is JS, but it's a config file, not an automation script. Keep automation scripts in Python under `scripts/`.

**ecosystem.config.cjs:**

```javascript
module.exports = {
  apps: [
    {
      name: "web",
      cwd: "./apps/web",
      script: "npm",
      args: "run dev -- --host 0.0.0.0"
    },
    {
      name: "api",
      cwd: "./apps/api",
      script: "uvicorn",
      args: "app.main:app --reload --host 0.0.0.0 --port 8000"
    },
    {
      name: "demos",
      cwd: "./apps/demos",
      script: "streamlit",
      args: "run app.py --server.address 0.0.0.0 --server.port 7860"
    }
  ]
};
```

---

### Option 2: Docker Dev Compose

Use when you want container/network realism.

```bash
docker compose -f docker-compose.dev.yml up
```

---

### Option 3: Prod Compose Locally

Use occasionally to validate "real prod behavior" before deploying.

```bash
docker compose -f docker-compose.prod.yml up
```

---

## Security & Hardening Checklist (VM)

### Minimum Must-Do

- ✅ **UFW:** allow 80/443, restrict 22
- ✅ **Fail2ban** for SSH
- ✅ **unattended-upgrades**
- ✅ **Docker not exposed** on public interface
- ✅ **Bind app ports to 127.0.0.1 only**
- ✅ **Don't log contact message bodies / PII**
- ✅ **Add basic security headers in Nginx**

### Optional Upgrades

- Cloud Monitoring agent
- Log rotation for docker logs
- Regular persistent disk snapshots

---

## Cost Estimate (VM Path)

**Typical monthly costs (rough):**

| Component | Monthly Cost |
|-----------|--------------|
| VM e2-medium | ~$25–30 |
| Persistent disk 100GB pd-standard | ~$4 |
| Static external IP | ~$3 |
| **Total baseline** | **~$32–40/month** (low traffic) |

---

## Rollback Strategy

### Best Practice: Version Your Images

- Tag images with git SHA
- Keep `latest` but deploy using SHA tags in production for determinism

### Rollback Steps (VM)

1. Update compose to previous image tags (or previous git tag)
2. `docker compose pull && docker compose up -d`
3. Verify smoke tests

---

## Implementation Phases + Task List (End-to-End)

### Phase 0 — Finalize MVP Scope (1 hour)

- [ ] Confirm initial pages: Home / About / Experience / Projects / Contact
- [ ] Confirm 2–3 Streamlit demos to start
- [ ] Decide if `/projects/*` is MVP or later (recommended later)

---

### Phase 1 — Repo Scaffold + Standards

- [ ] Create monorepo folder structure
- [ ] Add `.gitignore` (ignore `data/`, model files, outputs)
- [ ] Add `.env.example`
- [ ] Add Python-only scripts policy in README
- [ ] Add basic lint/format configs (Python + JS)

---

### Phase 2 — Build the Astro Web (MVP)

- [ ] Scaffold Astro app in `apps/web`
- [ ] Implement layouts + core pages
- [ ] Add projects content (content collections or JSON)
- [ ] Add React island `ContactForm.tsx` (`client:load`)
- [ ] Ensure API calls are relative: `fetch("/api/contact")`
- [ ] SEO basics: titles, meta, OG tags, sitemap, robots.txt

---

### Phase 3 — Build FastAPI API (MVP)

- [ ] Scaffold FastAPI in `apps/api`
- [ ] Add `GET /api/health`
- [ ] Add `POST /api/contact` with Pydantic validation
- [ ] Add honeypot + rate limiting
- [ ] Add email integration (SendGrid/Mailgun)
- [ ] Add structured logging (no PII)

---

### Phase 4 — Build Streamlit Demos (MVP)

- [ ] Scaffold `apps/demos`
- [ ] Add `.streamlit/config.toml` with `baseUrlPath="demos"`
- [ ] Implement 2–3 demos
- [ ] Add "How it works / limitations" sections
- [ ] Load models from mounted `/app/models` (from `/mnt/data/models` in prod)

---

### Phase 5 — Containerize Services

- [ ] Web: multi-stage build + nginx serve static
- [ ] API: uvicorn container
- [ ] Demos: streamlit container
- [ ] Create `docker-compose.dev.yml`
- [ ] Create `docker-compose.prod.yml` (localhost-only binds + volumes)
- [ ] Verify locally:
  - [ ] `docker compose -f docker-compose.prod.yml up -d` works
  - [ ] `curl /api/health` works
  - [ ] `/demos` loads without broken assets

---

### Phase 6 — Provision GCP VM + Disk

- [ ] Create VM + static IP
- [ ] Attach persistent disk, mount at `/mnt/data`, add fstab entry
- [ ] Install docker + docker compose
- [ ] Create `/etc/portfolio/.env` (chmod 600)
- [ ] Clone repo (or just keep compose + configs if using image-only deploys)

---

### Phase 7 — Configure Host Nginx + TLS

- [ ] Install nginx
- [ ] Install certbot + get cert for domain
- [ ] Add nginx site config for `/`, `/api`, `/demos`, optional `/projects`
- [ ] Test:
  - [ ] HTTP → HTTPS redirect
  - [ ] `/api/health` returns 200
  - [ ] `/demos` works (no broken JS/CSS)

---

### Phase 8 — CI/CD

- [ ] Create GitHub Actions workflow:
  - [ ] Build/push images to Artifact Registry
  - [ ] SSH to VM: `docker compose pull && docker compose up -d`
  - [ ] Run smoke tests after deploy
- [ ] Add deploy protections:
  - [ ] Only on main
  - [ ] Manual approval optional

---

### Phase 9 — Production Hardening + Monitoring

- [ ] UFW rules + fail2ban
- [ ] unattended upgrades
- [ ] Disk usage monitoring + snapshot strategy
- [ ] Uptime checks (home, `/api/health`, `/demos`)
- [ ] Budget alerts in GCP

---

### Phase 10 — Add /projects/* (Optional Expansion)

- [ ] Add first project container under `apps/projects/<name>`
- [ ] Assign internal port + nginx route block
- [ ] Add homepage project card linking to `/projects/<name>/`

---

## Final Consistency Fixes vs Previous Plan

### What Changed

1. **API is now FastAPI (Python) everywhere** (no Fastify)
2. **Astro runs as static build served by nginx** (not a dev server in prod)
3. **Streamlit supports /demos via `baseUrlPath="demos"`**
4. **"Production parity" is clarified:** dev compose ≠ prod compose
5. **Prod binds are localhost-only;** only host Nginx is public
6. **CI/CD builds images in GitHub** and VM pulls them (more reliable)

### Why Python-First Backend

- **Consistency:** Entire backend (API + demos) in Python
- **ML ecosystem:** Leverage Python's ML/data science libraries
- **Type safety:** Pydantic for request/response validation
- **Performance:** FastAPI is async and comparable to Node.js
- **Simplicity:** One language for backend reduces context switching

---

## Next Steps

1. **Review this plan** and confirm alignment with your goals
2. **Run setup script:** `python scripts/setup_local.py`
3. **Start with Phase 1:** Initialize monorepo structure
4. **Iterate quickly:** Build → Test → Deploy

Ready to build? Let's start with Phase 1! 🚀
