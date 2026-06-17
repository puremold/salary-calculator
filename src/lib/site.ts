// 사이트 전역 설정. 배포 시 NEXT_PUBLIC_SITE_URL 환경변수만 실제 도메인으로 바꾸면 됩니다.
export const SITE = {
  name: "계산모아",
  tagline: "연봉 실수령액 계산기",
  // 배포 후 반드시 실제 도메인으로 교체 (예: https://gyesanmoa.com)
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  description:
    "2025년 기준 연봉 실수령액 계산기. 국민연금·건강보험·장기요양·고용보험·소득세까지 4대보험 공제 내역을 한눈에 확인하세요.",
  // 구글 애드센스 게시자 ID (예: ca-pub-XXXXXXXX). 설정하면 자동으로 광고 스크립트가 삽입됩니다.
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
} as const;
