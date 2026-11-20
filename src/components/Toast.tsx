"use client";

import { useEffect } from "react";

// 終わったことを知らせる小さな通知（トースト）。3秒で消える
export default function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 top-28 z-40 flex justify-center px-4">
      <p className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-lg">{message}</p>
    </div>
  );
}
