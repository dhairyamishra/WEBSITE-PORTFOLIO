# Deployment Guide

## GCP VM Setup

### 1. Create VM & Persistent Disk

```bash
# Set variables
export PROJECT_ID="your-portfolio-project"
export ZONE="us-central1-a"
export VM_NAME="portfolio-vm"
export DISK_NAME="portfolio-data-disk"

# Create VM
gcloud compute instances create $VM_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB

# Reserve static IP
gcloud compute addresses create portfolio-ip \
  --project=$PROJECT_ID \
  --region=us-central1

# Create persistent disk
gcloud compute disks create $DISK_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --size=100GB \
  --type=pd-standard

# Attach disk to VM
gcloud compute instances attach-disk $VM_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --disk=$DISK_NAME

# Configure firewall
gcloud compute firewall-rules create allow-http-https-ssh \
  --project=$PROJECT_ID \
  --allow=tcp:22,tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0
```

### 2. Configure VM

```bash
# SSH into VM
gcloud compute ssh $VM_NAME --zone=$ZONE

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Format and mount persistent disk
sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/sdb
sudo mkdir -p /mnt/data
sudo mount -o discard,defaults /dev/sdb /mnt/data
sudo chown $USER:$USER /mnt/data

# Configure auto-mount
sudo blkid /dev/sdb  # Copy UUID
sudo nano /etc/fstab
# Add: UUID=YOUR-UUID /mnt/data ext4 discard,defaults,nofail 0 2

# Create data structure
cd /mnt/data
mkdir -p models/{nlp,cv,audio} datasets/{images,text,audio} outputs/{generated_text,generated_images} uploads/user_files

# Clone repository
cd ~
git clone https://github.com/yourusername/portfolio.git
cd portfolio
ln -s /mnt/data data
```

### 3. Configure Nginx

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/portfolio
```

**Nginx Configuration** (see `configs/nginx.conf` for full config)

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Set Up SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test renewal
sudo certbot renew --dry-run
```

### 5. Deploy Application

```bash
# Create production .env
nano .env
# Add production secrets

# Deploy
docker compose -f docker-compose.prod.yml up -d --build

# Verify
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

### 6. Update DNS

Point your domain's A record to the VM's static IP.

## CI/CD with GitHub Actions

### 1. Set Up SSH Key

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/portfolio_deploy

# Add public key to VM
cat ~/.ssh/portfolio_deploy.pub
# SSH into VM and add to ~/.ssh/authorized_keys

# Add private key to GitHub Secrets
# Repository → Settings → Secrets → New secret
# Name: SSH_PRIVATE_KEY
# Value: (contents of ~/.ssh/portfolio_deploy)
```

### 2. Create Workflow

See `.github/workflows/deploy.yml` for full workflow.

## Production Hardening

### Security

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Set up unattended-upgrades
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Monitoring

```bash
# Set up disk usage monitoring
crontab -e
# Add: 0 */6 * * * df -h /mnt/data | mail -s "Disk Usage" your-email@example.com
```

## Rollback Procedure

```bash
# SSH into VM
ssh user@YOUR_VM_IP

# Check git history
cd ~/portfolio
git log --oneline

# Rollback to previous commit
git checkout <commit-hash>
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# Or rollback to tag
git checkout v1.0.0
docker compose -f docker-compose.prod.yml up -d --build
```

## Backup Strategy

```bash
# Create snapshot
gcloud compute disks snapshot $DISK_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --snapshot-names=portfolio-data-$(date +%Y%m%d)

# List snapshots
gcloud compute snapshots list

# Restore from snapshot
gcloud compute disks create portfolio-data-disk-restored \
  --source-snapshot=portfolio-data-20251220 \
  --zone=$ZONE
```

## Adding New Projects

See `docs/ADDING_PROJECTS.md` for detailed guide.

**Quick Steps**:
1. Create `apps/projects/[name]/`
2. Add Dockerfile
3. Update `docker-compose.prod.yml`
4. Add Nginx location block
5. Add project card to homepage
6. Deploy
