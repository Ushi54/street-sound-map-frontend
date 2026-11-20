import TextPage from "@/components/TextPage";
import { CONTACT_URL } from "@/lib/contact";

export const metadata = { title: "プライバシーポリシー | Street Sound Map" };

// 2026-11-20 社長が確定
export default function PrivacyPage() {
  return (
    <TextPage title="プライバシーポリシー">
      <section>
        <h2>1. 集める情報</h2>
        <ul>
          <li>Googleでログインした時に Google から届く情報（メールアドレス、Googleの名前とアイコン）。ログインの仕組み（Supabase）の中に保存されますが、画面には出しません</li>
          <li>このサービスでの表示名（最初は「演奏者＋番号」。Googleの名前は使いません）</li>
          <li>あなたが投稿した場所の情報（位置・名前・説明・条件）と通報の内容</li>
          <li>お問い合わせフォーム（Google フォーム）で送られた内容とメールアドレス。返事と本人確認だけに使います</li>
        </ul>
        <p>あなたの現在地は保存しません。</p>
      </section>
      <section>
        <h2>2. 使い道</h2>
        <ul>
          <li>ログインと、自分の投稿を編集・削除できるようにするため</li>
          <li>不適切な投稿に対応するため</li>
        </ul>
        <p>メールアドレスは画面に表示せず、ほかの利用者や第三者に渡しません。</p>
      </section>
      <section>
        <h2>3. 預け先</h2>
        <p>データは Supabase（データベースとログインのサービス）に保存しています。サイトは Vercel で公開しています。</p>
      </section>
      <section>
        <h2>4. 消したい時</h2>
        <p>自分の投稿は、いつでも自分で削除できます（通報で非表示になった投稿を除く）。</p>
        <p>
          アカウントごと消したい時は、<a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="underline">お問い合わせフォーム</a>から「アカウントを削除したい」を選んで送ってください。ログインに使った Google アカウントと照らし合わせて本人であることを確かめてから、アカウントと投稿をすべて削除します。
        </p>
      </section>
    </TextPage>
  );
}
