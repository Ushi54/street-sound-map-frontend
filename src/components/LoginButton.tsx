"use client";

import { useState } from "react";
import { browserClient } from "@/lib/supabase/browser";

// Google でログインする。終わったら next（なければ今のページ）に戻る
export default function LoginButton({ next, className = "", label = "Googleでログイン" }: { next?: string; className?: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  async function login() {
    setBusy(true);
    const back = next ?? location.pathname + location.search;
    const { error } = await browserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(back)}` },
    });
    if (error) setBusy(false);
  }
  return (
    <button type="button" onClick={login} disabled={busy} className={className || "rounded-full bg-green-dark px-4 py-2 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-60"}>
      {busy ? "移動中…" : label}
    </button>
  );
}
