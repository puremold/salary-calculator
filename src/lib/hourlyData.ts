// 프로그래매틱 SEO 페이지로 생성할 시급 목록 (원 단위)
// /sigeup/{시급} 형태의 정적 페이지가 만들어진다.

export const MIN_WAGE = 5000; // 시급 하한(페이지 허용 범위)
export const MAX_WAGE = 200000; // 시급 상한
export const MINIMUM_WAGE_2025 = 10030; // 2025년 최저시급

function buildPageWages(): number[] {
  const set = new Set<number>();
  set.add(MINIMUM_WAGE_2025);
  for (let w = 9000; w <= 20000; w += 500) set.add(w); // 9,000 ~ 20,000 (500원 단위)
  [21000, 22000, 23000, 25000, 30000, 35000, 40000, 50000].forEach((w) =>
    set.add(w),
  );
  return Array.from(set).sort((a, b) => a - b);
}

export const PAGE_WAGES: number[] = buildPageWages();

// 홈/내부링크에 노출할 인기 시급
export const POPULAR_WAGES = [10030, 11000, 12000, 13000, 15000, 20000];
