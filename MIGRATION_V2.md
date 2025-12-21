# Migration to V2 Architecture (FastAPI Backend)

**Date:** December 21, 2025  
**Status:** ⚠️ BREAKING CHANGES

---

## What Changed

### Major Architectural Shift: Fastify → FastAPI

**V1 (Previous):**
- Frontend: Astro (port 4321 dev)
- Backend: **Fastify (Node.js)** on port 8080
- Demos: Streamlit on port 7860

**V2 (Current):**
- Frontend: Astro (port 4321 dev, port 8080 prod via nginx)
- Backend: **FastAPI (Python)** on port 8000
- Demos: Streamlit on port 7860

---

## Why FastAPI?

### Python-First Stack Benefits

1. **Consistency**: Entire backend in Python (API + ML demos)
2. **Type Safety**: Pydantic for automatic validation
3. **Performance**: Async support, comparable to Node.js
4. **ML Ecosystem**: Seamless integration with ML libraries
5. **Developer Experience**: Automatic API docs (Swagger/ReDoc)
6. **Modern Python**: Type hints, async/await, dependency injection

---

## Breaking Changes

### Port Changes

| Service | V1 Port | V2 Port | Notes |
|---------|---------|---------|-------|
| Homepage (dev) | 4321 | 4321 | No change |
| Homepage (prod) | 4321 | 8080 | Now served by nginx container |
| API | 8080 | 8000 | FastAPI standard port |
| Demos | 7860 | 7860 | No change |

### Technology Stack

| Component | V1 | V2 |
|-----------|----|----|
| Frontend | Astro + React Islands | Astro + React Islands (no change) |
| Backend | Fastify (Node.js + TypeScript) | FastAPI (Python + Pydantic) |
| Backend Language | JavaScript/TypeScript | Python |
| ML Demos | Streamlit (Python) | Streamlit (Python) (no change) |

### File Structure Changes

**V1:**
```
apps/
├── homepage/          # Astro
├── api/               # Fastify (Node.js)
└── demos/             # Streamlit
```

**V2:**
```
apps/
├── web/               # Astro (renamed from homepage)
├── api/               # FastAPI (Python, not Node.js)
└── demos/             # Streamlit
```

### Configuration Changes

**ecosystem.config.cjs (PM2):**

```javascript
// V1
{
  name: "api",
  cwd: "./apps/api",
  script: "npm",
  args: "run dev",
  env: { PORT: "8080" }
}

// V2
{
  name: "api",
  cwd: "./apps/api",
  script: "uvicorn",
  args: "app.main:app --reload --host 0.0.0.0 --port 8000"
}
```

**docker-compose.yml:**

```yaml
# V1
api:
  build: ./apps/api
  ports:
    - "8080:8080"
  # Node.js container

# V2
api:
  build: ./apps/api
  ports:
    - "8000:8000"
  # Python container with uvicorn
```

**nginx.conf:**

```nginx
# V1
location /api/ {
    proxy_pass http://localhost:8080/api/;
}

# V2
location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;
}
```

---

## Migration Steps

### 1. Update Dependencies

**Remove (Node.js API):**
```bash
cd apps/api
rm -rf node_modules package.json package-lock.json
```

**Add (Python API):**
```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn pydantic python-multipart
pip freeze > requirements.txt
```

### 2. Update API Code

**V1 (Fastify):**
```typescript
// apps/api/src/index.ts
import Fastify from 'fastify';

const fastify = Fastify();

fastify.get('/api/health', async () => {
  return { status: 'ok' };
});

fastify.listen({ port: 8080 });
```

**V2 (FastAPI):**
```python
# apps/api/app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/health")
async def health():
    return {"status": "ok"}

# Run with: uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Update Docker Files

**apps/api/Dockerfile (V2):**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 4. Update Nginx Configuration

**infra/nginx/portfolio.conf:**
```nginx
# Update API proxy
location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;  # Changed from 8080 to 8000
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 5. Update PM2 Configuration

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
      script: "uvicorn",  // Changed from npm
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

