// 紹介ページの絵：地図とピン、開いた場所のカード（実際の場所ではなく見本）
export default function HeroMap() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]" aria-hidden>
      <svg viewBox="0 0 520 420" className="w-full rounded-[2rem] bg-green-cream shadow-[0_4px_24px_rgb(45_36_30/0.10)]">
        {/* 公園（やわらかい形） */}
        <path d="M40 70 C90 30 170 40 190 95 C210 150 140 185 85 165 C35 148 0 105 40 70Z" fill="#a3c2ad" />
        <path d="M330 250 C380 215 470 230 480 290 C490 350 410 380 360 355 C315 333 290 280 330 250Z" fill="#a3c2ad" />
        {/* 川 */}
        <path d="M-10 300 C90 260 160 330 260 290 C350 255 400 180 530 170" stroke="#f5efe1" strokeWidth="34" fill="none" strokeLinecap="round" />
        {/* 道 */}
        <path d="M250 -10 L230 430" stroke="#fff" strokeWidth="10" />
        <path d="M-10 210 L530 120" stroke="#fff" strokeWidth="8" />
        {/* ピン */}
        {[
          [110, 110],
          [400, 300],
          [160, 300],
          [455, 175],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="11" fill="#c9a47b" stroke="#fff" strokeWidth="4" />
        ))}
        {/* まとまり（クラスタ） */}
        <circle cx="330" cy="95" r="20" fill="#6f9b88" stroke="#fff" strokeWidth="4" />
        <text x="330" y="101" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">3</text>
        {/* 選んだピン */}
        <circle cx="300" cy="245" r="15" fill="#c9a47b" stroke="#fff" strokeWidth="5" />
      </svg>

      {/* 開いた場所のカード */}
      <div className="absolute right-3 bottom-3 left-3 rounded-3xl bg-white p-4 shadow-[0_4px_24px_rgb(45_36_30/0.15)] sm:right-auto sm:bottom-6 sm:left-6 sm:w-72 sm:p-5">
        <p className="font-bold">河川敷の広場（見本）</p>
        <div className="mt-2 rounded-2xl bg-sand p-3 text-sm leading-relaxed">
          <p><span className="font-bold">根拠：</span>管理者に確認した</p>
          <p><span className="font-bold">時間：</span>平日の昼</p>
          <p><span className="font-bold">楽器：</span>アコースティック・管楽器</p>
        </div>
      </div>
    </div>
  );
}
