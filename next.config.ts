import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel이 일부 배포에 자동으로 붙이는 'X-Robots-Tag: noindex'를 덮어써서
  // 검색엔진이 모든 페이지를 색인할 수 있도록 강제한다.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
    ];
  },
};

export default nextConfig;
