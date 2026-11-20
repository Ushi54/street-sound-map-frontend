"use client";

import { useState } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { REPORT_REASONS, type ReportReason } from "@/lib/types";

// 通報（S6）。ログインした人だけ。同じ場所には1人1回
export default function ReportForm({ placeId, onDone, onCancel }: { placeId: string; onDone: (msg: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    setBusy(true);
    setError(null);
    // 通報は読めない決まりなので、insert の後に select を付けない
    const { error } = await browserClient().from("reports").insert({ place_id: placeId, reason, note: note.trim() });
    setBusy(false);
    if (!error) return onDone("通報しました。ありがとうございます");
    if (error.code === "23505") return onDone("この場所はもう通報しています");
    setError(
      error.code === "P0001"
        ? error.message // DB で決めた日本語の文（1日の上限）
        : error.code === "42501"
          ? "ログインが切れています。ログインし直してください"
          : error.code === "23503"
            ? "この場所はもうありません"
            : "通報できませんでした。時間をおいてもう一度試してください",
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border-2 border-sand p-4">
      <p className="font-bold">通報の理由</p>
      <div className="space-y-2">
        {(Object.keys(REPORT_REASONS) as ReportReason[]).map((r) => (
          <label key={r} className="flex items-center gap-2">
            <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="size-4 accent-green-dark" />
            {REPORT_REASONS[r]}
          </label>
        ))}
      </div>
      <label className="block text-sm">
        くわしく（任意・500文字まで）
        <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={3} className="mt-1 w-full rounded-xl border border-sand bg-white p-2" />
      </label>
      {error && <p className="text-sm font-bold">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={!reason || busy} className="rounded-full bg-green-dark px-5 py-2 font-bold text-white disabled:opacity-50">
          {busy ? "送信中…" : "通報する"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full bg-beige px-5 py-2 font-bold">やめる</button>
      </div>
    </form>
  );
}
