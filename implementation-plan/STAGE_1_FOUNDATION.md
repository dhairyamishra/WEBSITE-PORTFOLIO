# Stage 1: Foundation & Architecture
## Phases 0-1: Planning & Repository Setup

**Duration:** 1-2 days  
**Prerequisites:** None  
**Deliverables:** Working monorepo structure with standards and documentation

---

## Overview

This stage establishes the foundation for your portfolio platform. You'll finalize the MVP scope, set up the monorepo structure, establish coding standards, and prepare your local development environment.

---

## Phase 0: Finalize MVP Scope (1 hour)

### Objectives
- Define exactly what will be built in the initial release
- Avoid scope creep by deferring non-essential features
- Set clear expectations for what "done" looks like

### Tasks

#### 1. Confirm Initial Pages
- [ ] **Home** - Hero section, skills overview, featured projects
- [ ] **About** - Bio, experience timeline, education
- [ ] **Projects** - Gallery of all projects with filtering
- [ ] **Contact** - Contact form with anti-spam measures

**Decision Point:** Are these 4 pages sufficient for MVP? Or do you need additional pages?

#### 2. Confirm Streamlit Demos (2-3 to start)
- [ ] **Demo 1:** _(Define your first demo)_
- [ ] **Demo 2:** _(Define your second demo)_
- [ ] **Demo 3 (Optional):** _(Define your third demo)_

**Considerations:**
- Keep models small for fast loading
- Focus on educational value ("How it works", "Limitations")
- Ensure demos showcase different ML capabilities

#### 3. Decide on `/projects/*` Timing
- [ ] **Option A:** Include in MVP (adds 1-2 weeks)
- [ ] **Option B:** Add after MVP launch (recommended)

**Recommendation:** Start without `/projects/*` containers. Add them in Stage 5 after the core platform is stable.

### Deliverables
- ✅ Clear list of MVP pages
- ✅ Defined Streamlit demos
- ✅ Decision on project containers timing

---

## Phase 1: Repo Scaffold + Standards

### Objectives
- Create a clean, organized monorepo structure
- Establish coding standards and conventions
- Set up version control and documentation
- Prepare local development environment

---

### Task 1.1: Initialize Git Repository

```bash
# Navigate to project directory
cd c:\--DPM-MAIN-DIR--\windsurf_projects\WEBSITE-PORTFOLIO

# Initialize git (if not already done)
git init

# Create initial commit
git add .
git commit -m "Initial commit: Project structure"

# Create main branch (if needed)
git branch -M main

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

---

### Task 1.2: Create Monorepo Folder Structure

Create the following directory structure:

```bash
# Create main directories
mkdir -p apps/web apps/api apps/demos apps/projects/_template
mkdir -p infra/nginx
mkdir -p scripts
mkdir -p data/models data/datasets data/outputs data/uploads
mkdir -p .github/workflows
mkdir -p implementation-plan
```

**Directory Explanation:**

- `apps/web/` - Astro frontend (homepage, projects, contact)
- `apps/api/` - FastAPI backend (contact form, health checks)
- `apps/demos/` - Streamlit ML demos
- `apps/projects/` - Individual project containers (add later)
- `apps/projects/_template/` - Template for new projects
- `infra/nginx/` - Nginx reverse proxy configuration
- `scripts/` - Python automation scripts
- `data/` - Data directory (gitignored, mounted from persistent disk in prod)
- `.github/workflows/` - CI/CD pipeline definitions
- `implementation-plan/` - This documentation

---

### Task 1.3: Create `.gitignore`

Create a comprehensive `.gitignore` file:

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.*.local
/etc/portfolio/.env

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.venv
pip-log.txt
pip-delete-this-directory.txt
.pytest_cache/
*.egg-info/
dist/
build/

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.npm
.yarn/

# Astro
.astro/
dist/
.output/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Data (mounted from persistent disk)
data/
!data/.gitkeep

# Logs
logs/
*.log

# OS
Thumbs.db
.DS_Store

# Docker
.dockerignore

# PM2
.pm2/
```

---

### Task 1.4: Create `.env.example`

Create a template for environment variables:

```bash
# .env.example
# Copy this file to .env.local for local development

# Environment
ENVIRONMENT=development

# API Configuration
API_PORT=8000
API_HOST=0.0.0.0

# Email Service (SendGrid example)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=your@email.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=5

# CORS (for local dev)
CORS_ORIGINS=http://localhost:4321,http://localhost:3000

# Streamlit
STREAMLIT_PORT=7860

# Web
WEB_PORT=4321

# Production (VM only)
# GCP_PROJECT_ID=your-project-id
# GCP_REGION=us-central1
# DOMAIN=yourdomain.com
```

