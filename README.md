# Portfolio Website

A modern, full-stack portfolio website with interactive ML demos, deployed on Google Cloud Platform.

**Why this architecture?** Clean separation of concerns (web/API/demos), serverless autoscaling, single domain with no CORS complexity, and production-grade security. See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed rationale.

## 🎯 Features

- **Portfolio Homepage**: Resume/overview with hero, skills, and project gallery
- **Project Showcase**: Each project runs in its own container as a live demo
- **Interactive ML Demos**: Streamlit-powered machine learning demonstrations
- **Contact Form**: Spam-protected contact form with email delivery (rate limiting + honeypot)
- **Microservices Architecture**: Homepage, API, demos, and individual projects all isolated
- **Single Domain**: Clean path-based routing (no CORS issues)
- **Persistent Storage**: Separate disk for ML models, datasets, and AI outputs
- **CI/CD Pipeline**: Automated deployments from GitHub to GCP
- **Production-Ready**: Monitoring, alerts, security headers, and rollback procedures

## 🏗️ Architecture

```
https://yourdomain.com/
├── /                        → Homepage (Resume/Portfolio)
├── /api/*                   → Backend API (Fastify)
├── /demos/*                 → ML Demos (Streamlit)
└── /projects/[name]/*       → Individual Project Containers
    ├── /projects/chatbot    → AI Chatbot Project
    ├── /projects/cv-app     → Computer Vision App
    └── /projects/game       → Real-time Game
```

**Portfolio as a Platform:** Each project runs in its own isolated container, showcasing production-ready applications.

**Tech Stack:**
- **Frontend**: Astro, TypeScript, React Islands, Tailwind CSS
- **Backend**: Node.js, Fastify, TypeScript
- **ML Demos**: Python, Streamlit
- **Infrastructure**: GCP Compute Engine VM + Docker Compose + Nginx
- **CI/CD**: GitHub Actions (SSH deployment)
- **Local Dev**: PM2 (fast iteration) + Docker Compose (production parity)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PM2 (for local development)
- GCP account (for deployment)

### Initial Setup

**Automated Setup (Recommended):**
```bash
# Run the setup script (works on Windows, Linux, macOS)
python scripts/setup-local.py
```

This script will:
- ✅ Check prerequisites (Node.js, Python, Docker, PM2)
- ✅ Create data directories
- ✅ Copy `.env.example` to `.env.local`
- ✅ Install all dependencies

**Manual Setup (if needed):**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Create local data directories**
   ```bash
   mkdir -p data/{models,datasets,outputs,uploads}
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local values (SendGrid key, etc.)
   ```

4. **Install dependencies** (once apps are created)
   ```bash
   # Homepage
   cd apps/homepage && npm install && cd ../..
   
   # API
   cd apps/api && npm install && cd ../..
   
   # Demos
   cd apps/demos && python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt && cd ../..
   ```

---

### Development Workflows

#### Option 1: PM2 (Fast Local Development)
**Best for:** Daily development, quick iterations

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

**Access:**
- Homepage: http://localhost:4321 (Astro dev server)
- API: http://localhost:8080/api/health
- Demos: http://localhost:7860

**Pros:** ✅ Fast startup, ✅ Hot reload, ✅ Easy debugging  
**Cons:** ❌ Not production-parity

---

#### Option 2: Docker Compose (Production Parity)
**Best for:** Testing before deployment, catching container issues

```bash
# Build and start all services
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f

# Restart specific service
docker compose restart api

# Stop all
docker compose down
```

**Access:** Same as PM2 (localhost:4321, etc.)

**Pros:** ✅ Production parity, ✅ Tests Docker builds, ✅ Isolated containers  
**Cons:** ❌ Slower startup, ❌ Requires Docker

---

### Quick Reference Commands

| Task | PM2 | Docker Compose |
|------|-----|----------------|
| **Start all** | `pm2 start ecosystem.config.cjs` | `docker compose up -d` |
| **View logs** | `pm2 logs` | `docker compose logs -f` |
| **Restart service** | `pm2 restart homepage` | `docker compose restart homepage` |
| **Stop all** | `pm2 stop all` | `docker compose down` |
| **Rebuild** | N/A | `docker compose up -d --build` |

## 📦 Deployment

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed deployment instructions with full rationale.

**Quick Deploy to GCP VM:**
1. **Create VM**: Compute Engine (e2-medium, Ubuntu 22.04 LTS)
2. **Create & Attach Persistent Disk**: 100GB+ for models, datasets, outputs
3. **Install**: Docker, Docker Compose, Nginx, Certbot
4. **Configure**: Nginx reverse proxy with Let's Encrypt SSL
5. **Mount Data Disk**: Format, mount to `/mnt/data`, configure fstab
6. **Deploy**: Clone repo, run `docker compose up -d`
7. **CI/CD**: Push to `main` → GitHub Actions SSH into VM → pull → rebuild → restart

**Rollback:**
```bash
# SSH into VM
ssh user@YOUR_VM_IP

# Rollback to previous commit
cd /home/user/portfolio
git checkout <previous-commit-hash>
docker compose down && docker compose up -d --build
```

## 📁 Project Structure

