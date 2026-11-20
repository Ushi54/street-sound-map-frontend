import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findArea } from "@/lib/areas";
import { getPlaces } from "@/lib/places";
import { getCurrentUser } from "@/lib/supabase/server";
import AreaView from "@/components/AreaView";

// 投稿がすぐ地図に出るよう、開くたびに DB から読む
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const area = findArea((await params).area);
  return { title: area ? `${area.name}の練習場所 | Street Sound Map` : "Street Sound Map" };
}

// エリアの地図（S3）
type SearchParams = Promise<{ place?: string; done?: string }>;

export default async function AreaPage({ params, searchParams }: { params: Promise<{ area: string }>; searchParams: SearchParams }) {
  const area = findArea((await params).area);
  if (!area) notFound();
  const { place, done } = await searchParams;
  const [places, user] = await Promise.all([getPlaces(area.slug), getCurrentUser()]);
  return <AreaView area={area} places={places} user={user} initialPlaceId={place ?? null} done={done ?? null} />;
}
