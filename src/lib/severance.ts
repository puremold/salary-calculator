// =============================================================================
// 퇴직금 계산 (근로자퇴직급여보장법 기준)
// -----------------------------------------------------------------------------
//   퇴직금 = 1일 평균임금 × 30 × (총 재직일수 ÷ 365)
//   1일 평균임금 = (퇴직 전 3개월 임금총액) ÷ (3개월 총일수)
//   3개월 임금총액 = 월급여 × 3 + 연간상여 × 3/12 + 연차수당 × 3/12
// 결과는 세전(퇴직소득세 공제 전) 추정치. 실제는 퇴직 전 3개월의 실제 일수·임금에 따라 다름.
// =============================================================================

// 3개월 평균 일수 (365 ÷ 4). 실제는 89~92일 사이로, 평균값을 사용한다.
const DAYS_IN_3_MONTHS = 365 / 4; // = 91.25

export interface SeveranceInput {
  monthlyWage: number; // 월 평균급여 (세전, 원)
  annualBonus?: number; // 연간 상여금 (원)
  annualLeaveAllowance?: number; // 연차수당 (연간, 원)
  serviceYears?: number;
  serviceMonths?: number;
  serviceDays?: number;
}

export interface SeveranceResult {
  monthlyWage: number;
  dailyAverageWage: number; // 1일 평균임금
  totalServiceDays: number; // 총 재직일수
  severancePay: number; // 퇴직금 (세전)
}

/** 1일 평균임금 계산 */
export function dailyAverageWage(
  monthlyWage: number,
  annualBonus = 0,
  annualLeaveAllowance = 0,
): number {
  const threeMonthTotal =
    monthlyWage * 3 + (annualBonus * 3) / 12 + (annualLeaveAllowance * 3) / 12;
  return threeMonthTotal / DAYS_IN_3_MONTHS;
}

export function computeSeverance(input: SeveranceInput): SeveranceResult {
  const monthlyWage = Math.max(0, input.monthlyWage);
  const years = Math.max(0, Math.floor(input.serviceYears ?? 0));
  const months = Math.max(0, Math.floor(input.serviceMonths ?? 0));
  const days = Math.max(0, Math.floor(input.serviceDays ?? 0));

  const daily = dailyAverageWage(
    monthlyWage,
    input.annualBonus ?? 0,
    input.annualLeaveAllowance ?? 0,
  );
  const totalServiceDays = years * 365 + months * 30 + days;
  const severancePay = Math.round((daily * 30 * totalServiceDays) / 365);

  return {
    monthlyWage,
    dailyAverageWage: Math.round(daily),
    totalServiceDays,
    severancePay,
  };
}

/** 월급(원)과 근속연수만으로 퇴직금 계산 (정적 페이지 표용, 상여·연차 0 가정) */
export function severanceForYears(monthlyWage: number, years: number): number {
  const daily = dailyAverageWage(monthlyWage);
  return Math.round(daily * 30 * years); // (years×365)/365 = years
}
