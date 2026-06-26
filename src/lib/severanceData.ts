// 프로그래매틱 SEO 페이지로 생성할 월급 목록 (만원 단위)
// /toejikgeum/{월급만원} 형태의 정적 페이지가 만들어진다.

export const MIN_MONTHLY_MANWON = 100; // 월급 100만원
export const MAX_MONTHLY_MANWON = 2000; // 월급 2,000만원

function buildPageWages(): number[] {
  const arr: number[] = [];
  for (let m = 150; m <= 700; m += 25) arr.push(m); // 150만 ~ 700만 (25만 단위)
  [750, 800, 900, 1000].forEach((m) => arr.push(m));
  return arr;
}

export const PAGE_MONTHLY_MANWONS: number[] = buildPageWages();

// 각 페이지에서 보여줄 근속연수 표
export const SERVICE_YEARS_TABLE = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30];

// 홈/내부링크에 노출할 인기 월급
export const POPULAR_MONTHLY_MANWONS = [250, 300, 350, 400, 500, 600];
