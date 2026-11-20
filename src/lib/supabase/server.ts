import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

// サーバーで、ログインした本人として読む接続（ログインの情報は Cookie にある）
export async function serverClient() {
  const { url, key } = supabaseEnv();
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // ページの描画中は Cookie を書けない。middleware が更新するので問題ない
        }
      },
    },
  });
}

export type CurrentUser = { id: string; displayName: string };

// 今ログインしている人（いなければ null）。メールアドレスは返さない
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await serverClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", data.user.id)
    .maybeSingle();
  return { id: data.user.id, displayName: profile?.display_name ?? "演奏者" };
}
