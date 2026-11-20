import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

// ログインしていない人として読むための接続（公開用のキー）。
// 読める範囲は DB の決まり（RLS）で決まるので、このキーが見えても困らない
export function publicClient() {
  const { url, key } = supabaseEnv();
  return createClient(url, key, { auth: { persistSession: false } });
}
