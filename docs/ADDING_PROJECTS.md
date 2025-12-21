# Adding New Projects

This guide shows how to add a new project container to your portfolio platform.

## Step-by-Step Guide

### 1. Create Project Directory

```bash
cd apps/projects
mkdir my-new-project
cd my-new-project
```

### 2. Build Your Project

Develop your project using any tech stack. Ensure it:
- Can run in a container
- Listens on a configurable port (via `PORT` env var)
- Has a health check endpoint (optional but recommended)

### 3. Create Dockerfile

```dockerfile
# Example for Node.js project
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8004
CMD ["npm", "start"]
```

```dockerfile
# Example for Python project
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8004
CMD ["python", "app.py"]
```

### 4. Add to docker-compose.prod.yml

```yaml
  project-my-new-project:
    build: ./apps/projects/my-new-project
    ports:
      - "8004:8004"  # Next available port
    environment:
      - NODE_ENV=production
      - PORT=8004
    volumes:
      - /mnt/data/models/my-project:/app/models:ro  # If needed
      - /mnt/data/outputs/my-project:/app/outputs:rw
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. Add Nginx Location Block

Edit `/etc/nginx/sites-available/portfolio` on the VM:

```nginx
# Add before the catch-all location /
location /projects/my-new-project/ {
    proxy_pass http://localhost:8004/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 6. Add Project Card to Homepage

```typescript
// apps/homepage/src/data/projects.ts
export const projects: Project[] = [
  // ... existing projects
  {
    id: "my-new-project",
    title: "My Awesome Project",
    description: "A full-stack application that does amazing things",
    tags: ["React", "Node.js", "PostgreSQL"],
    thumbnail: "/images/my-project-thumb.png",
    demoUrl: "/projects/my-new-project",
    githubUrl: "https://github.com/yourusername/my-new-project",
    featured: true,
    category: "web"
  }
];
```

### 7. Test Locally

```bash
# Add to docker-compose.yml for local testing
docker compose up --build project-my-new-project

# Test the endpoint
curl http://localhost:8004
```

### 8. Deploy to Production

```bash
# Commit changes
git add .
git commit -m "Add my-new-project"
git push origin main

# SSH into VM
ssh user@YOUR_VM_IP
cd ~/portfolio
git pull

# Deploy new project
docker compose -f docker-compose.prod.yml up -d --build project-my-new-project

# Reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Verify
docker compose -f docker-compose.prod.yml ps
curl https://yourdomain.com/projects/my-new-project
```

## Port Allocation

Keep track of ports in `PORTS.md`:

| Project | Port | Status |
|---------|------|--------|
| chatbot | 8001 | Active |
| cv-app | 8002 | Active |
| game | 8003 | Active |
| my-new-project | 8004 | Active |
| next-project | 8005 | Reserved |

## Project Template

Use the template in `apps/projects/_template/` as a starting point:

```bash
cp -r apps/projects/_template apps/projects/my-new-project
cd apps/projects/my-new-project
# Edit files as needed
```

## Best Practices

1. **Health Checks**: Add a `/health` endpoint
2. **Logging**: Use structured logging (JSON format)
3. **Environment Variables**: Use `.env` for configuration
4. **Error Handling**: Graceful error handling and user feedback
5. **Documentation**: Add README.md to your project
6. **Testing**: Test locally before deploying
7. **Monitoring**: Add metrics/analytics if needed

## Troubleshooting

### Project Won't Start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs project-my-new-project

# Check if port is available
sudo netstat -tlnp | grep 8004
```

### Nginx 502 Bad Gateway
- Ensure container is running
- Check if port matches in docker-compose and nginx config
- Verify proxy_pass URL ends with `/`

### Can't Access Project
- Check DNS is pointing to VM
- Verify Nginx config with `sudo nginx -t`
- Check firewall rules
- Test direct access: `curl http://localhost:8004`
