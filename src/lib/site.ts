// 사이트 전역 설정. 배포 시 NEXT_PUBLIC_SITE_URL 환경변수만 실제 도메인으로 바꾸면 됩니다.
export const SITE = {
  name: "계산모아",
  tagline: "연봉 실수령액 계산기",
  // 색인 가능한 Vercel 프로덕션 도메인을 직접 지정한다.
  // (-salary-claculater 등 다른 별칭은 Vercel이 noindex를 붙이므로 사용 금지.
  //  추후 커스텀 도메인을 연결하면 이 한 줄만 교체하면 된다.)
  url: "https://salary-calculator-ten-phi.vercel.app",
  description:
    "2025년 기준 연봉 실수령액 계산기. 국민연금·건강보험·장기요양·고용보험·소득세까지 4대보험 공제 내역을 한눈에 확인하세요.",
  // 구글 애드센스 게시자 ID (예: ca-pub-XXXXXXXX). 설정하면 자동으로 광고 스크립트가 삽입됩니다.
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
} as const;
