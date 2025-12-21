# Portfolio Website Implementation Plan

**Last Updated:** December 20, 2025  
**Architecture:** Microservices in Monorepo  
**Deployment:** GCP Compute Engine VM + Docker Compose + Nginx

---

## Quick Links

- **[Architecture](./docs/ARCHITECTURE.md)** - System design and decisions
- **[Development](./docs/DEVELOPMENT.md)** - Local development guide
- **[Deployment](./docs/DEPLOYMENT.md)** - GCP deployment guide
- **[Adding Projects](./docs/ADDING_PROJECTS.md)** - How to add new projects

---

## Project Goals

- **Portfolio Platform**: Homepage + individual project containers
- **Production-Grade**: Security, monitoring, CI/CD
- **ML-Ready**: Persistent storage for models and datasets
- **Developer-Friendly**: Fast local dev (PM2) + production parity (Docker)
- **Cost-Effective**: ~$32-58/month on GCP

---

## Monorepo Structure

```
portfolio/
├── apps/
│   ├── homepage/          # Portfolio homepage (React)
│   ├── api/               # Backend API (Fastify)
│   ├── demos/             # ML Demos (Streamlit)
│   └── projects/          # Individual project containers
│       ├── _template/     # Project template
│       ├── chatbot/       # Example: AI Chatbot
│       ├── cv-analyzer/   # Example: CV App
│       └── realtime-game/ # Example: Game
├── docs/                  # Documentation (this directory)
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── DEPLOYMENT.md
│   └── ADDING_PROJECTS.md
├── configs/               # Shared configurations
│   ├── nginx.conf         # Nginx reverse proxy config
│   ├── .eslintrc.js       # Shared ESLint config
│   └── tsconfig.base.json # Shared TypeScript config
├── scripts/               # Utility scripts
│   ├── setup-local.sh     # Local environment setup
│   ├── deploy.sh          # Deployment script
│   └── add-project.sh     # New project scaffolding
├── data/                  # Data directory (gitignored)
├── .github/workflows/     # CI/CD pipelines
├── docker-compose.yml     # Local development
├── docker-compose.prod.yml # Production deployment
├── ecosystem.config.cjs   # PM2 configuration
├── .env.example           # Environment variables template
├── .gitignore
├── README.md
├── PORTS.md               # Port allocation tracking
└── IMPLEMENTATION_PLAN.md # This file
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal**: Set up development environment and core structure

- [ ] Initialize monorepo structure
- [ ] Set up Git repository with `.gitignore`
- [ ] Create shared configs (`configs/`)
- [ ] Set up PM2 configuration
- [ ] Create docker-compose files
- [ ] Document port allocations (`PORTS.md`)
- [ ] Test environment setup

**Deliverable**: Working local development environment

---

### Phase 2: Homepage (Week 2)
**Goal**: Build portfolio homepage

- [ ] Initialize Astro + TypeScript
- [ ] Set up Tailwind CSS + design system (Astro integration)
- [ ] Implement pages:
  - [ ] `src/pages/index.astro` - Home (hero, skills, featured projects)
  - [ ] `src/pages/projects/index.astro` - Projects gallery
  - [ ] `src/pages/about.astro` - About (bio, experience)
  - [ ] `src/pages/contact.astro` - Contact page
- [ ] Create Astro components:
  - [ ] `ProjectCard.astro` - Static project cards
  - [ ] `ContactForm.tsx` - React island (client:load)
  - [ ] `ProjectFilter.tsx` - React island (client:visible)
- [ ] Add SEO (meta tags, sitemap, robots.txt) - Built into Astro
- [ ] Optimize performance (Lighthouse 100 target) - Zero JS by default
- [ ] Set up content collections for projects
- [ ] Create Dockerfile

**Deliverable**: Functional homepage with project gallery

---

### Phase 3: API (Week 2-3)
**Goal**: Build backend API

- [ ] Initialize Fastify + TypeScript
- [ ] Implement endpoints:
  - [ ] `GET /api/health`
  - [ ] `POST /api/contact`
- [ ] Add validation (JSON schema)
- [ ] Implement rate limiting (5 req/15min per IP)
- [ ] Add honeypot spam prevention
- [ ] Integrate email service (SendGrid/Mailgun)
- [ ] Set up environment variables
- [ ] Add logging (no PII)
- [ ] Create Dockerfile

**Deliverable**: Working API with contact form integration

---

### Phase 4: ML Demos (Week 3)
**Goal**: Build Streamlit demos

- [ ] Initialize Streamlit app
- [ ] Create demo structure (sidebar + tabs)
- [ ] Implement 2-3 demos:
  - [ ] Demo 1: [Your choice]
  - [ ] Demo 2: [Your choice]
  - [ ] Demo 3: [Your choice]
- [ ] Add educational content (How it works, Limitations)
- [ ] Optimize startup time
- [ ] Configure for containerization
- [ ] Create Dockerfile

**Deliverable**: Interactive ML demos

---

### Phase 5: Containerization (Week 4)
**Goal**: Prepare for deployment

- [ ] Finalize all Dockerfiles
- [ ] Test `docker-compose.yml` locally
- [ ] Create `docker-compose.prod.yml`
- [ ] Configure volume mounts
- [ ] Test end-to-end locally
- [ ] Document any issues

**Deliverable**: Fully containerized application

---

### Phase 6: GCP Setup (Week 4-5)
**Goal**: Set up production infrastructure

- [ ] Create GCP project
- [ ] Create VM (e2-medium, Ubuntu 22.04)
- [ ] Reserve static IP
- [ ] Create persistent disk (100GB)
- [ ] Attach and mount disk
- [ ] Configure firewall rules
- [ ] Set up SSH access
- [ ] Install Docker + Docker Compose
- [ ] Clone repository to VM

**Deliverable**: Production VM ready for deployment

**Reference**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

### Phase 7: Nginx & SSL (Week 5)
**Goal**: Configure reverse proxy and HTTPS

- [ ] Install Nginx
- [ ] Configure reverse proxy (see `configs/nginx.conf`)
- [ ] Install Certbot
- [ ] Obtain SSL certificate
- [ ] Configure auto-renewal
- [ ] Test HTTPS redirect

**Deliverable**: HTTPS-enabled reverse proxy

**Reference**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md#3-configure-nginx)

---

### Phase 8: Deployment (Week 5)
**Goal**: Deploy to production

- [ ] Create production `.env`
- [ ] Deploy with docker-compose
- [ ] Verify all services running
- [ ] Test end-to-end
- [ ] Update DNS

**Deliverable**: Live production site

---

### Phase 9: CI/CD (Week 6)
**Goal**: Automate deployments

- [ ] Set up SSH key for GitHub Actions
- [ ] Create deployment workflow
- [ ] Add health checks
- [ ] Test automated deployment
- [ ] Document rollback procedure

**Deliverable**: Automated deployment pipeline

**Reference**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md#cicd-with-github-actions)

---

### Phase 10: Hardening (Week 6)
**Goal**: Production security and monitoring

- [ ] Configure UFW firewall
- [ ] Install fail2ban
- [ ] Set up unattended-upgrades
- [ ] Configure log rotation
- [ ] Set up monitoring (uptime, disk space)
- [ ] Create backup strategy
- [ ] Perform security audit

**Deliverable**: Hardened production environment

**Reference**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md#production-hardening)

---

### Phase 11: Launch (Week 7)
**Goal**: Go live!

- [ ] Final testing (all user flows)
- [ ] Performance audit (Lighthouse)
- [ ] Security audit
- [ ] Update documentation
- [ ] Announce launch
- [ ] Monitor for issues

**Deliverable**: 🚀 Live portfolio website!

---

## Development Workflow

```
1. Local Development (PM2)
   - Fast iteration
   - Hot reload
   ↓
