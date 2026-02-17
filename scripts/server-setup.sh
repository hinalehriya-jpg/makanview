#!/bin/bash
# ============================================================
# Makanview — First-time Server Setup Script (High Performance)
# Run this ONCE on a fresh AWS Lightsail Ubuntu 22.04 instance
# Usage: bash server-setup.sh
# ============================================================

set -e

echo "🚀 Makanview Server Setup (Global Performance)"
echo "================================================="

# --- System update ---
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# --- Install Node.js 20 ---
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# --- Install PostgreSQL ---
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "📦 Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE USER makanview WITH PASSWORD 'CHANGE_THIS_PASSWORD';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE makanview OWNER makanview;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE makanview TO makanview;" 2>/dev/null || true

echo "✅ PostgreSQL database 'makanview' created"
echo "⚠️  IMPORTANT: Change the default password! Run:"
echo "   sudo -u postgres psql -c \"ALTER USER makanview WITH PASSWORD 'your_strong_password';\""

# --- Install Nginx ---
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# --- Install Certbot for SSL ---
echo "📦 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# --- Install PM2 ---
echo "📦 Installing PM2..."
sudo npm install -g pm2

# --- Install Git ---
sudo apt install -y git

# --- Create app directory ---
echo "📁 Creating app directory..."
sudo mkdir -p /var/www/makanview
sudo chown $USER:$USER /var/www/makanview

# --- Create Nginx cache directory ---
sudo mkdir -p /var/cache/nginx
sudo chown www-data:www-data /var/cache/nginx

# --- Tune PostgreSQL for performance ---
echo "📦 Tuning PostgreSQL for performance..."
PG_CONF=$(sudo -u postgres psql -t -c "SHOW config_file;" | xargs)
if [ -f "$PG_CONF" ]; then
  sudo tee -a "$PG_CONF" > /dev/null << 'PGCONF'

# ─── Makanview Performance Tuning ───
shared_buffers = 256MB
effective_cache_size = 768MB
work_mem = 4MB
maintenance_work_mem = 128MB
max_connections = 100
random_page_cost = 1.1
effective_io_concurrency = 200
wal_buffers = 16MB
checkpoint_completion_target = 0.9
PGCONF
  sudo systemctl restart postgresql
  echo "✅ PostgreSQL tuned for performance"
fi

# --- Tune Nginx for high traffic ---
echo "📦 Tuning Nginx for high traffic..."
sudo tee /etc/nginx/nginx.conf > /dev/null << 'NGINXCONF'
user www-data;
worker_processes auto;
worker_rlimit_nofile 65535;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 1000;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 50M;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml
        application/rss+xml
        image/svg+xml
        font/woff2;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
NGINXCONF
sudo systemctl restart nginx
echo "✅ Nginx tuned for high traffic"

# --- System tuning for high traffic ---
echo "📦 Tuning system limits..."
sudo tee -a /etc/security/limits.conf > /dev/null << 'LIMITS'
* soft nofile 65535
* hard nofile 65535
LIMITS

# Kernel network tuning
sudo tee -a /etc/sysctl.conf > /dev/null << 'SYSCTL'

# ─── Makanview Network Tuning ───
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_probes = 5
net.ipv4.tcp_keepalive_intvl = 15
SYSCTL
sudo sysctl -p

# --- Setup PM2 ecosystem ---
echo "📦 Setting up PM2 ecosystem..."
cat > /var/www/makanview/ecosystem.config.js << 'PM2CONF'
module.exports = {
  apps: [{
    name: 'makanview',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/makanview',
    instances: 'max',           // Use all CPU cores
    exec_mode: 'cluster',       // Cluster mode for load balancing
    max_memory_restart: '500M', // Auto-restart if memory exceeds 500MB
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    // Graceful restart
    kill_timeout: 5000,
    listen_timeout: 10000,
    // Logging
    error_file: '/var/log/pm2/makanview-error.log',
    out_file: '/var/log/pm2/makanview-out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
PM2CONF

sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

echo ""
echo "============================================"
echo "✅ System setup complete!"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Change PostgreSQL password:"
echo "   sudo -u postgres psql -c \"ALTER USER makanview WITH PASSWORD 'YOUR_STRONG_PASSWORD';\""
echo ""
echo "2. Clone your repo:"
echo "   cd /var/www/makanview"
echo "   git clone https://github.com/YOUR_USERNAME/makanview.git ."
echo ""
echo "3. Create .env file:"
echo "   cp .env.example .env"
echo "   nano .env   # Set DATABASE_URL, AUTH_SECRET, S3 keys, etc."
echo ""
echo "4. Install & build:"
echo "   npm install"
echo "   npx prisma generate"
echo "   npx prisma migrate deploy"
echo "   npx prisma db seed"
echo "   npm run build"
echo ""
echo "5. Start with PM2 (cluster mode — uses all CPU cores):"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup   # follow the printed command"
echo ""
echo "6. Configure Nginx + SSL:"
echo "   sudo bash scripts/nginx-setup.sh yourdomain.com"
echo "   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "============================================"