---

### Task 1.5: Create `PORTS.md`

Create a port allocation tracking document:

```markdown
# Port Allocation

This file tracks all port assignments to prevent conflicts.

## Port Assignments

| Service | Port | Path | Status | Date Added |
|---------|------|------|--------|------------|
| web (dev) | 4321 | `/` | Active | 2025-12-21 |
| web (prod) | 8080 | `/` | Active | 2025-12-21 |
| api | 8000 | `/api/*` | Active | 2025-12-21 |
| demos | 7860 | `/demos/*` | Active | 2025-12-21 |
| project-1 | 8001 | `/projects/[name]/*` | Reserved | - |
| project-2 | 8002 | `/projects/[name]/*` | Reserved | - |
| project-3 | 8003 | `/projects/[name]/*` | Reserved | - |

## Port Ranges

- **4000-4999**: Development servers
- **7000-7999**: ML/Data services (Streamlit, Jupyter, etc.)
- **8000-8099**: Production services and project containers

## Adding New Services

1. Choose next available port in appropriate range
2. Update this table
3. Update docker-compose files
4. Update nginx configuration
5. Commit changes
```

---

### Task 1.6: Create `README.md`

Create a comprehensive README:

```markdown
# Portfolio Platform

A full-stack portfolio website built as a platform for showcasing projects, ML demos, and professional experience.

## Architecture

- **Frontend**: Astro + TypeScript + React Islands
- **Backend**: FastAPI (Python)
- **ML Demos**: Streamlit (Python)
- **Deployment**: GCP Compute Engine VM + Docker Compose + Nginx
- **CI/CD**: GitHub Actions

## Tech Stack

### Frontend (Astro)
- Zero JS by default for optimal performance
- React islands for interactive components
- Static site generation for SEO
- Tailwind CSS for styling

### Backend (FastAPI)
- Python-first architecture
- Type safety with Pydantic
- Async support
- Auto-generated API docs

### ML Demos (Streamlit)
- Interactive ML demonstrations
- Educational content
- Real-time model inference

## Project Structure

```
portfolio/
├── apps/
│   ├── web/          # Astro frontend
│   ├── api/          # FastAPI backend
│   ├── demos/        # Streamlit ML demos
│   └── projects/     # Individual project containers
├── infra/
│   └── nginx/        # Nginx reverse proxy config
├── scripts/          # Python automation scripts
├── .github/
│   └── workflows/    # CI/CD pipelines
└── implementation-plan/  # Documentation
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PM2 (for local development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Install dependencies**
   ```bash
   # Web (Astro)
   cd apps/web
   npm install
   cd ../..

   # API (FastAPI)
   cd apps/api
   pip install -r requirements.txt
   cd ../..

   # Demos (Streamlit)
   cd apps/demos
   pip install -r requirements.txt
   cd ../..
   ```

4. **Start all services with PM2**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.cjs
   pm2 logs
   ```

5. **Access services**
   - Homepage: http://localhost:4321
   - API: http://localhost:8000/api/health
   - Demos: http://localhost:7860/demos/

### Docker Development

```bash
# Build and start all services
docker compose -f docker-compose.dev.yml up --build

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop services
docker compose -f docker-compose.dev.yml down
```

## Deployment

See [IMPLEMENTATION_PLAN.md](implementation-plan/IMPLEMENTATION_PLAN.md) for detailed deployment instructions.

## Documentation

- [Implementation Plan](implementation-plan/IMPLEMENTATION_PLAN.md) - Complete implementation guide
- [Stage 1: Foundation](implementation-plan/STAGE_1_FOUNDATION.md) - Repository setup
- [Stage 2: Core Services](implementation-plan/STAGE_2_CORE_SERVICES.md) - Building services
- [Stage 3: Containerization](implementation-plan/STAGE_3_CONTAINERIZATION.md) - Docker setup
- [Stage 4: GCP Deployment](implementation-plan/STAGE_4_GCP_DEPLOYMENT.md) - Cloud deployment
- [Stage 5: Production](implementation-plan/STAGE_5_PRODUCTION.md) - Hardening & expansion

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for scripting standards and contribution guidelines.

## License

MIT License - See [LICENSE](LICENSE) for details
```

---

### Task 1.7: Create `CONTRIBUTING.md`

Create contribution guidelines with scripting standards:

```markdown
# Contributing Guidelines

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

### Script Template

When creating new automation scripts:

```python
#!/usr/bin/env python3
"""
Script Description: What this script does
"""
import sys
from pathlib import Path

def main():
    """Main function"""
    try:
        # Your code here
        print("✅ Success message")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

### Best Practices

1. **Use Python**: Create `.py` files in `scripts/` directory
2. **Add Shebang**: Start with `#!/usr/bin/env python3`
3. **Cross-Platform**: Use `pathlib.Path` instead of string paths
4. **Error Handling**: Use try/except blocks
5. **User Feedback**: Use colored output for clarity (✅ ❌ ⚠️)
6. **Documentation**: Add docstrings and comments

## Code Style

### Python
- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use Black for formatting

### TypeScript/JavaScript
- Follow Airbnb style guide
- Use ESLint + Prettier
- Maximum line length: 100 characters

### Commits
- Use conventional commits format
- Examples:
  - `feat: add contact form validation`
  - `fix: resolve CORS issue in API`
  - `docs: update deployment guide`
  - `chore: update dependencies`
```

---

### Task 1.8: Add Lint/Format Configs

#### Python: `pyproject.toml`

```toml
[tool.black]
line-length = 100
target-version = ['py311']
include = '\.pyi?$'

[tool.isort]
profile = "black"
line_length = 100

[tool.pylint]
max-line-length = 100
disable = ["C0111", "C0103"]
```

#### JavaScript/TypeScript: `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

### Task 1.9: Test Environment Setup

Create a simple test script to verify the environment:

```python
#!/usr/bin/env python3
"""
Environment verification script
Tests that all required tools are installed
"""
import subprocess
import sys
from pathlib import Path

def check_command(command, version_flag="--version"):
    """Check if a command is available"""
    try:
        result = subprocess.run(
            [command, version_flag],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.returncode == 0
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False

def main():
    """Main function"""
    print("🔍 Checking development environment...\n")
    
    checks = [
        ("Python", "python", "--version"),
        ("Node.js", "node", "--version"),
        ("npm", "npm", "--version"),
        ("Docker", "docker", "--version"),
        ("Docker Compose", "docker", "compose version"),
    ]
    
    all_passed = True
    
    for name, command, *flags in checks:
        flag = flags[0] if flags else "--version"
        if check_command(command, flag):
            print(f"✅ {name} is installed")
        else:
            print(f"❌ {name} is NOT installed")
            all_passed = False
    
    print()
    
    if all_passed:
        print("✅ All required tools are installed!")
        print("\nNext steps:")
        print("1. Copy .env.example to .env.local")
        print("2. Install dependencies (npm install, pip install)")
        print("3. Start development with: pm2 start ecosystem.config.cjs")
        return 0
    else:
        print("❌ Some required tools are missing. Please install them before continuing.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
```

Save this as `scripts/check_environment.py` and run:

```bash
python scripts/check_environment.py
```

---

## Deliverables Checklist

By the end of Stage 1, you should have:

- [x] Git repository initialized with remote
- [x] Complete monorepo folder structure
- [x] `.gitignore` configured
- [x] `.env.example` created
- [x] `PORTS.md` for port tracking
- [x] `README.md` with project overview
- [x] `CONTRIBUTING.md` with scripting standards
- [x] Lint/format configs (Python + JS)
- [x] Environment verification script
- [x] All tools installed and verified

**Status:** ✅ COMPLETED (2025-12-24)  
**Commit:** `96efe17` - feat: complete Stage 1 foundation setup

---

## Next Steps

Once Stage 1 is complete, proceed to:

**[Stage 2: Core Services Development](STAGE_2_CORE_SERVICES.md)** - Build the Astro web, FastAPI API, and Streamlit demos.

---

## Troubleshooting

### Git Issues

**Problem:** Remote already exists
```bash
# Remove existing remote
git remote remove origin
# Add new remote
git remote add origin https://github.com/yourusername/portfolio.git
```

### Permission Issues (Windows)

**Problem:** Cannot create directories
```powershell
# Run PowerShell as Administrator
# Or use File Explorer to create directories manually
```

### Python Not Found

**Problem:** `python` command not recognized
```bash
# Try python3 instead
python3 --version

# Or add Python to PATH (Windows)
# System Properties > Environment Variables > Path > Add Python directory
```

---

**Stage 1 Complete!** 🎉

You now have a solid foundation. Move on to Stage 2 to start building the actual services.
