# Street Sound Map

楽器の練習ができる場所を、地図でみんなと共有するサービスです。
騒音や苦情のトラブルを防ぐため、マナーとルールの表示を一番大事な機能にしています。

## 構成

```
ブラウザ（PC・タブレット・スマホ）
   ▼
Next.js 15（App Router）+ Tailwind CSS v4 + MapLibre（地図：OpenFreeMap）
   ▼
Supabase（Auth：Googleログイン ／ PostgreSQL + PostGIS ／ RLS）
```

- 画面から Supabase を公開用のキー（publishable）で直接読み書きします。守りは DB の RLS と列ごとの権限です。
- テーブルと決まりは `supabase/migrations/` の SQL です（Supabase の SQL Editor で実行）。

## 動かし方

```bash
npm install
# .env.local に次の2つを入れる
# NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
npm run dev
```

## 主な画面

| URL | 画面 |
|---|---|
| `/` | エリアを選ぶ |
| `/tokyo` | エリアの地図（`?place=<id>` で場所の詳細） |
| `/tokyo/new` | 場所を投稿（ログインが必要） |
| `/tokyo/place/<id>/edit` | 自分の投稿を編集 |
| `/manners`・`/terms`・`/privacy` | マナー・利用規約・プライバシーポリシー |
