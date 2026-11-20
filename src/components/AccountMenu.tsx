"use client";

import { useRouter } from "next/navigation";
import type { CurrentUser } from "@/lib/supabase/server";
import { browserClient } from "@/lib/supabase/browser";
import LoginButton from "./LoginButton";

export default function AccountMenu({ user }: { user: CurrentUser | null }) {
  const router = useRouter();
  if (!user) return <LoginButton label="ログイン" />;
  async function logout() {
    await browserClient().auth.signOut();
    router.refresh();
  }
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden max-w-[12em] truncate sm:inline">{user.displayName}</span>
      <button type="button" onClick={logout} className="rounded-full bg-beige px-4 py-2 font-bold">
        ログアウト
      </button>
    </div>
  );
}
