import Link from "next/link";
import { AREAS } from "@/lib/areas";
import { MANNERS } from "@/lib/manners";
import { BASIS_LABEL } from "@/lib/types";
import SiteFooterLinks from "@/components/SiteFooterLinks";
import MannersBanner from "@/components/MannersBanner";
import HeroMap from "@/components/HeroMap";

// トップ（S2）＝紹介ページ（LP）。どんなアプリか → マナー → 使い方 → 根拠 → 質問 → エリアを選ぶ
const FEATURES = [
  {
    icon: "🔍",
    title: "探す",
    text: "地図のピンを押すと、その場所で練習できる時間帯・楽器・音の注意が分かります。ログインは要りません。",
  },
  {
    icon: "📍",
    title: "教える",
    text: "練習して良かった場所を、根拠と条件をつけて投稿できます。Google アカウントでログインします。",
  },
  {
    icon: "🤝",
    title: "守る",
    text: "禁止の場所・苦情が出た場所は「通報」から知らせてください。3件集まると自動で地図から隠れます。",
  },
];

const STEPS = [
  { title: "マナーを読む", text: "最初にマナーの画面が出ます。下まで読んで「守ります」を押してください。" },
  { title: "地図で探す", text: "エリアの地図から、近くの場所や条件の合う場所を選びます。" },
  { title: "現地で確かめて練習", text: "看板や管理者の案内を、最後は自分の目で確かめてから音を出します。" },
];

const BASIS_NOTE: Record<keyof typeof BASIS_LABEL, string> = {
  official: "公園・施設などが、公式に楽器の練習を認めている",
  confirmed: "投稿した人が、管理事務所などに確認した",
  no_sign: "禁止の看板はなかったが、確認はしていない。地図では「⚠ 未確認」と出ます",
};

const FAQ = [
  { q: "お金はかかりますか？", a: "無料です。広告もありません。" },
  {
    q: "Google の名前やメールアドレスは表示されますか？",
    a: "表示されません。投稿者の名前は「演奏者〇〇〇〇〇〇」のような名前で出ます。",
  },
  {
    q: "載っている場所なら、必ず演奏できますか？",
    a: "いいえ。投稿した人の体験と確認にもとづく情報です。ルールが変わることもあるので、現地で必ず確かめてください。",
  },
  { q: "東京以外も使えますか？", a: "今は東京だけです。ほかのエリアは準備中です。" },
];

export default function Home() {
  const tokyo = AREAS[0];
  return (
    <div className="min-h-dvh">
      <MannersBanner />

      {/* ── ヒーロー ── */}
      <header className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-20">
        <div>
          <p className="font-bold text-green-dark">Street Sound Map（SSM）</p>
          <h1 className="mt-3 text-[1.75rem] font-bold leading-snug sm:text-5xl sm:leading-tight">
            迷惑をかけずに
            <br />
            練習できる場所を、
            <br />
            みんなで地図に。
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed sm:text-lg">
            家では音を出せない。スタジオは毎回は借りられない。
            <br className="hidden sm:block" />
            そんな人のために、屋外で楽器を練習できる場所を、条件とマナーつきで共有する地図です。
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/${tokyo.slug}`}
              className="rounded-full bg-green-dark px-7 py-4 text-lg font-bold text-white shadow-[0_4px_16px_rgb(45_36_30/0.18)] transition active:scale-[0.98]"
            >
              {tokyo.name}の地図を開く →
            </Link>
            <span className="text-sm text-ink/70">無料・見るだけならログイン不要</span>
          </div>
        </div>
        <HeroMap />
      </header>

      <main>
        {/* ── できること ── */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">SSM でできること</h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {FEATURES.map((f) => (
                <li key={f.title} className="rounded-3xl bg-cream p-6 sm:p-7">
                  <span aria-hidden className="text-3xl">{f.icon}</span>
                  <h3 className="mt-3 text-xl font-bold">{f.title}</h3>
                  <p className="mt-2 leading-relaxed">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── マナー（いちばん目立たせる） ── */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="rounded-[2rem] border-4 border-sand-dark bg-beige p-6 sm:p-10">
              <h2 className="text-2xl font-bold sm:text-3xl">⚠ 使う前に、必ず守ってください</h2>
              <p className="mt-3 leading-relaxed">
                音のトラブルや苦情が起きると、その場所で誰も練習できなくなります。SSM は、このマナーを守る人のための地図です。
              </p>
              <ol className="mt-6 grid gap-3 md:grid-cols-2">
                {MANNERS.map((m, i) => (
                  <li key={m.title} className="flex gap-3 rounded-2xl bg-white p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-dark font-bold text-white">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-bold">{m.title}</span>
                      <span className="mt-0.5 block text-sm text-ink/80">{m.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── 使い方 ── */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">使い方</h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="rounded-3xl border-2 border-green p-6">
                  <span className="text-sm font-bold text-green-dark">STEP {i + 1}</span>
                  <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 根拠の見方 ── */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">「なぜ演奏できるのか」も載せています</h2>
            <p className="mt-3 max-w-3xl leading-relaxed">
              どの場所にも、演奏できると判断した根拠がついています。根拠の強さを見て、行くかどうかを決めてください。
            </p>
            <dl className="mt-8 grid gap-4 md:grid-cols-3">
              {(Object.keys(BASIS_LABEL) as (keyof typeof BASIS_LABEL)[]).map((k) => (
                <div
                  key={k}
                  className={`rounded-3xl bg-white p-6 ${k === "no_sign" ? "border-4 border-sand-dark" : ""}`}
                >
                  <dt className="font-bold">
                    {k === "no_sign" && <span aria-hidden>⚠ </span>}
                    {BASIS_LABEL[k]}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed">{BASIS_NOTE[k]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── よくある質問 ── */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">よくある質問</h2>
            <dl className="mt-8 space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-3xl bg-cream p-6">
                  <dt className="font-bold">Q. {f.q}</dt>
                  <dd className="mt-2 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── エリアを選ぶ ── */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">エリアを選ぶ</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/${a.slug}`}
                    className="block rounded-3xl bg-green-dark p-6 text-white transition active:scale-[0.98]"
                  >
                    <span className="text-2xl font-bold">{a.name}</span>
                    <span className="mt-1 block text-sm">地図を開く →</span>
                  </Link>
                </li>
              ))}
              <li className="rounded-3xl border-2 border-dashed border-sand-dark p-6 text-ink/70">
                ほかのエリアは準備中です
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
          <p className="font-bold">Street Sound Map（SSM）</p>
          <p className="mt-1 text-sm text-ink/70">意見・不具合の報告は「お問い合わせ」からどうぞ。</p>
          <SiteFooterLinks className="mt-5" />
        </div>
      </footer>
    </div>
  );
}
