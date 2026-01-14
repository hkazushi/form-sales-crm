# Revos - 営業自動化CRMプラットフォーム

## システム概要

企業データ管理とブラウザ自動化によるフォーム送信を統合したB2B営業自動化プラットフォーム。

## 技術スタック

- **フロントエンド**: React + Vite + Tailwind CSS
- **バックエンド**: Node.js + Express
- **データベース**: Supabase (PostgreSQL)
- **自動化**: Puppeteer/Playwright
- **コンテナ**: Docker

## デプロイ設定

### GitHub Secrets

以下のSecretsをGitHubリポジトリに設定してください：

```
HOSTINGER_HOST=72.60.195.249
HOSTINGER_USER=root
HOSTINGER_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### SSHキーの作成方法

```bash
# SSHキー生成
ssh-keygen -t rsa -b 4096 -C "github-actions"

# 公開キーをHostingerに登録
cat ~/.ssh/id_rsa.pub

# 秘密キーをGitHub Secretsに登録
cat ~/.ssh/id_rsa
```

## 自動デプロイフロー

1. `git push origin main` でGitHubにコードをプッシュ
2. GitHub Actionsが自動的にビルド・デプロイを実行
3. Hostinger VPSに新しいバージョンが反映される
4. http://72.60.195.249:3001 でアプリケーションにアクセス

## ローカル開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start
```

## 環境変数

`.env`ファイルを作成して以下の変数を設定：

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjdWx0c2JhcWtreXFoeWhpYWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTQzMzgsImV4cCI6MjA4MzgzMDMzOH0.QJ02OzL_zIyxmvqRSd-CM66ScOqXYf6yQYBicB1lo6M
PORT=3000
NODE_ENV=development
```

## プロジェクト構成

```
form-sales-crm/
├── .github/workflows/deploy.yml  # GitHub Actions
├── src/                        # Reactソース
├── worker/                     # バックエンド
├── scripts/                    # デプロイスクリプト
├── docker-compose.yml          # Docker設定
├── Dockerfile                 # Dockerイメージ
└── package.json              # 依存関係
```

## ライセンス

MIT License
