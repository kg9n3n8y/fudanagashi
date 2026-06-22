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

`main` への push で GitHub Actions がビルドし、GitHub Pages にデプロイします。

GitHub Pages の設定（Settings → Pages）:
- Source: **GitHub Actions**（推奨）
- もしくは Source: **Deploy from a branch** → main / **/ (root)**（ビルド成果物がリポジトリ直下にある場合）

## オフライン（PWA）

初回起動時（オンライン時）に、アプリ本体・札画像（`torifuda/` 全201枚）・アイコンなどを Service Worker がローカルに保存します。保存完了後はオフラインでも練習できます。

- 一度オンラインで開いてからオフライン利用してください
- 更新がある場合は起動時のバナーから反映できます

## 技術スタック

React + Vite + TypeScript + Tailwind CSS で構築しています。
仕様は [doc/v2-spec.md](./doc/v2-spec.md) を参照してください。

v1 のソースは `legacy/` に保管しています。
