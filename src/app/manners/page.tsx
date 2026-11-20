import TextPage from "@/components/TextPage";
import { MANNERS } from "@/lib/manners";

export const metadata = { title: "マナー | Street Sound Map" };

export default function MannersPage() {
  return (
    <TextPage title="マナー">
      <p>音のトラブルや苦情が起きると、その場所で誰も練習できなくなります。次のことを必ず守ってください。</p>
      <ol className="space-y-4!">
        {MANNERS.map((m) => (
          <li key={m.title}>
            <p className="font-bold">{m.title}</p>
            <p className="text-sm">{m.detail}</p>
          </li>
        ))}
      </ol>
      <p className="text-sm">ルールを守っていない場所や投稿を見つけたら、場所の詳細の「通報する」から知らせてください。</p>
    </TextPage>
  );
}
