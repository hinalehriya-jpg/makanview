#!/bin/bash
# ============================================================
# Makanview — High-Performance Nginx + SSL Setup
# Usage: sudo bash scripts/nginx-setup.sh yourdomain.com
# ============================================================

set -e

DOMAIN=${1:-"yourdomain.com"}

echo "🌐 Setting up high-performance Nginx for: $DOMAIN"

# Create Nginx config
cat > /etc/nginx/sites-available/makanview << 'NGINXEOF'
# ─── Gzip Compression ───
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
  application/atom+xml
  image/svg+xml
  font/woff2;

# ─── Brotli Compression (if module available) ───
# brotli on;
# brotli_comp_level 6;
# brotli_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml image/svg+xml font/woff2;

# ─── Rate Limiting Zones ───
limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# ─── Proxy Cache ───
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off max_size=1g;

server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    client_max_body_size 50M;

    # ─── Security Headers ───
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # ─── Static Assets (aggressive cache) ───
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache STATIC;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # ─── Next.js Image Optimization Cache ───
    location /_next/image {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache STATIC;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # ─── Public static files (favicon, robots, images) ───
    location ~* \.(ico|svg|png|jpg|jpeg|webp|avif|gif|woff2|woff|ttf|css|js)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache STATIC;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # ─── API Rate Limiting ───
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ─── Main App (with rate limiting) ───
    location / {
        limit_req zone=general burst=50 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Proxy timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 60s;
    }
}
NGINXEOF

# Replace domain placeholder
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/makanview

# Enable the site
ln -sf /etc/nginx/sites-available/makanview /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart
nginx -t
systemctl restart nginx

echo ""
echo "✅ High-performance Nginx configured for $DOMAIN"
echo ""
echo "NEXT: Set up free SSL certificate:"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