2. Local Testing (Docker)
   - Production parity
   - Integration testing
   ↓
3. Commit & Push
   - Code review (if team)
   - CI checks
   ↓
4. Deploy (CI/CD or Manual)
   - Automated via GitHub Actions
   - Or manual: SSH → pull → rebuild
   ↓
5. Monitor
   - Check logs
   - Verify functionality
```

**Reference**: [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

---

## Quick Commands

### Local Development
```bash
# PM2 (fast)
pm2 start ecosystem.config.cjs
pm2 logs

# Docker (production parity)
docker compose up --build
```

### Production
```bash
# Deploy
docker compose -f docker-compose.prod.yml up -d --build

# Logs
docker compose -f docker-compose.prod.yml logs -f

# Restart service
docker compose -f docker-compose.prod.yml restart api
```

### Adding Projects
```bash
# Use template
cp -r apps/projects/_template apps/projects/my-project

# Or use script
./scripts/add-project.sh my-project
```

**Reference**: [docs/ADDING_PROJECTS.md](./docs/ADDING_PROJECTS.md)

---

## Key Files

| File | Purpose |
|------|---------|
| `ecosystem.config.cjs` | PM2 configuration for local dev |
| `docker-compose.yml` | Local Docker environment |
| `docker-compose.prod.yml` | Production Docker environment |
| `.env.example` | Environment variables template |
| `configs/nginx.conf` | Nginx reverse proxy config |
| `PORTS.md` | Port allocation tracking |

---

## Next Steps

1. **Review Architecture**: Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
2. **Set Up Environment**: Follow [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)
3. **Start Phase 1**: Initialize monorepo structure
4. **Build Iteratively**: Complete one phase at a time

---

## Support

- **Documentation**: See `docs/` directory
- **Issues**: Use GitHub Issues
- **Questions**: Create a discussion

Ready to build? Let's start with Phase 1! 🚀
