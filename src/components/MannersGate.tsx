"use client";

import { useEffect, useRef, useState } from "react";
import { MANNERS, MANNERS_VERSION } from "@/lib/manners";

const KEY = "ssm-manners-agreed";

// 初回のマナー画面（S1）。「守ります」を押すまで閉じない。Esc でも閉じない
export default function MannersGate() {
  // null = まだ確かめていない（この間は画面全体をふさぎ、地図を触れないようにする）
  const [agreed, setAgreed] = useState<boolean | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const agreedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [readAll, setReadAll] = useState(false);

  // 下まで読んだか（スクロールしなくても全部見えている時は、最初から読んだ扱い）
  function checkRead() {
    const el = scrollRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setReadAll(true);
  }

  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(KEY) === MANNERS_VERSION;
    } catch {
      // 保存ができないブラウザでは、毎回出す
    }
    setAgreed(ok);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (agreed === false && d && !d.open) d.showModal();
    if (agreed === false) checkRead();
  }, [agreed]);

  // Esc などで閉じられても、「守ります」を押すまでは開き直す
  // （Chrome は2回目以降の Esc の preventDefault を無視することがあるため）
  function reopenIfNotAgreed() {
    const d = dialogRef.current;
    if (!agreedRef.current && d && !d.open) d.showModal();
  }
  function agree() {
    agreedRef.current = true;
    try {
      localStorage.setItem(KEY, MANNERS_VERSION);
    } catch {}
    dialogRef.current?.close();
    setAgreed(true);
  }

  if (agreed === true) return null;
  if (agreed === null) return <div className="fixed inset-0 z-50 bg-cream" aria-hidden />;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => e.preventDefault()}
      onClose={reopenIfNotAgreed}
      aria-labelledby="manners-title"
      className="m-auto w-[min(92vw,560px)] outline-none max-h-[90dvh] rounded-[2rem] bg-white p-0 text-ink"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <div ref={scrollRef} onScroll={checkRead} className="overflow-y-auto px-6 pt-8 pb-4 sm:px-10">
          <p className="text-sm font-bold text-green-dark">Street Sound Map</p>
          <h1 id="manners-title" className="mt-1 text-xl font-bold sm:text-2xl">
            演奏の前に、守ってほしいこと
          </h1>
          <p className="mt-3 text-sm leading-relaxed">
            音のトラブルや苦情が起きると、その場所で誰も練習できなくなります。次の6つを守れる人だけ使ってください。
          </p>
          <ol className="mt-6 space-y-3">
            {MANNERS.map((m, i) => (
              <li key={m.title} className="flex gap-3 rounded-2xl bg-beige px-4 py-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sand-dark text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold">{m.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed">{m.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-t border-sand px-6 py-5 sm:px-10">
          <button
            type="button"
            onClick={agree}
            disabled={!readAll}
            className="w-full rounded-full bg-green-dark py-4 text-lg font-bold text-white transition hover:brightness-95 active:scale-[0.98] disabled:opacity-40"
          >
            {readAll ? "守ります" : "下まで読むと押せます"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
