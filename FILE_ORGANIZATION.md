# ファイル整理計画

## ✅ 使用中のファイル（保持）

### github-pages/ ディレクトリ（メイン）
- `github-pages/admin/` - 管理画面ファイル（実際にGitHub Pagesで使用）
  - `taskmarket.html` ✅
  - `simple-progress-organized.html` ✅
  - `simple-progress.html` ✅
  - `schedule-visualization.html` ✅
  - `images/` ✅
  - `project-data.csv` ✅
  - `sample-data.csv` ✅
- `github-pages/images/` - 共通画像 ✅
- `github-pages/index.html` ✅
- `github-pages/README.md` ✅
- `github-pages/GITHUB_PAGES_SETUP.md` ✅

### ルートのドキュメント
- `README.md` ✅
- `.gitignore` ✅
- `GITHUB_PAGES_SETUP.md` ✅

## ❌ 重複ファイル（削除候補）

### admin/ ディレクトリ（ルート）
- `admin/taskmarket.html` - `github-pages/admin/taskmarket.html` と重複
- `admin/simple-progress-organized.html` - 重複
- `admin/simple-progress.html` - 重複
- `admin/schedule-visualization.html` - 重複
- `admin/images/` - 重複
- `admin/project-data.csv` - 重複
- `admin/sample-data.csv` - 重複

### docs/ ディレクトリ
- `docs/admin/` - すべて `github-pages/admin/` と重複
- `docs/images/` - `github-pages/images/` と重複
- `docs/index.html` - `github-pages/index.html` と重複
- `docs/README.md` - 重複
- `docs/GITHUB_PAGES_SETUP.md` - 重複
- `docs/*.csv` - 重複

### ルートの重複ファイル
- `index.html` - `github-pages/index.html` と重複の可能性（確認必要）
- `images/` - `github-pages/images/` と重複の可能性（確認必要）

## 🗑️ 不要ファイル（削除候補）

### 一時ファイル
- `progress.html` - 使用されていない
- `progress.db` - データベースファイル（.gitignoreで除外済み）
- `misesapo-github-pages.zip` - 圧縮ファイル（.gitignoreで除外済み）
- `project-data-updated (4).csv` - 一時ファイル（.gitignoreで除外済み）
- `project-data.csv`（ルート）- 重複
- `sample-data.csv`（ルート）- 重複

### 秘密鍵ファイル（.gitignoreで除外済み）
- `client_secret_*.json` - 削除推奨

## 📝 推奨アクション

1. **削除**: `admin/` ディレクトリ全体
2. **削除**: `docs/` ディレクトリ全体（古い設定）
3. **削除**: ルートの `index.html`（`github-pages/index.html`を使用）
4. **削除**: ルートの `images/`（`github-pages/images/`を使用）
5. **削除**: `progress.html`
6. **削除**: ルートの一時ファイル（CSV、DB、ZIP）

## 🔍 確認が必要なファイル

- `index.html`（ルート）- GitHub Pagesの設定によって使用される可能性あり
- `images/`（ルート）- GitHub Pagesの設定によって使用される可能性あり

