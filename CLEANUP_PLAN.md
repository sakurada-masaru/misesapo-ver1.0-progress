# ファイル整理計画

## ✅ メインファイル（保持）: `github-pages/`

### 📁 github-pages/ ディレクトリ構造
```
github-pages/
├── index.html                    ✅ エントリーポイント
├── README.md                     ✅ ドキュメント
├── GITHUB_PAGES_SETUP.md        ✅ 設定ドキュメント
├── admin/
│   ├── taskmarket.html          ✅ メイン機能（最重要）
│   ├── simple-progress-organized.html  ✅ 進捗管理
│   ├── simple-progress.html     ✅ 進捗管理（簡易版）
│   ├── schedule-visualization.html ✅ スケジュール可視化
│   ├── images/                  ✅ アイコン・画像
│   ├── project-data.csv         ✅ データ
│   └── sample-data.csv          ✅ サンプルデータ
└── images/                      ✅ 共通画像
```

## ❌ 削除すべき重複ファイル

### 1. admin/（ルート） - 完全に重複
- `admin/taskmarket.html` → `github-pages/admin/taskmarket.html`と重複
- `admin/simple-progress-organized.html` → 重複
- `admin/simple-progress.html` → 重複
- `admin/schedule-visualization.html` → 重複
- `admin/images/` → 重複
- `admin/*.csv` → 重複

### 2. docs/ ディレクトリ - 古い設定・完全に重複
- `docs/admin/` → すべて重複
- `docs/images/` → 重複
- `docs/index.html` → 重複
- `docs/*.csv` → 重複
- `docs/*.md` → 重複（GITHUB_PAGES_SETUP.mdが古い設定）

### 3. ルートの重複ファイル
- `index.html`（ルート） → `github-pages/index.html`と重複
- `images/`（ルート） → `github-pages/images/`と重複
- `progress.html` → 使用されていない
- `project-data.csv`（ルート） → 重複
- `sample-data.csv`（ルート） → 重複

## 🗑️ 削除すべき一時ファイル

- `progress.db` - データベースファイル
- `misesapo-github-pages.zip` - 圧縮ファイル
- `project-data-updated (4).csv` - 一時ファイル
- `client_secret_*.json` - 秘密鍵（.gitignoreで除外済み）

## 📝 実行する整理アクション

1. **削除**: `admin/` ディレクトリ全体（ルート）
2. **削除**: `docs/` ディレクトリ全体
3. **削除**: ルートの `index.html`、`images/`、`progress.html`
4. **削除**: ルートの一時ファイル（CSV、DB、ZIP）
5. **保持**: `github-pages/` ディレクトリ全体（これがメイン）

## 🎯 最終的な構成

```
MisesapoRenewal-main/
├── github-pages/          ✅ メインファイル（すべてここに）
├── README.md             ✅ プロジェクト説明
├── .gitignore            ✅ Git除外設定
└── GITHUB_PAGES_SETUP.md ✅ 設定ドキュメント（ルート）
```

