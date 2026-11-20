import TextPage from "@/components/TextPage";
import { CONTACT_URL } from "@/lib/contact";

export const metadata = { title: "利用規約 | Street Sound Map" };

// 2026-11-20 社長が確定
export default function TermsPage() {
  return (
    <TextPage title="利用規約">
      <section>
        <h2>1. このサービスについて</h2>
        <p>Street Sound Map（以下「本サービス」）は、楽器の練習ができる場所の情報を、利用者どうしで共有するための個人運営のサービスです。</p>
      </section>
      <section>
        <h2>2. 情報の正しさ</h2>
        <p>掲載している情報は、投稿した利用者の体験にもとづくものです。その場所で演奏できることを保証するものではありません。演奏する前に、必ず現地の案内や管理者に確かめてください。</p>
      </section>
      <section>
        <h2>3. 守ること</h2>
        <ul>
          <li>マナーのページに書いたことを守ること</li>
          <li>演奏が禁止されている場所を投稿しないこと</li>
          <li>他人の個人情報、うそ、悪口、広告を投稿しないこと</li>
        </ul>
      </section>
      <section>
        <h2>4. 投稿の扱い</h2>
        <p>通報が一定数集まった場所や、規約に反すると運営者が判断した投稿は、予告なく非表示または削除することがあります。</p>
      </section>
      <section>
        <h2>5. 責任</h2>
        <p>本サービスの情報をもとに起きたトラブルや損害について、運営者は責任を負いません。</p>
      </section>
      <section>
        <h2>6. 変更</h2>
        <p>この規約は、必要に応じて変更することがあります。</p>
      </section>
      <section>
        <h2>7. お問い合わせ</h2>
        <p>
          投稿についての相談、不具合の報告、アカウントの削除は、<a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="underline">お問い合わせフォーム</a>から送ってください。
        </p>
      </section>
    </TextPage>
  );
}
