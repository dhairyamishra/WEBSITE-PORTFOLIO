# Port Allocation

Track all port allocations to avoid conflicts.

## Core Services

| Service | Port | Path | Tech | Status |
|---------|------|------|------|--------|
| Homepage | 4321 | `/` | Astro | Active |
| API | 8080 | `/api/*` | Fastify | Active |
| ML Demos | 7860 | `/demos/*` | Streamlit | Active |

## Project Containers

| Project | Port | Path | Status | Added |
|---------|------|------|--------|-------|
| chatbot | 8001 | `/projects/chatbot/*` | Planned | - |
| cv-analyzer | 8002 | `/projects/cv-app/*` | Planned | - |
| realtime-game | 8003 | `/projects/game/*` | Planned | - |
| (reserved) | 8004 | - | Reserved | - |
| (reserved) | 8005 | - | Reserved | - |

## Port Range

- **Core Services**: 4321 (Astro), 7860 (Streamlit), 8080 (Fastify)
- **Projects**: 8001-8099 (99 projects max)
- **Reserved**: 8100+ for future use

## Notes on Astro Port

- **Development**: Port 4321 (Astro default)
- **Production**: Same port 4321 (consistency across environments)
- **Why 4321**: Astro's default dev server port

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
