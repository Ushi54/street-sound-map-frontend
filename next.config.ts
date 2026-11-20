import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 画像の最適化（sharp）は使わない。投稿の写真は Want なので、必要になったら見直す
  images: { unoptimized: true },
};

export default nextConfig;
