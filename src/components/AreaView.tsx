"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { CurrentUser } from "@/lib/supabase/server";
import type { Area, Place } from "@/lib/types";
import AccountMenu from "./AccountMenu";
import MannersBanner from "./MannersBanner";
import PlaceDetail from "./PlaceDetail";
import SiteFooterLinks from "./SiteFooterLinks";
import Toast from "./Toast";

// 地図はブラウザでしか動かないので、サーバーでは描かない
const AreaMap = dynamic(() => import("./AreaMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-green-cream" />,
});

const DONE_MESSAGE: Record<string, string> = { posted: "投稿しました", updated: "保存しました" };

type Props = {
  area: Area;
  places: Place[];
  user: CurrentUser | null;
  initialPlaceId: string | null; // ?place=〜 で開いた時の場所
  done: string | null; // 投稿・編集から戻った時の知らせ
};

export default function AreaView({ area, places, user, initialPlaceId, done }: Props) {
  const [selectedId, setSelectedIdState] = useState<string | null>(initialPlaceId);
  const [sheetOpen, setSheetOpen] = useState(initialPlaceId !== null); // スマホの一覧（ボトムシート）
  const [toast, setToast] = useState<string | null>(done ? (DONE_MESSAGE[done] ?? null) : null);
  const clearToast = useCallback(() => setToast(null), []);
  const selected = places.find((p) => p.id === selectedId) ?? null;

  // 選んだ場所を URL（?place=〜）にも残す。共有・再読み込みしても同じ場所が開く
  const setSelectedId = useCallback(
    (id: string | null) => {
      setSelectedIdState(id);
      const url = id ? `/${area.slug}?place=${encodeURIComponent(id)}` : `/${area.slug}`;
      window.history.replaceState(null, "", url);
    },
    [area.slug],
  );
  // done=〜 は1回出したら URL から消す
  useEffect(() => {
    if (done) window.history.replaceState(null, "", initialPlaceId ? `/${area.slug}?place=${encodeURIComponent(initialPlaceId)}` : `/${area.slug}`);
  }, [done, initialPlaceId, area.slug]);

  function select(id: string) {
    setSelectedId(id);
    setSheetOpen(true);
  }
  function closeDetail() {
    setSelectedId(null);
    setSheetOpen(false);
  }

  const postButton = (
    <Link
      href={`/${area.slug}/new`}
      className="flex items-center justify-center gap-1 rounded-full bg-green-dark px-5 py-3 font-bold text-white shadow-[0_4px_16px_rgb(45_36_30/0.18)] transition active:scale-[0.98]"
    >
      ＋ 場所を投稿
    </Link>
  );

  const list = (
    <div>
      <div className="mb-4 hidden lg:block">{postButton}</div>
      <h2 className="text-lg font-bold">
        {area.name}の場所 <span className="text-base font-normal">{places.length}件</span>
      </h2>
      {places.length === 0 && (
        <p className="mt-3 rounded-2xl bg-white px-4 py-4 text-sm leading-relaxed">
          まだ場所がありません。練習して良かった場所があれば、「＋ 場所を投稿」から教えてください。
        </p>
      )}
      <ul className="mt-3 space-y-2">
        {places.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => select(p.id)}
              className="w-full rounded-2xl bg-white px-4 py-3 text-left transition hover:bg-green-cream active:scale-[0.98]"
            >
              <span className="block font-bold leading-snug">{p.name}</span>
              <span className="mt-0.5 block text-sm text-ink/70">
                {[p.timeNote, ...p.instruments].filter(Boolean).join("・")}
                {p.basis === "no_sign" && <span className="ml-1 font-bold text-ink">⚠ 未確認</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <SiteFooterLinks className="mt-8" />
    </div>
  );

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between gap-3 bg-white px-4 py-2.5">
        <Link href="/" className="font-bold">
          Street Sound Map <span className="font-normal text-ink/70">／ {area.name}</span>
        </Link>
        <AccountMenu user={user} />
      </header>
      <MannersBanner />

      <div className="relative flex min-h-0 flex-1">
        {/* PC・タブレット横：左に一覧 */}
        <aside className="hidden w-[340px] shrink-0 overflow-y-auto bg-cream p-5 lg:block">{list}</aside>

        <main className="relative min-w-0 flex-1">
          <AreaMap area={area} places={places} selectedId={selectedId} onSelect={select} />

          {/* スマホ・タブレット縦：投稿ボタンはシートの上に浮かせる */}
          {!sheetOpen && <div className="absolute right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-10 lg:hidden">{postButton}</div>}

          {/* PC・タブレット横：右に詳細（サイドパネル） */}
          {selected && (
            <div className="absolute inset-y-4 right-4 hidden w-[380px] overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(45_36_30/0.12)] lg:block">
              <PlaceDetail key={selected.id} place={selected} user={user} onClose={closeDetail} onToast={setToast} />
            </div>
          )}
        </main>

        {/* スマホ・タブレット縦：下から出る一覧／詳細（ボトムシート） */}
        <section
          className={`absolute inset-x-0 bottom-0 z-10 flex max-h-[72dvh] flex-col rounded-t-3xl bg-cream shadow-[0_-4px_24px_rgb(45_36_30/0.15)] transition-transform duration-300 lg:hidden ${
            sheetOpen ? "translate-y-0" : "translate-y-[calc(100%-4.5rem-env(safe-area-inset-bottom))]"
          }`}
          aria-label={selected ? "場所の詳細" : `${area.name}の場所の一覧`}
        >
          <button
            type="button"
            onClick={() => (selected ? setSelectedId(null) : setSheetOpen((v) => !v))}
            className="flex h-[4.5rem] shrink-0 flex-col items-center justify-center gap-1.5"
            aria-expanded={sheetOpen}
          >
            <span className="h-1.5 w-12 rounded-full bg-sand-dark/60" />
            <span className="text-sm font-bold">
              {selected ? "一覧にもどる" : sheetOpen ? "地図を見る" : `${area.name}の場所 ${places.length}件`}
            </span>
          </button>
          <div inert={!sheetOpen} className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {selected ? <PlaceDetail key={selected.id} place={selected} user={user} onClose={closeDetail} onToast={setToast} /> : list}
          </div>
        </section>
      </div>
      <Toast message={toast} onDone={clearToast} />
    </div>
  );
}
