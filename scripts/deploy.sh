#!/bin/bash

# Hostinger デプロイスクリプト
set -e

echo "🚀 Starting deployment..."

# バックアップ作成
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"

echo "📦 Creating backup: $BACKUP_FILE"
tar -czf "$BACKUP_FILE" \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.github \
  --exclude=logs \
  .

# コンテナ停止
echo "🛑 Stopping containers..."
docker-compose down

# イメージビルド
echo "🏗️ Building Docker image..."
docker-compose build --no-cache

# コンテナ起動
echo "🚀 Starting containers..."
docker-compose up -d

# ヘルスチェック
echo "🏥 Health checking..."
sleep 30

MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
    echo "🌐 Application is available at: http://72.60.195.249:3001"
    exit 0
  fi
  
  echo "⏳ Waiting for application to start... ($((RETRY_COUNT + 1))/$MAX_RETRIES)"
  sleep 10
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

echo "❌ Deployment failed - rolling back..."
docker-compose down
docker-compose up -d
echo "🔄 Rollback completed"

exit 1
