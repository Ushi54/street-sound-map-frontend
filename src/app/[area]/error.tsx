"use client";

import Link from "next/link";
import MannersBanner from "@/components/MannersBanner";

// DB が止まっている時など、場所を読めなかった時の画面
export default function AreaError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-dvh">
      <MannersBanner />
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold">今は場所を読めません</h1>
        <p className="mt-3 leading-relaxed">少し時間をおいて、開き直してください。</p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-green-dark px-6 py-3 font-bold text-white active:scale-[0.98]">
            もう一度読む
          </button>
          <Link href="/" className="rounded-full bg-white px-6 py-3 font-bold">トップへ</Link>
        </div>
      </main>
    </div>
  );
}
