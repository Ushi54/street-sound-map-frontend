// マナーの中身。変えたら MANNERS_VERSION を上げる（全員にもう一度マナーの画面が出る）
export const MANNERS_VERSION = "2026-11-18";

export const MANNERS: { title: string; detail: string }[] = [
  { title: "禁止の場所では演奏しない", detail: "看板や管理者の案内に従ってください。" },
  { title: "早朝・夜間は演奏しない", detail: "目安は 8時〜20時 です。" },
  { title: "住宅の近くでは音量を下げる", detail: "下げられない時は、場所を変えてください。" },
  { title: "通行の邪魔をしない・ゴミは持ち帰る", detail: "楽器や荷物で道をふさがないでください。" },
  { title: "注意されたら、すぐにやめる", detail: "その場で謝って、演奏をやめてください。" },
  { title: "最後は自分で現地のルールを確かめる", detail: "載っている情報は投稿した人の体験です。演奏できることを保証するものではありません。" },
];

// 地図の上の帯に出す短い文
export const MANNERS_SHORT = "8時〜20時だけ・禁止の場所では演奏しない・注意されたらすぐやめる";
