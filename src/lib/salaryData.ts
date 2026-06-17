// 프로그래매틱 SEO 페이지로 미리 생성할 연봉 목록 (만원 단위)
// 빌드 시 각각 /yeonbong/{만원} 정적 페이지가 만들어진다.
// 목록에 없는 값(예: /yeonbong/3150)도 허용 범위 안이면 요청 시 자동 생성된다.

export const MIN_MANWON = 1000; // 1,000만원
export const MAX_MANWON = 30000; // 3억원

function buildPageManwons(): number[] {
  const arr: number[] = [];
  for (let m = 1200; m <= 10000; m += 100) arr.push(m); // 1,200만 ~ 1억 (100만 단위)
  for (let m = 10500; m <= 20000; m += 500) arr.push(m); // 1억 ~ 2억 (500만 단위)
  return arr;
}

export const PAGE_MANWONS: number[] = buildPageManwons();

// 홈/내부링크에 노출할 인기 연봉
export const POPULAR_MANWONS = [2400, 3000, 3600, 4000, 5000, 6000, 7000, 8000, 10000];
