# Revos CRM サーバー側仕様書

## 1. システム概要

### 1.1 基本情報
- **システム名**: Revos (リボス) - 営業自動化CRMプラットフォーム
- **目的**: 企業データ管理とブラウザ自動化によるフォーム送信の統合
- **アーキテクチャ**: Workerベースの非同期キュー方式

### 1.2 技術スタック
- **ランタイム**: Node.js 18+
- **データベース**: Supabase (PostgreSQL)
- **自動化エンジン**: Puppeteer / Playwright
- **コンテナ**: Docker
- **プロセス管理**: Express.js + Node Worker

## 2. サーバー構成

### 2.1 Dockerコンテナ設定
```yaml
services:
  app:
    image: form-sales-crm-app:latest
    container_name: form-sales-crm-app-1
    ports:
      - "3001:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=https://ipypoksxlmdzbrdzpqwr.supabase.co
      - SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjdWx0c2JhcWtreXFoeWhpYWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTQzMzgsImV4cCI6MjA4MzgzMDMzOH0.QJ02OzL_zIyxmvqRSd-CM66ScOqXYf6yQYBicB1lo6M
      - PORT=3000
    volumes:
      - ./logs:/app/logs
```

### 2.2 環境変数
| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| NODE_ENV | 実行環境 | production |
| SUPABASE_URL | SupabaseプロジェクトURL | - |
| SUPABASE_KEY | Supabase匿名キー | - |
| PORT | サーバーポート | 3000 |

## 3. ディレクトリ構造

```
/root/CascadeProjects/form-sales-crm/
├── worker/                    # バックエンドWorker
│   ├── config.js             # 設定ファイル
│   ├── supabase.js           # Supabaseクライアント
│   ├── server.js             # Expressサーバー
│   ├── scheduler.js          # ジョブスケジューラー
│   └── runner.js             # ブラウザ自動化実行エンジン
├── lib/                      # 共通ライブラリ
│   └── supabaseClient.ts     # Supabaseクライアント（TypeScript）
├── docker-compose.yml        # Dockerコンテナ設定
├── Dockerfile               # Dockerイメージ定義
├── package.json             # Node.js依存関係
└── logs/                    # ログ出力ディレクトリ
```

## 4. 主要コンポーネント仕様

### 4.1 Expressサーバー (worker/server.js)
**役割**: HTTPリクエスト処理、静的ファイル配信、ヘルスチェック

```javascript
機能:
- GET /health: ヘルスチェックエンドポイント
- GET /*: SPAルーティング（index.html返却）
- 静的ファイル配信: /distディレクトリ
- リッスンポート: 3000（コンテナ内）
```

### 4.2 Supabaseクライアント (worker/supabase.js)
**役割**: データベース操作、認証、リアルタイム通信

```javascript
設定:
- URL: https://ipypoksxlmdzbrdzpqwr.supabase.co
- キー: JWT匿名キー
- 機能: CRUD操作、認証、リアルタイムサブスクリプション
```

### 4.3 ジョブスケジューラー (worker/scheduler.js)
**役割**: キャンペーン実行のスケジューリングとキュー管理

```javascript
処理サイクル: 5秒ごと
チェック項目:
- アクティブキャンペーンのスキャン
- 稼働時間内チェック
- 送信間隔制御
- 1日上限数チェック
- キューへのジョブ登録
```

### 4.4 ブラウザ自動化エンジン (worker/runner.js)
**役割**: Puppeteer/Playwrightによるフォーム自動送信

```javascript
処理フロー:
1. キューからジョブ取得
2. ブラウザ起動（Headless Chrome）
3. 企業Webサイトアクセス
4. お問い合わせフォーム探索
5. 自動入力・送信
6. 結果記録
7. リアルタイムログ転送
```

## 5. データベース設計

### 5.1 主要テーブル
| テーブル名 | 説明 | 主要フィールド |
|------------|------|--------------|
| companies | 企業情報 | name, corporate_number, prefecture, industry, status |
| campaigns | キャンペーン | name, template_id, start_date, schedule_settings |
| submission_logs | 送信ログ | company_id, campaign_id, status, result, created_at |
| templates | テンプレート | name, content, variables, script_code |

### 5.2 キュー管理
- **テーブル**: submission_logs
- **ステータス**: queued → processing → completed/failed
- **優先度**: キャンペーン設定に基づくFIFO処理

## 6. 自動化仕様

