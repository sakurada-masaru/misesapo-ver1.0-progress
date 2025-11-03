# プロジェクト構造

## 📁 ディレクトリ構成

```
MisesapoRenewal-main/
├── admin/                          # メインの管理機能
│   ├── images/                     # 画像・アイコン素材
│   │   ├── archive.svg             # アーカイブアイコン
│   │   ├── mypage.svg              # マイページアイコン
│   │   ├── resource.svg             # リソース管理アイコン
│   │   ├── setup.svg               # 設定アイコン
│   │   ├── menu.svg                # メニューボタンアイコン
│   │   ├── menu icon.svg           # メニューアイコン（別バージョン）
│   │   ├── menicon.svg             # メニューアイコン（別バージョン）
│   │   ├── logo_144x144.png       # ロゴ
│   │   ├── デザイン.svg            # デザインカテゴリアイコン
│   │   ├── フロント.svg            # フロントエンドカテゴリアイコン
│   │   ├── バック.svg              # バックエンドカテゴリアイコン
│   │   ├── メディア ・SNS.svg      # メディアカテゴリアイコン
│   │   ├── アートボード 3-9.svg    # 付箋背景画像
│   │   └── （その他多数のアイコン）
│   │
│   ├── taskmarket.html             # メインタスク管理ページ
│   ├── simple-progress-organized.html  # 進捗管理ページ
│   ├── project-data.csv            # プロジェクトデータ
│   ├── sample-data.csv             # サンプルデータ
│   ├── 実装機能一覧.txt            # 実装機能の一覧
│   ├── PULL_REFRESH_AND_ZOOM_INFO.md  # プルリフレッシュ・ズーム情報
│   ├── VIEWPORT_UNIT_EXPLANATION.md    # ビューポート単位の説明
│   └── VIEWPORT_ZOOM_DISABLE.md       # ビューポートズーム無効化
│
├── index.html                      # トップページ
├── README.md                       # プロジェクト説明
├── GITHUB_PAGES_SETUP.md          # GitHub Pages設定手順
├── client_secret_*.json            # Google OAuth設定（本番では使用しない）
└── venv/                           # Python仮想環境（Git管理外）

```

## 🎯 主要ファイル

### **メインページ**
- `admin/taskmarket.html` - タスク管理ボード（メイン機能）
- `admin/simple-progress-organized.html` - 進捗管理ページ
- `index.html` - トップページ（リンク集）

### **アイコン・画像**
- `admin/images/mypage.svg` - マイページメニューアイコン
- `admin/images/resource.svg` - リソース管理メニューアイコン
- `admin/images/archive.svg` - アーカイブメニューアイコン
- `admin/images/setup.svg` - 設定メニューアイコン
- `admin/images/menu.svg` - メニューボタンアイコン

## 🔧 技術スタック

- **HTML5/CSS3/JavaScript** - フロントエンド
- **Firebase Firestore** - データベース・リアルタイム同期
- **Google Identity Services** - OAuth認証
- **GitHub Pages** - ホスティング

## 📝 主要機能（taskmarket.html）

1. **タスク管理**
   - タスクカードの作成・編集・削除
   - ドラッグ&ドロップで自由配置
   - カテゴリ別の付箋背景画像

2. **バッジシステム**
   - 担当者バッジの作成・管理
   - Googleアカウント連携バッジ
   - タスクカードへのバッジ添付

3. **タイムレコード**
   - タスク作業時間の記録
   - バッジ添付から完了までの時間計測

4. **リソース管理パネル**
   - チームメンバー管理
   - 週次・月次スケジュール
   - タイムライン表示

5. **アーカイブパネル**
   - 完了タスクの保存・閲覧
   - フィルター機能（日付・担当者・カテゴリ・検索）

6. **円形メニュー**
   - 4つのメニュー項目（マイページ・リソース管理・アーカイブ・設定）
   - アイコン表示
   - 時差アニメーション

7. **モバイル対応**
   - レスポンシブデザイン（430px以下）
   - タッチドラッグ&ドロップ
   - プルリフレッシュ機能

