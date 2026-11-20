import Link from "next/link";
import { MANNERS_SHORT } from "@/lib/manners";

// 地図の上に常に出すマナーの帯。閉じるボタンは置かない
export default function MannersBanner() {
  return (
    <Link
      href="/manners"
      className="flex items-center gap-2 bg-sand px-4 py-2.5 text-sm font-bold text-ink sm:text-base"
    >
      <span aria-hidden className="text-lg">⚠</span>
      <span className="min-w-0 flex-1 truncate">
        <span className="hidden sm:inline">マナー：</span>
        {MANNERS_SHORT}
      </span>
      <span className="shrink-0 text-xs underline sm:text-sm">全文</span>
    </Link>
  );
}
