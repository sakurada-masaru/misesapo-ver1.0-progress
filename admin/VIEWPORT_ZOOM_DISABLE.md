# スマホブラウザのピンチズーム無効化について

## 実装内容

スマホブラウザのピンチズーム（拡大縮小）機能を無効化しました。

### 理由
- ユーザーが操作中に、ページの機能（カードのドラッグなど）とスマホのピンチズーム機能を混同してしまう
- ページの操作性を優先するため

---

## 実装方法

### viewportメタタグの設定

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
```

### 各パラメータの説明

- **`width=device-width`**: デバイスの幅に合わせる
- **`initial-scale=1.0`**: 初期ズーム倍率を1.0（100%）に設定
- **`maximum-scale=1.0`**: 最大ズーム倍率を1.0（100%）に制限
- **`minimum-scale=1.0`**: 最小ズーム倍率を1.0（100%）に制限
- **`user-scalable=no`**: ユーザーによるズームを無効化

---

## 注意事項

### アクセシビリティへの配慮

⚠️ **ピンチズームを無効化すると、視力の弱いユーザーが画面を拡大できなくなります。**

可能であれば、以下の対応を推奨します：

1. **フォントサイズの調整機能**
   - ページ内でフォントサイズを調整できるボタンを提供

2. **設定画面での切り替え**
   - ユーザーがピンチズームを有効/無効を切り替えられる設定

3. **重要な要素のサイズ確保**
   - ボタンやリンクなど、重要な要素は十分なサイズを確保（最低44px×44px）

---

## 代替案

もし将来的にピンチズームを許可したい場合：

```html
<!-- 一部のズームを許可（例：1.0〜2.0倍） -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0">
```

または、JavaScriptで特定の操作時のみ無効化：

```javascript
// ダブルタップ時のズームを無効化
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); // ダブルタップ時のズームを防止
    }
    lastTouchEnd = now;
}, false);
```

---

## ブラウザ対応状況

- ✅ **iOS Safari**: 対応
- ✅ **Chrome（Android）**: 対応
- ✅ **Firefox（Android）**: 対応
- ✅ **Samsung Internet**: 対応

一部の古いブラウザでは、`user-scalable=no`だけでは無効化できない場合があります。その場合は、`maximum-scale=1.0, minimum-scale=1.0`も併用することで確実に無効化できます。