```
portfolio/
├── apps/
│   ├── homepage/     # Portfolio homepage (React)
│   ├── api/          # Backend API (Fastify)
│   ├── demos/        # ML Demos (Streamlit)
│   └── projects/     # Individual project containers
│       ├── _template/     # Project template
│       ├── chatbot/       # Project 1: AI Chatbot
│       ├── cv-analyzer/   # Project 2: CV App
│       └── realtime-game/ # Project 3: Game
├── docs/             # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── DEPLOYMENT.md
│   └── ADDING_PROJECTS.md
├── configs/          # Shared configurations
│   └── nginx.conf    # Nginx reverse proxy config
├── scripts/          # Utility scripts (Python only)
│   └── setup-local.py     # Cross-platform setup script
├── data/             # Data directory (gitignored)
│   ├── models/       # Model checkpoints
│   ├── datasets/     # Training/inference data
│   ├── outputs/      # AI-generated content
│   └── uploads/      # User uploads
├── .github/workflows/     # CI/CD pipelines
├── docker-compose.yml     # Local development
├── docker-compose.prod.yml # Production deployment
├── ecosystem.config.cjs   # PM2 configuration
├── PORTS.md               # Port allocation tracking
└── IMPLEMENTATION_PLAN.md
```

**Key Principles:**
- **Portfolio as a Platform**: Homepage + isolated project containers
- **Modular Documentation**: Separate docs for architecture, development, deployment
- **Python Scripts Only**: All automation scripts use Python for cross-platform compatibility
- **Single Domain**: Path-based routing for SEO and UX

## 🔒 Security

- ✅ HTTPS enforced with Let's Encrypt SSL (HTTP → HTTPS redirect)
- ✅ UFW firewall (deny all except ports 22, 80, 443)
- ✅ Fail2ban (SSH brute-force protection)
- ✅ Rate limiting on contact form (5 requests per 15 min per IP)
- ✅ Honeypot spam prevention (+ optional CAPTCHA support)
- ✅ Input validation on all endpoints (JSON schema validation)
- ✅ Secrets in environment variables (not in code)
- ✅ Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- ✅ No PII in logs (safe logging practices)
- ✅ CORS-free by design (same domain, relative paths)
- ✅ Automatic security updates (unattended-upgrades)

## 💰 Cost

**Estimated monthly cost: $32-58** (predictable)
- Compute Engine VM (e2-medium): $25-30 (2 vCPUs, 4 GB RAM, always-on)
- Persistent Disk (data storage): $4-20 (100GB-500GB Standard)
- Static External IP: $3
- Data Transfer: $1-5 (low traffic)

**Why VM + Persistent Disk?**
- Full control (SSH access, custom tools, databases)
- **Persistent storage for ML models, datasets, AI outputs**
- Future flexibility (can add anything you need)
- No cold starts (always instant)
- Predictable cost (no surprises)
- Easy backup/restore with disk snapshots
- Better for learning server management

## 📊 Monitoring

- Uptime checks for web and API endpoints (UptimeRobot, Pingdom, or GCP Monitoring)
- Disk space alerts (prevent running out of storage)
- Docker container health checks
- Nginx access and error logs
- Budget alerts (50%, 90%, 100% thresholds)
- SSH login alerts (fail2ban notifications)

## 🚀 Development Workflow

1. **Local development** with PM2 (fast iteration)
2. **Test with Docker Compose** (production parity)
3. **Push to feature branch** → create PR
4. **Merge to main** → GitHub Actions SSH into VM → pull → rebuild → restart
5. **Monitor** via logs and uptime checks
6. **Rollback** if needed (git checkout previous commit)

## 📝 Key Design Decisions

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed rationale on:
- **Why portfolio as a platform** (homepage + individual project containers)
- Why microservices (homepage/API/demos/projects) vs monolith
- Why monorepo vs multiple repos
- **Why Astro vs Vite/React/Next.js** (zero JS by default, perfect SEO, 100 Lighthouse)
- Why Fastify vs FastAPI
- Why Streamlit vs Gradio
- **Why path routing vs subdomains** (single domain, better SEO, easier SSL)
- **Why Compute Engine VM vs Cloud Run** (full control, future flexibility)
- **Why separate Persistent Disk** (ML models, datasets, AI outputs)
- **Why Python scripts only** (cross-platform compatibility)
- Why PM2 + Docker Compose for local dev

## 🚀 Adding New Projects

1. Create project in `apps/projects/[name]/`
2. Build Dockerfile
3. Add to `docker-compose.prod.yml` (assign port 800X)
4. Add Nginx location block for `/projects/[name]/`
5. Add project card to homepage
6. Deploy and test!

See [docs/ADDING_PROJECTS.md](./docs/ADDING_PROJECTS.md) for detailed step-by-step guide.

## 🛠️ Scripting Standards

**All automation scripts MUST be written in Python** for cross-platform compatibility:
- ✅ Python (`.py`) - Works on Windows, Linux, macOS
- ❌ Shell scripts (`.sh`) - Not compatible with Windows
- ❌ PowerShell (`.ps1`) - Not compatible with Linux/macOS

This ensures the repository is usable by all contributors regardless of their operating system.

## 📧 Contact

- Website: https://yourdomain.com
- Email: your-email@example.com
- LinkedIn: https://linkedin.com/in/yourprofile
- GitHub: https://github.com/dhairyamishra
