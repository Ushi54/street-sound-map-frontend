import Link from "next/link";
import { AREAS } from "@/lib/areas";
import { MANNERS } from "@/lib/manners";
import SiteFooterLinks from "@/components/SiteFooterLinks";
import MannersBanner from "@/components/MannersBanner";

// トップ（S2）：エリアを選ぶ
export default function Home() {
  return (
    <div className="min-h-dvh">
      <MannersBanner />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
        <p className="font-bold text-green-dark">Street Sound Map</p>
        <h1 className="mt-2 text-2xl font-bold leading-snug sm:text-4xl">
          迷惑をかけずに練習できる場所を、
          <br className="hidden sm:block" />
          みんなで地図に。
        </h1>

        <section className="mt-10">
          <h2 className="text-xl font-bold">エリアを選ぶ</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/${a.slug}`}
                  className="block rounded-3xl bg-white p-6 transition hover:bg-green-cream active:scale-[0.98]"
                >
                  <span className="text-2xl font-bold">{a.name}</span>
                  <span className="mt-1 block text-sm text-ink/70">地図を開く →</span>
                </Link>
              </li>
            ))}
            <li className="rounded-3xl border-2 border-dashed border-sand p-6 text-ink/70">
              ほかのエリアは準備中です
            </li>
          </ul>
        </section>

        <section className="mt-12 rounded-3xl bg-beige p-6 sm:p-8">
          <h2 className="text-xl font-bold">⚠ 使う前に、必ず守ってください</h2>
          <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {MANNERS.map((m, i) => (
              <li key={m.title} className="font-bold">
                {i + 1}. {m.title}
              </li>
            ))}
          </ol>
        </section>

        <SiteFooterLinks className="mt-12" />
      </main>
    </div>
  );
}
