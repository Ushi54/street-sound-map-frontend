import TextPage from "@/components/TextPage";

export const metadata = { title: "ログインできませんでした | Street Sound Map" };

export default function AuthErrorPage() {
  return (
    <TextPage title="ログインできませんでした">
      <p>時間をおいて、もう一度ログインしてください。続く時は、ブラウザを変えて試してください。</p>
    </TextPage>
  );
}
