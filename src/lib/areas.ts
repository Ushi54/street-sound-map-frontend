import type { Area } from "./types";

// 最初は東京だけ（要件定義 Q2）。DB の areas テーブルに移すまでの仮置き
export const AREAS: Area[] = [
  { slug: "tokyo", name: "東京", center: [139.7671, 35.6812], zoom: 10.5 },
];

export function findArea(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}
