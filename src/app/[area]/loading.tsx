import Spinner from "@/components/Spinner";

// エリアの画面を開く時（サーバーから場所を読む間）
export default function Loading() {
  return (
    <div className="grid h-dvh place-items-center bg-cream">
      <Spinner />
    </div>
  );
}
