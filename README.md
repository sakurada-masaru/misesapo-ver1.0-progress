# ミセサポ プロジェクト進捗管理システム

## 概要
ミセサポ2025プロジェクトの進捗管理とタスク管理を行うWebアプリケーションです。

## 機能
- **進捗管理**: プロジェクトの進捗状況を視覚的に管理
- **タスクマーケット**: タスクの投稿・受領・管理
- **スケジュール可視化**: プロジェクトスケジュールの表示
- **モバイル対応**: スマートフォンでの操作に最適化

## アクセス方法

### GitHub Pages
- **メインページ**: [進捗管理](https://sakurada-masaru.github.io/misesapo-ver1.0-progress/admin/simple-progress-organized.html)
- **タスクマーケット**: [タスク管理](https://sakurada-masaru.github.io/misesapo-ver1.0-progress/admin/taskmarket.html)
- **スケジュール**: [スケジュール可視化](https://sakurada-masaru.github.io/misesapo-ver1.0-progress/admin/schedule-visualization.html)

### 外部リンク
- **Figmaデザイン**: [ミセサポ2025デザインファイル](https://www.figma.com/design/GWPufW1ofPkygNZN3r6vdr/%E3%83%9F%E3%82%BB%E3%82%B5%E3%83%9D2025?node-id=8133-18454&p=f&t=ai2JLv0Fye2amTFC-0)
- **マインドマップ**: [MindMeisterマインドマップ](https://www.mindmeister.com/app/map/3844614049)

## 技術仕様
- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **データベース**: Firebase Firestore
- **認証**: Google OAuth 2.0 (Google Identity Services)
- **ホスティング**: GitHub Pages
- **レスポンシブデザイン**: モバイルファースト

## ファイル構成
```
github-pages/
├── admin/                    # 管理画面
│   ├── images/              # アイコン画像
│   ├── simple-progress-organized.html # 進捗管理ページ
│   ├── taskmarket.html       # タスクマーケット
│   └── schedule-visualization.html # スケジュール可視化
├── images/                  # 共通画像
└── index.html              # トップページ
```

## 使用方法

### 進捗管理
1. プロジェクトの進捗状況を確認
2. 新しい項目を追加
3. ステータスを更新
4. フィルター機能で絞り込み

### タスクマーケット
1. 新しいタスクを投稿
2. 担当者にタスクを割り当て
3. ドラッグ&ドロップでタスクを移動
4. 完了したタスクを管理

## モバイル対応
- フローティングナビゲーション
- タッチ操作対応
- レスポンシブレイアウト

## 更新履歴
- 2025/10/28: モバイルフローティングナビゲーション追加
- 2025/10/28: タスクマーケット機能実装
- 2025/10/28: 開発プロセスセクション削除

## ライセンス
このプロジェクトはミセサポ2025プロジェクトの一部です。