// 読み込み中のくるくる。label は読み上げ用（画面にも小さく出す）
export default function Spinner({ label = "読み込み中" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 text-sm text-ink/70">
      <span className="size-10 animate-spin rounded-full border-4 border-sand-dark/30 border-t-green-dark" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
