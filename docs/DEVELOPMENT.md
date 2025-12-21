# Development Guide

## Prerequisites

### Required Software
```bash
node --version    # v20+
python --version  # 3.11+
docker --version
pm2 --version
git --version
```

### Installation
```bash
# Node.js 20+
# Download from nodejs.org

# Python 3.11+
# Download from python.org

# PM2
npm install -g pm2

# Docker Desktop
# Download from docker.com
```

## Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# 2. Create data directories
mkdir -p data/{models,datasets,outputs,uploads}/{nlp,cv,audio,images,text,generated_text,generated_images,user_files}

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Install dependencies (once apps are created)
cd apps/web && npm install && cd ../..  # Astro + dependencies
cd apps/api && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ../..  # FastAPI
cd apps/demos && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ../..
```

## Development Environments

### Environment 1: PM2 (Fast Development)

**Use for**: Daily development, quick iterations

```bash
# Start all services
pm2 start ecosystem.config.cjs

# View logs
pm2 logs

# Restart service
pm2 restart homepage

# Stop all
pm2 stop all
```

**Access:**
- Homepage: http://localhost:4321 (Astro dev server)
- API: http://localhost:8000/api/health (FastAPI)
- Demos: http://localhost:7860 (Streamlit)

**Pros**: ✅ Fast, ✅ Hot reload (Astro HMR), ✅ Easy debugging  
**Cons**: ❌ Not production-parity

---

### Environment 2: Docker Local (Production Parity)

**Use for**: Pre-deployment testing

```bash
# Start all services
docker compose up --build

# Background mode
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all
docker compose down
```

**Pros**: ✅ Production parity, ✅ Tests containers  
**Cons**: ❌ Slower than PM2

---

### Environment 3: GCP Production

**Use for**: Live deployment

```bash
# On VM
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart service
docker compose -f docker-compose.prod.yml restart api
```

## Development Workflow

```
1. Write code (PM2)
   ↓
2. Test locally (Docker)
   ↓
3. Commit & Push
   ↓
4. Deploy to GCP (CI/CD or manual)
```

## Common Commands

| Task | PM2 | Docker |
|------|-----|--------|
| Start | `pm2 start ecosystem.config.cjs` | `docker compose up -d` |
| Logs | `pm2 logs` | `docker compose logs -f` |
| Restart | `pm2 restart homepage` | `docker compose restart homepage` |
| Stop | `pm2 stop all` | `docker compose down` |

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :4321
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4321
kill -9 <PID>
```

### Docker Build Fails
```bash
docker system prune -a
docker compose build --no-cache
```

### Hot Reload Not Working
Check volume mounts in `docker-compose.yml`:
```yaml
volumes:
  - ./apps/homepage/src:/app/src
```

### PM2 Can't Find Python
```bash
which python  # Get full path
# Update ecosystem.config.cjs with full path
```
