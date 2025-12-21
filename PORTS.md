# Port Allocation

Track all port allocations to avoid conflicts.

## Core Services

| Service | Port (Dev) | Port (Prod) | Path | Tech | Status |
|---------|------------|-------------|------|------|--------|
| Homepage | 4321 | 8080 | `/` | Astro + nginx | Active |
| API | 8000 | 8000 | `/api/*` | FastAPI | Active |
| ML Demos | 7860 | 7860 | `/demos/*` | Streamlit | Active |

## Project Containers

| Project | Port | Path | Status | Added |
|---------|------|------|--------|-------|
| chatbot | 8001 | `/projects/chatbot/*` | Planned | - |
| cv-analyzer | 8002 | `/projects/cv-app/*` | Planned | - |
| realtime-game | 8003 | `/projects/game/*` | Planned | - |
| (reserved) | 8004 | - | Reserved | - |
| (reserved) | 8005 | - | Reserved | - |

## Port Range

- **Core Services**: 
  - 4321 (Astro dev server)
  - 8080 (Astro static via nginx in production)
  - 8000 (FastAPI)
  - 7860 (Streamlit)
- **Projects**: 8001-8099 (99 projects max)
- **Reserved**: 8100+ for future use

## Port Notes

### Homepage (Astro)
- **Development**: Port 4321 (Astro dev server)
- **Production**: Port 8080 (nginx serves static build)
- **Why different**: Dev server for HMR, nginx for production performance

### API (FastAPI)
- **All environments**: Port 8000 (FastAPI/uvicorn standard)
- **Why 8000**: Python web framework convention
- **Changed from**: 8080 (was Fastify in v1)

### ML Demos (Streamlit)
- **All environments**: Port 7860 (Streamlit default)
- **No change**: Consistent across v1 and v2

## Adding a New Project

1. Choose next available port (8004, 8005, etc.)
2. Update this file
3. Add to `docker-compose.prod.yml`
4. Add to `configs/nginx.conf`
5. Test locally before deploying

## Notes

- Ports 1-1023 require root privileges (avoid)
- Ports 1024-49151 are registered ports (check conflicts)
- Ports 49152-65535 are dynamic/private (safe to use)
