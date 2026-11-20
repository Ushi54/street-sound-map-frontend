import { notFound, redirect } from "next/navigation";
import { findArea } from "@/lib/areas";
import { getOwnPlace } from "@/lib/places";
import { getCurrentUser } from "@/lib/supabase/server";
import FormShell from "@/components/FormShell";
import PlaceForm from "@/components/PlaceForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "場所を編集 | Street Sound Map" };

export default async function EditPlacePage({ params }: { params: Promise<{ area: string; id: string }> }) {
  const { area: slug, id } = await params;
  const area = findArea(slug);
  if (!area) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/${area.slug}?place=${encodeURIComponent(id)}`);
  // 本人の投稿でなければ見つからない扱いにする（DB の決まりでも直せない）
  const place = await getOwnPlace(id, user.id);
  if (!place) notFound();

  return (
    <FormShell area={area} title="場所を編集">
      <PlaceForm area={area} initial={place} />
    </FormShell>
  );
}