### 6. Update Environment Variables

**.env.example:**
```bash
# V1
NODE_ENV=development
API_PORT=8080

# V2
ENVIRONMENT=development
API_PORT=8000
```

---

## Production Deployment Changes

### Astro Build Strategy

**V1:** Astro dev server in production (not recommended)
**V2:** Astro builds to static files, served by nginx container

**apps/web/Dockerfile (V2):**
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### Localhost-Only Binds

**docker-compose.prod.yml:**
```yaml
services:
  web:
    ports:
      - "127.0.0.1:8080:8080"  # Only accessible from localhost
  api:
    ports:
      - "127.0.0.1:8000:8000"  # Only accessible from localhost
  demos:
    ports:
      - "127.0.0.1:7860:7860"  # Only accessible from localhost
```

---

## Benefits of V2

### 1. Python-First Backend

✅ **Single Language**: Python for API + ML demos  
✅ **Type Safety**: Pydantic validation  
✅ **ML Integration**: Easy to add ML endpoints  
✅ **Consistency**: Same tooling across backend

### 2. Better Production Posture

✅ **Static Astro**: Faster, more reliable than dev server  
✅ **Nginx Container**: Professional static file serving  
✅ **Localhost Binds**: Better security (only host nginx exposed)  
✅ **Image Registry**: Build in CI, pull on VM (no building on VM)

### 3. Improved Developer Experience

✅ **Automatic API Docs**: FastAPI generates Swagger/ReDoc  
✅ **Type Hints**: Better IDE support  
✅ **Async/Await**: Modern Python patterns  
✅ **Dependency Injection**: Clean, testable code

---

## Testing the Migration

### Local Development

```bash
# 1. Install Python dependencies
cd apps/api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ../..

# 2. Start services with PM2
pm2 start ecosystem.config.cjs

# 3. Test endpoints
curl http://localhost:4321              # Astro dev server
curl http://localhost:8000/api/health   # FastAPI
curl http://localhost:7860              # Streamlit
```

### Docker Testing

```bash
# Build and start
docker compose -f docker-compose.dev.yml up --build

# Test
curl http://localhost:4321
curl http://localhost:8000/api/health
curl http://localhost:7860
```

---

## Rollback Plan

If you need to rollback to V1:

```bash
# 1. Checkout previous commit
git log --oneline  # Find commit before migration
git checkout <commit-hash>

# 2. Rebuild containers
docker compose down
docker compose up --build

# 3. Restart services
pm2 delete all
pm2 start ecosystem.config.cjs
```

---

## Documentation Updates

All documentation has been updated to reflect V2:

- ✅ `IMPLEMENTATION_PLAN_V2.md` - New comprehensive plan
- ✅ `docs/ARCHITECTURE.md` - Updated for FastAPI
- ⏳ `README.md` - Needs update
- ⏳ `PORTS.md` - Needs update
- ⏳ `configs/nginx.conf` - Needs update
- ⏳ `docker-compose.yml` - Needs update
- ⏳ `docker-compose.prod.yml` - Needs update
- ⏳ `ecosystem.config.cjs` - Needs update

---

## Next Steps

1. ✅ Review IMPLEMENTATION_PLAN_V2.md
2. ⏳ Update remaining configuration files
3. ⏳ Implement FastAPI backend (Phase 3)
4. ⏳ Test end-to-end locally
5. ⏳ Deploy to GCP VM

---

## Questions?

- **Why not keep Fastify?** Python-first stack is more consistent and better for ML integration
- **Performance concerns?** FastAPI is async and comparable to Node.js frameworks
- **Migration effort?** Minimal - API is simple (health + contact endpoints)
- **Can I use both?** Not recommended - adds complexity without clear benefits

---

**Status:** Ready for implementation 🚀
