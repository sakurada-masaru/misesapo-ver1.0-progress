# GitHub Pages設定

## ブランチ設定
- **Source**: `main` ブランチの `/docs` フォルダ
- **Custom domain**: なし（デフォルトのGitHub Pagesドメインを使用）

## ディレクトリ構造
```
docs/
├── admin/                    # 管理画面
│   ├── images/              # アイコン画像
│   ├── simple-progress.html # 進捗管理ページ
│   ├── task-market.html     # タスクマーケット
│   └── schedule-visualization.html # スケジュール可視化
├── images/                  # 共通画像
├── index.html              # トップページ
└── README.md               # プロジェクト説明
```

## アクセスURL
- **メインページ**: `https://your-username.github.io/MisesapoRenewal/admin/simple-progress.html`
- **タスクマーケット**: `https://your-username.github.io/MisesapoRenewal/admin/task-market.html`
- **スケジュール**: `https://your-username.github.io/MisesapoRenewal/admin/schedule-visualization.html`

## 注意事項
- Firebase設定は本番環境用に調整が必要
- 画像パスは相対パスで設定済み
- モバイル対応済み