### 6.1 スケジューリングロジック
```javascript
実行条件チェック:
1. 現在時刻が稼働時間帯内か？
2. 前回送信から間隔時間経過か？
3. 本日の送信上限未満か？
4. キャンペーンがアクティブか？

全条件満時 → キューにジョブ登録
```

### 6.2 ブラウザ操作仕様
```javascript
Puppeteer設定:
- headless: true
- viewport: 1920x1080
- timeout: 30秒
- userAgent: カスタム設定

操作手順:
1. ページナビゲーション
2. フォーム要素検索（CSSセレクタ）
3. 入力フィールド埋め込み
4. 送信ボタンクリック
5. 結果検証
6. スクリーンショット保存（エラー時）
```

### 6.3 エラーハンドリング
```javascript
エラータイプ:
- ネットワークタイムアウト
- フォーム未検出
- 入力バリデーションエラー
- レート制限超過

リトライポリシー:
- 即時リトライ: 1回
- 遅延リトライ: 指数バックオフ（最大3回）
- 失敗時: 手動リカバリーリスト作成
```

## 7. パフォーマンス設計

### 7.1 同時実行制御
- **最大同時Worker**: 5プロセス
- **1Workerあたり処理**: 1ジョブ/回
- **メモリ制限**: 512MB/Worker

### 7.2 レート制限
```javascript
送信間隔設定:
- 最小: 5秒
- 最大: 300秒
- デフォルト: 30秒

1日上限:
- デフォルト: 100件
- 最大: 1000件
```

### 7.3 データ処理最適化
- **バッチサイズ**: 1000件/処理
- **推定カウント**: PostgreSQL統計使用
- **インデックス**: company_id, campaign_id, created_at

## 8. セキュリティ仕様

### 8.1 APIキー管理
- **Supabaseキー**: 環境変数保存
- **ローテーション**: 30日ごと
- **権限**: 匿名キー（読み取り専用+書き込み制限）

### 8.2 データ保護
```javascript
機密情報:
- 企業データ: 暗号化保存
- 送信ログ: 90日自動削除
- アクセスログ: 全記録

IP制限:
- 送信元IP: ホワイトリスト
- 管理画面: IP制限
- APIエンドポイント: レート制限
```

## 9. 監視・ロギング

### 9.1 ログレベル
```javascript
ログ種類:
- ERROR: システムエラー、送信失敗
- WARN: リトライ、レート制限
- INFO: ジョブ開始/完了
- DEBUG: 詳細操作ログ
```

### 9.2 メトリクス収集
```javascript
監視項目:
- キュー長さ
- 処理成功率
- 平均応答時間
- メモリ使用率
- CPU使用率
```

### 9.3 アラート設定
```javascript
通知条件:
- エラーレート > 10%
- キュー滞留 > 100件
- サーバーダウン > 5分
- ディスク使用率 > 80%
```

## 10. 運用仕様

### 10.1 デプロイ
```bash
ビルドプロセス:
1. npm run build (Vite)
2. docker build -t form-sales-crm-app:latest
3. docker-compose up -d

自動デプロイ:
- GitHub連携
- Webhookトリガー
- ローリングアップデート
```

### 10.2 バックアップ
```javascript
バックアップ対象:
- Supabaseデータベース: 毎日
- ログファイル: 週次
- 設定ファイル: 即時同期
```

### 10.3 メンテナンス
```javascript
定期メンテナンス:
- ログローテーション: 週次
- データクリーンアップ: 月次
- パッケージ更新: 四半期ごと
- セキュリティパッチ: 即時
```

## 11. API仕様

### 11.1 内部API
```javascript
Worker間通信:
- ジョブキュー: Redis/Supabase
- ステータス更新: WebSocket
- ログ転送: Realtime
```

### 11.2 外部API
```javascript
Supabaseエンドポイント:
- REST API: CRUD操作
- Auth: 認証・認可
- Realtime: WebSocket通信
- Storage: ファイル保存
```

## 12. 拡張性設計

### 12.1 スケールアウト
```javascript
水平拡張:
- Workerコンテナ増設
- ロードバランサー追加
- データベース読み取りレプリカ

垂直拡張:
- CPUコア増強
- メモリ増設
- ストレージSSD化
```

### 12.2 モジュール化
```javascript
機能分離:
- キャンペーン管理モジュール
- 自動化エンジンモジュール
- レポート生成モジュール
- 通知モジュール
```

---

