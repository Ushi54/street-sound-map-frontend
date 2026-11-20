"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

// ブラウザで、ログインした本人として読み書きする接続
export function browserClient() {
  const { url, key } = supabaseEnv();
  return createBrowserClient(url, key);
}
