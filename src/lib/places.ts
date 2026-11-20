import { publicClient } from "./supabase/public";
import { serverClient } from "./supabase/server";
import type { Basis, Place } from "./types";

type Row = {
  id: string;
  area_slug: string;
  name: string;
  description: string;
  lng: number;
  lat: number;
  basis: Basis;
  instruments: string[];
  time_note: string;
  sound_note: string;
  created_at: string;
  author_id: string;
  profiles: { display_name: string } | null;
};

const COLUMNS =
  "id, area_slug, name, description, lng, lat, basis, instruments, time_note, sound_note, created_at, author_id, profiles(display_name)";

// エリアの公開中の場所を読む（非表示の場所は RLS で返ってこない）
export async function getPlaces(areaSlug: string): Promise<Place[]> {
  const { data, error } = await publicClient()
    .from("places")
    .select(COLUMNS)
    .eq("area_slug", areaSlug)
    .eq("status", "public")
    .order("created_at", { ascending: false })
    .returns<Row[]>();
  if (error) throw new Error(`場所を読めませんでした：${error.message}`);
  return data.map(toPlace);
}

// 編集用：本人の公開中の場所を読む。本人でない・通報で非表示になった場所は null
export async function getOwnPlace(id: string, userId: string): Promise<Place | null> {
  const supabase = await serverClient();
  const { data } = await supabase.from("places").select(COLUMNS).eq("id", id).eq("author_id", userId).eq("status", "public").maybeSingle<Row>();
  return data ? toPlace(data) : null;
}

function toPlace(r: Row): Place {
  return {
    id: r.id,
    areaSlug: r.area_slug,
    name: r.name,
    description: r.description,
    lng: r.lng,
    lat: r.lat,
    basis: r.basis,
    instruments: r.instruments,
    timeNote: r.time_note,
    soundNote: r.sound_note,
    authorId: r.author_id,
    authorName: r.profiles?.display_name ?? "退会した人",
    createdAt: r.created_at.slice(0, 10),
  };
}
