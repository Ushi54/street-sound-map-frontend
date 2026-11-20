import Link from "next/link";
import SiteFooterLinks from "./SiteFooterLinks";

export default function TextPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
      <Link href="/" className="text-sm font-bold text-green-dark">← Street Sound Map</Link>
      <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h1>
      <div className="mt-8 space-y-6 rounded-3xl bg-white p-6 leading-relaxed sm:p-10 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
      <SiteFooterLinks className="mt-10" />
    </main>
  );
}
