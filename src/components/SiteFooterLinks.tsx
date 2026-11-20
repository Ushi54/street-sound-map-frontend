import Link from "next/link";
import { CONTACT_URL } from "@/lib/contact";

export default function SiteFooterLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={`flex flex-wrap gap-x-5 gap-y-2 text-sm ${className}`}>
      <Link href="/manners" className="font-bold underline">マナー</Link>
      <Link href="/terms" className="underline">利用規約</Link>
      <Link href="/privacy" className="underline">プライバシーポリシー</Link>
      <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="underline">お問い合わせ</a>
    </nav>
  );
}
