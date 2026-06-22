# fudanagashi

札流しをする Web アプリ

https://kg9n3n8y.github.io/fudanagashi/

## 開発

```bash
npm install
npm run dev
```

## ビルド・デプロイ

```bash
npm run build
```

`main` への push で GitHub Actions がビルドし、GitHub Pages に自動デプロイします。
初回はリポジトリの Settings → Pages → Build and deployment で **GitHub Actions** を選んでください。

## オフライン（PWA）

初回起動時（オンライン時）に、アプリ本体・札画像（`torifuda/` 全201枚）・アイコンなどを Service Worker がローカルに保存します。保存完了後はオフラインでも練習できます。

- 一度オンラインで開いてからオフライン利用してください
- 更新がある場合は起動時のバナーから反映できます

## 技術スタック

React + Vite + TypeScript + Tailwind CSS で構築しています。
仕様は [docs/v2-spec.md](./docs/v2-spec.md) を参照してください。

v1 のソースは `legacy/` に保管しています。
