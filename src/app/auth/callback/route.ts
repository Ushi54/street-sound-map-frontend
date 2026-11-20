import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";

// Google から戻ってきた時に、ログインを完了させる
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  // ほかのサイトへ飛ばされないよう、このサイトの中の URL だけを許す
  if (!next.startsWith("/") || next.startsWith("//")) next = "/";

  if (code) {
    const supabase = await serverClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/auth/error`);
}
