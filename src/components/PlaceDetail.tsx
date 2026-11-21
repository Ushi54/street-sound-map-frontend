"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CurrentUser } from "@/lib/supabase/server";
import { browserClient } from "@/lib/supabase/browser";
import type { Place } from "@/lib/types";
import { BASIS_LABEL } from "@/lib/types";
import LoginButton from "./LoginButton";
import ReportForm from "./ReportForm";

type Props = {
  place: Place;
  user: CurrentUser | null;
  onClose: () => void;
  onToast: (msg: string) => void;
};

// 場所の詳細（S4）。一番上に「この場所の条件」
export default function PlaceDetail({ place, user, onClose, onToast }: Props) {
  const router = useRouter();
  const unverified = place.basis === "no_sign";
  const isMine = user?.id === place.authorId;
  const [mode, setMode] = useState<"view" | "report" | "delete">("view");
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    const { error, count } = await browserClient().from("places").delete({ count: "exact" }).eq("id", place.id);
    setBusy(false);
    if (error) {
      onToast(error.code === "42501" ? "ログインが切れています。ログインし直してください" : "削除できませんでした");
      return;
    }
    if (count === 0) {
      onToast("通報で非表示になったため、削除できません");
      onClose();
      router.refresh();
      return;
    }
    onToast("削除しました");
    onClose();
    router.refresh();
  }

  return (
    <article className="min-w-0 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 text-xl font-bold leading-snug [overflow-wrap:anywhere]">{place.name}</h2>
        <button type="button" onClick={onClose} aria-label="閉じる" className="grid size-10 shrink-0 place-items-center rounded-full bg-beige text-lg">
          ✕
        </button>
      </div>

      {unverified && (
        <p className="rounded-2xl border-[3px] border-sand-dark bg-white px-4 py-3 font-bold">
          ⚠ 演奏できるかは未確認です
          <span className="mt-1 block text-sm font-normal leading-relaxed">
            投稿した人は「禁止の表示はなかった」だけを確かめています。演奏する前に、管理者や現地の案内を確かめてください。
          </span>
        </p>
      )}

      <section className="rounded-2xl bg-sand px-4 py-4" aria-label="この場所の条件">
        <h3 className="font-bold">この場所の条件</h3>
        <dl className="mt-2 grid grid-cols-[6.5em_minmax(0,1fr)] gap-x-2 [overflow-wrap:anywhere] gap-y-1.5 text-sm">
          <dt className="font-bold">根拠</dt>
          <dd>{BASIS_LABEL[place.basis]}</dd>
          <dt className="font-bold">時間帯</dt>
          <dd>{place.timeNote || "—"}</dd>
          <dt className="font-bold">楽器</dt>
          <dd>{place.instruments.join("・") || "—"}</dd>
          <dt className="font-bold">音への注意</dt>
          <dd>{place.soundNote || "—"}</dd>
        </dl>
        <p className="mt-3 border-t border-sand-dark/40 pt-2 text-sm">8時〜20時だけ。注意されたら、すぐにやめてください。</p>
      </section>

      {place.description && <p className="whitespace-pre-wrap leading-relaxed [overflow-wrap:anywhere]">{linkify(place.description)}</p>}
      <p className="text-sm text-ink/70">
        投稿：{place.authorName}・{place.createdAt}
      </p>

      {isMine && mode !== "delete" && (
        <div className="flex gap-2">
          <Link href={`/${place.areaSlug}/place/${place.id}/edit`} className="rounded-full bg-green-dark px-5 py-2 font-bold text-white">
            編集
          </Link>
          <button type="button" onClick={() => setMode("delete")} className="rounded-full bg-beige px-5 py-2 font-bold">
            削除
          </button>
        </div>
      )}
      {isMine && mode === "delete" && (
        <div className="space-y-3 rounded-2xl border-2 border-sand-dark p-4">
          <p className="font-bold">この場所を削除しますか？ 元に戻せません。</p>
          <div className="flex gap-2">
            <button type="button" onClick={remove} disabled={busy} className="rounded-full bg-ink px-5 py-2 font-bold text-white disabled:opacity-50">
              {busy ? "削除中…" : "削除する"}
            </button>
            <button type="button" onClick={() => setMode("view")} className="rounded-full bg-beige px-5 py-2 font-bold">やめる</button>
          </div>
        </div>
      )}

      {!isMine && mode !== "report" && (
        <button type="button" onClick={() => setMode("report")} className="text-sm underline">
          通報する
        </button>
      )}
      {!isMine && mode === "report" &&
        (user ? (
          <ReportForm
            placeId={place.id}
            onCancel={() => setMode("view")}
            onDone={(msg) => {
              setMode("view");
              onToast(msg);
            }}
          />
        ) : (
          <div className="space-y-2 rounded-2xl border-2 border-sand p-4 text-sm">
            <p>通報するにはログインが必要です（いたずらを防ぐため）。</p>
            <LoginButton />
          </div>
        ))}
    </article>
  );
}

// 説明の中の URL（http/https だけ）をリンクにする。出典などを押して開けるように
const URL_RE = /(https?:\/\/[^\s<>"'（）「」、。]+)/g;
function linkify(text: string) {
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer nofollow ugc" className="text-green-dark underline">
        {part}
      </a>
    ) : (
      part
    ),
  );
}
