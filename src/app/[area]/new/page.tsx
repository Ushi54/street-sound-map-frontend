import { notFound } from "next/navigation";
import Link from "next/link";
import { findArea } from "@/lib/areas";
import { getCurrentUser } from "@/lib/supabase/server";
import FormShell from "@/components/FormShell";
import LoginButton from "@/components/LoginButton";
import PlaceForm from "@/components/PlaceForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "場所を投稿 | Street Sound Map" };

export default async function NewPlacePage({ params }: { params: Promise<{ area: string }> }) {
  const area = findArea((await params).area);
  if (!area) notFound();
  const user = await getCurrentUser();

  return (
    <FormShell area={area} title={`${area.name}の場所を投稿`}>
      {user ? (
        <PlaceForm area={area} />
      ) : (
        <div className="mx-auto max-w-lg space-y-4 rounded-3xl bg-white p-6 sm:p-8">
          <p className="font-bold">投稿するには、ログインが必要です。</p>
          <p className="text-sm leading-relaxed">
            自分の投稿を後から直したり消したりできるようにするためです。画面に出るのは表示名だけで、メールアドレスは出ません。
          </p>
          <LoginButton next={`/${area.slug}/new`} className="w-full rounded-full bg-green-dark py-3 font-bold text-white" />
          <p className="text-xs">
            ログインの前に<Link href="/terms" className="underline">利用規約</Link>と<Link href="/privacy" className="underline">プライバシーポリシー</Link>を読んでください。
          </p>
        </div>
      )}
    </FormShell>
  );
}
