"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { MANNERS } from "@/lib/manners";
import { BASIS_LABEL, INSTRUMENTS, type Area, type Basis, type Place } from "@/lib/types";

const PickMap = dynamic(() => import("./PickMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-green-cream" />,
});

const BASIS_HINT: Record<Basis, string> = {
  official: "看板や公式サイトに「演奏できる」と書いてある",
  confirmed: "公園の管理事務所などに聞いて、良いと言われた",
  no_sign: "禁止の看板はなかったが、確かめてはいない（「未確認」と表示されます）",
};

// 投稿・編集フォーム（S5）
export default function PlaceForm({ area, initial }: { area: Area; initial?: Place }) {
  const router = useRouter();
  const [pos, setPos] = useState<[number, number] | null>(initial ? [initial.lng, initial.lat] : null);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [basis, setBasis] = useState<Basis | null>(initial?.basis ?? null);
  const [instruments, setInstruments] = useState<string[]>(initial?.instruments ?? []);
  const [timeNote, setTimeNote] = useState(initial?.timeNote ?? "");
  const [soundNote, setSoundNote] = useState(initial?.soundNote ?? "");
  const [confirmed, setConfirmed] = useState(false); // 編集の時も、もう一度確かめてもらう
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missing = [!pos && "位置", !name.trim() && "名前", !basis && "演奏できる根拠", !confirmed && "確認のチェック"].filter(Boolean) as string[];

  function toggleInstrument(v: string) {
    setInstruments((list) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (missing.length > 0 || !pos || !basis) return;
    setBusy(true);
    setError(null);
    const fields = {
      name: name.trim(),
      description: description.trim(),
      lng: pos[0],
      lat: pos[1],
      basis,
      instruments,
      time_note: timeNote.trim(),
      sound_note: soundNote.trim(),
      confirmed: true,
    };
    const supabase = browserClient();
    const result = initial
      ? await supabase.from("places").update(fields).eq("id", initial.id).select("id").single()
      : await supabase.from("places").insert({ ...fields, area_slug: area.slug }).select("id").single();
    if (result.error || !result.data) {
      setBusy(false);
      const err = result.error;
      setError(
        err?.code === "P0001"
          ? err.message
          : err?.code === "42501"
            ? "ログインが切れています。ログインし直してください"
            : "保存できませんでした。入力を確かめて、もう一度試してください",
      );
      return;
    }
    // 「戻る」で入力済みのフォームに戻らないよう replace にする
    router.replace(`/${area.slug}?place=${result.data.id}&done=${initial ? "updated" : "posted"}`);
  }

  const input = "mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2";

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_minmax(360px,440px)] lg:items-start">
      <section className="lg:sticky lg:top-4">
        <h2 className="font-bold">1. 位置 <span className="text-sm font-normal">（地図を押すとピンが立ちます。ピンは動かせます）</span></h2>
        <div className="mt-2 h-[45dvh] overflow-hidden rounded-3xl lg:h-[70dvh]">
          <PickMap center={area.center} zoom={area.zoom} value={pos} onChange={setPos} />
        </div>
      </section>

      <div className="space-y-6 rounded-3xl bg-white p-5 sm:p-8">
        <label className="block">
          <span className="font-bold">2. 名前</span>（60文字まで）
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required placeholder="例：〇〇公園の広場" className={input} />
        </label>

        <fieldset>
          <legend className="font-bold">3. 演奏できる根拠</legend>
          <div className="mt-2 space-y-2">
            {(Object.keys(BASIS_LABEL) as Basis[]).map((b) => (
              <label key={b} className={`flex gap-3 rounded-2xl border-2 px-4 py-3 ${basis === b ? "border-green-dark bg-green-cream" : "border-sand"}`}>
                <input type="radio" name="basis" checked={basis === b} onChange={() => setBasis(b)} className="mt-1 size-4 shrink-0 accent-green-dark" />
                <span>
                  <span className="font-bold">{BASIS_LABEL[b]}</span>
                  <span className="block text-sm">{BASIS_HINT[b]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-bold">4. 向いている楽器</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {INSTRUMENTS.map((v) => (
              <label key={v} className={`cursor-pointer rounded-full border-2 px-4 py-1.5 text-sm ${instruments.includes(v) ? "border-green-dark bg-green-cream font-bold" : "border-sand"}`}>
                <input type="checkbox" checked={instruments.includes(v)} onChange={() => toggleInstrument(v)} className="sr-only" />
                {v}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="font-bold">5. おすすめの時間帯</span>（100文字まで）
          <input value={timeNote} onChange={(e) => setTimeNote(e.target.value)} maxLength={100} placeholder="例：平日の昼" className={input} />
        </label>
        <label className="block">
          <span className="font-bold">6. 音への注意</span>（200文字まで）
          <input value={soundNote} onChange={(e) => setSoundNote(e.target.value)} maxLength={200} placeholder="例：近くに住宅あり" className={input} />
        </label>
        <label className="block">
          <span className="font-bold">7. 説明</span>（任意・1000文字まで）
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={4} className={input} />
        </label>

        <section className="rounded-2xl bg-sand p-4">
          <h2 className="font-bold">⚠ 投稿の前に、もう一度確かめてください</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {MANNERS.slice(0, 3).map((m) => (
              <li key={m.title}>・{m.title}（{m.detail}）</li>
            ))}
            <li>・演奏が禁止されている場所は投稿しない</li>
          </ul>
          <label className="mt-4 flex items-start gap-3 rounded-xl bg-white p-3 font-bold">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 size-5 shrink-0 accent-green-dark" />
            演奏できる場所だと確認しました。マナーを守るよう、見る人に伝わる内容にしています。
          </label>
        </section>

        {error && <p className="rounded-xl border-2 border-sand-dark px-3 py-2 font-bold">{error}</p>}
        {missing.length > 0 && <p className="text-sm">まだ入っていないもの：{missing.join("・")}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={missing.length > 0 || busy} className="flex-1 rounded-full bg-green-dark py-4 text-lg font-bold text-white transition active:scale-[0.98] disabled:opacity-40">
            {busy ? "保存中…" : initial ? "保存する" : "投稿する"}
          </button>
          <Link href={initial ? `/${area.slug}?place=${initial.id}` : `/${area.slug}`} className="rounded-full bg-beige px-6 py-4 font-bold">
            やめる
          </Link>
        </div>
        <p className="text-xs text-ink/70">
          投稿すると、<Link href="/terms" className="underline">利用規約</Link>に同意したことになります。表示されるのは表示名だけで、メールアドレスは出ません。
        </p>
      </div>
    </form>
  );
}
