#!/bin/bash
# ============================================================
# Makanview — Manual deploy script (run on server)
# Usage: bash scripts/deploy.sh
# ============================================================

set -e

cd /var/www/makanview

echo "→ Pulling latest code..."
git pull origin main

echo "→ Installing dependencies..."
npm ci

echo "→ Generating Prisma client..."
npx prisma generate

echo "→ Running database migrations..."
npx prisma migrate deploy

echo "→ Building project..."
npm run build

echo "→ Stopping PM2..."
pm2 stop makanview || true

echo "→ Deleting old PM2 process..."
pm2 delete makanview || true

echo "→ Starting application..."
pm2 start ecosystem.config.js
pm2 save

echo "→ PM2 Status:"
pm2 status

echo ""
echo "✅ Deployment complete!"
echo ""

