export type Area = {
  slug: string; // URL（/tokyo）
  name: string;
  center: [number, number]; // [経度, 緯度]
  zoom: number;
};

// 演奏できる根拠
export type Basis = "official" | "confirmed" | "no_sign";

export const BASIS_LABEL: Record<Basis, string> = {
  official: "公式に演奏できる場所",
  confirmed: "管理者に確認した",
  no_sign: "禁止の表示はなかった",
};

// DB の check（places_instruments_allowed）と同じにする。片方を直したらもう片方も直す
export const INSTRUMENTS = ["アコースティック", "電子・小さい音", "声", "管楽器", "打楽器"] as const;

export const REPORT_REASONS = {
  prohibited: "演奏が禁止されている場所",
  noise: "騒音・苦情が出ている",
  inappropriate: "不適切な内容",
  wrong: "情報がまちがっている",
  other: "その他",
} as const;
export type ReportReason = keyof typeof REPORT_REASONS;

export type Place = {
  id: string;
  areaSlug: string;
  name: string;
  description: string;
  lng: number;
  lat: number;
  basis: Basis;
  instruments: string[];
  timeNote: string; // おすすめの時間帯
  soundNote: string; // 音への注意
  authorId: string;
  authorName: string;
  createdAt: string; // YYYY-MM-DD
};
