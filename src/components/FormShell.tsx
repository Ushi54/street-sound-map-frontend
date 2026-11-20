import Link from "next/link";
import type { Area } from "@/lib/types";
import MannersBanner from "./MannersBanner";

// 投稿・編集の画面の外枠
export default function FormShell({ area, title, children }: { area: Area; title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="bg-white px-4 py-2.5">
        <Link href={`/${area.slug}`} className="font-bold">
          Street Sound Map <span className="font-normal text-ink/70">／ {area.name}</span>
        </Link>
      </header>
      <MannersBanner />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        <h1 className="mb-6 text-2xl font-bold">{title}</h1>
        {children}
      </main>
    </div>
  );
}
