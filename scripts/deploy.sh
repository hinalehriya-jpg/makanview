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

echo "→ Restarting application..."
pm2 restart makanview || pm2 start npm --name "makanview" -- start
pm2 save

echo ""
echo "✅ Deployment complete!"
echo ""

