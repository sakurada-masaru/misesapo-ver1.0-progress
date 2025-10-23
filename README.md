# MisesapoRenewal — デザインモックアップ開発ガイド

## 目的
本リポジトリは、デザインモックアップ（静的な HTML/CSS/JS）をローカルまたはコンテナで動かしながら作り進める最小環境です。将来的には別プロジェクトで Laravel / Rails などの MVC 実装へ移行しますが、その前段として「部分テンプレート対応の簡易テンプレート生成（ビルド）」を整えます。

## 現状のディレクトリ構成
```
public/            # 生成物（配信対象・Git 追跡しない）
  index.html
  login.html
  signup.html
  report.html
  mypage.html
  styles.css       # 共通スタイル
nginx/
  default.conf.template
Dockerfile         # Nginx で配信（Cloud Run など想定）
README.md, AGENTS.md
```

## 起動方法
ローカルの簡易サーバまたは Docker を利用できます。
- Python 簡易サーバ:
  - まずビルド: `python3 scripts/build.py`
  - 配信: `python3 -m http.server 5173 --directory public`
  - ブラウザで `http://localhost:5173` を開く
- Node のワンショット配信:
  - まずビルド: `python3 scripts/build.py`
  - 配信: `npx serve public`
- Docker（Nginx）:
  - ビルド: `docker build -t misesapo-mock .`
  - 実行: `docker run --rm -p 8080:8080 misesapo-mock`
  - ブラウザで `http://localhost:8080` を開く

## Cloud Run 手動デプロイ（--source .）
Cloud Run にソースから直接デプロイします。リポジトリ直下にある `Dockerfile` を Cloud Build が検出してビルドします（レジストリの事前準備は不要）。

### 前提条件
- gcloud CLI が導入済み（`gcloud --version`）。
- GCP プロジェクトが課金有効化済み。
- 初回は必要な API を有効化（実行時に自動で促される場合あり）。

```bash
# 変数（必要に応じて置き換え）
PROJECT_ID="your-project-id"
REGION="asia-northeast1"      # 例: 東京
SERVICE="misesapo-mock"       # Cloud Run サービス名

gcloud auth login
gcloud config set project "${PROJECT_ID}"
gcloud config set run/region "${REGION}"

# 初回のみ: 必要な API を有効化（自動有効化される場合はスキップ可）
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

### デプロイ（ソースから）
```bash
# このリポジトリのルートで実行
gcloud run deploy "${SERVICE}" \
  --source . \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated

# デプロイ URL を確認
gcloud run services describe "${SERVICE}" \
  --region "${REGION}" \
  --format='value(status.url)'
```

メモ:
- `Dockerfile` が存在するため、自動的に Docker ビルドが走ります。特別なビルド設定は不要です。
- 必要な API の有効化を求められたら指示に従ってください（手動でのレジストリ作成は不要）。
- 本コンテナは `PORT` 環境変数で起動ポートを受け取り Nginx を起動します。Cloud Run 側のポート指定は不要です。

## ビルド運用（重要）
- `public/` は自動生成物です。直接編集せず、`src/pages/`（必要なら `src/partials/`, `src/layouts/`）を編集してください。
- アセットは `src/assets/` に配置してください（例: `src/assets/styles.css`）。ビルド時に `public/` 配下へコピーされます。
- 生成: `python3 scripts/build.py`（`src/pages/**/*.html` を生成し、`src/assets/**` を `public/` にコピー）。
- Git: `public/` は `.gitignore` で除外しています。

## CI/CD（GitHub Actions 自動デプロイ）
`main` に push された最新コミットをトリガーに、静的ビルド（`scripts/build.py`）→ Cloud Run へのデプロイ（ソースから）まで自動化しています。

- ワークフロー: `.github/workflows/deploy-cloudrun.yml`
- トリガー: `push`（ブランチ `main`）
- 実行手順:
  - Python をセットアップし、`python3 scripts/build.py` を実行して `src/pages/**/*.html` を `public/` 配下に生成。
  - Workload Identity Federation（推奨）で GCP に認証。
  - `google-github-actions/deploy-cloudrun@v2` の `source: .` を用いて Cloud Run へデプロイ。

### 必要なリポジトリ変数 / シークレット
リポジトリの Settings > Secrets and variables > Actions で以下を設定してください。

- 変数（Variables）
  - `GCP_PROJECT_ID`: GCP プロジェクトID
  - `CLOUD_RUN_SERVICE`: Cloud Run サービス名（例: `misesapo-mock`）
  - `CLOUD_RUN_REGION`: リージョン（例: `asia-northeast1`）
  - `WIF_PROVIDER`: WIF プロバイダ（例: `projects/123.../locations/global/workloadIdentityPools/gh-pool/providers/gh-provider`）
  - `WIF_SERVICE_ACCOUNT`: 偽装するサービスアカウント（例: `cloud-run-deployer@<PROJECT_ID>.iam.gserviceaccount.com`）

- 代替（推奨しない）: サービスアカウント鍵での認証を行う場合は、
  - シークレット（Secrets）に `GCP_SA_KEY` を JSON で保存し、ワークフロー内のコメントアウト部分を有効化してください。

### 必要な API / 権限
- 有効化 API: `run.googleapis.com`, `cloudbuild.googleapis.com`
- サービスアカウント権限（WIF 経由で偽装されるSA）:
  - 必須: `roles/run.admin`, `roles/cloudbuild.builds.editor`
  - 実行SAを指定/利用する場合: その実行SAに対する `roles/iam.serviceAccountUser`

### 補足
- コンテナは `PORT` 環境変数に追従して Nginx を起動するため、Cloud Run 側のポート設定は不要です。
- このワークフローは並列実行抑止（`concurrency`）を設定し、`main` への連続 push があっても最後の1つだけが反映されやすい構成にしています。
- ブランチ名やサービス名を変更する場合は、`.github/workflows/deploy-cloudrun.yml` を編集してください。

## 作業ルール（抜粋）
- 新規ページは `public/` 直下に `*.html` として追加し、必要に応じてナビゲーションからリンク。
- スタイルは当面 `public/styles.css` に集約（分割が必要になったら検討）。
- 命名・コード規約、コミット/PR ルールは `AGENTS.md` を参照。

## 次のステップ（簡易テンプレート生成）
静的モックの制作効率と一貫性を高めるため、Python 製の最小テンプレート生成エンジンを導入します。部分テンプレート（ヘッダー/フッター等）を共通化し、ビルドで `public/` に HTML を生成します。

- 目的: 手作業のコピペを排除し、共通パーツとレイアウトを再利用可能にする。
- コア機能: 変数置換、`layout` 適用、`include` での部分テンプレート読み込み。
- 想定構成（導入後）:
  - `src/layouts/` レイアウト（例: `base.html`）
  - `src/partials/` 共通部品（例: `header.html`, `footer.html`）
  - `src/pages/` 各ページのソース（例: `index.html`, `login.html`）
  - `scripts/build.py` 簡易ビルダー（`src/pages` → `public/*.html` を生成）
- ビルド実行例（予定）:
  - `python3 scripts/build.py`（`src/pages/*.html` を走査→出力先は `public/`）
- 運用方針:
  - 導入後は `public/*.html` を直接編集しない。ソース（`src/`）を編集→ビルド→プレビュー。
  - CSS/画像など静的アセットはこれまで通り `public/` 配下に配置。

将来（テンプレート生成が安定後）に MVC 実装へ移行します。その際は、分割粒度・変数命名・スタイル変数（色/間隔/タイポ）を整理して移植性を高めます。
