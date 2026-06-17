// =============================================================================
// 한국 연봉 실수령액 계산 엔진 (2025년 기준)
// -----------------------------------------------------------------------------
// 4대보험(국민연금·건강보험·장기요양·고용보험) + 근로소득세 + 지방소득세를 계산한다.
// 세율/요율은 매년 바뀌므로 RATES 한 곳만 수정하면 전체가 갱신된다.
// 소득세는 "연간 결정세액 ÷ 12" 방식의 추정치이며, 실제 매월 원천징수는
// 국세청 근로소득 간이세액표 기준이라 다를 수 있다(연말정산으로 정산됨). 참고용.
// =============================================================================

export const RATES = {
  year: 2025,
  // --- 4대보험 (근로자 부담분) ---
  nationalPension: 0.045, // 국민연금 4.5%
  nationalPensionMaxBase: 6_170_000, // 기준소득월액 상한(월). 시기별로 조정됨
  nationalPensionMinBase: 390_000, // 기준소득월액 하한(월)
  healthInsurance: 0.03545, // 건강보험 3.545%
  longTermCareRate: 0.1295, // 장기요양 = 건강보험료 × 12.95%
  employment: 0.009, // 고용보험(실업급여) 0.9%
  localTaxRate: 0.1, // 지방소득세 = 소득세 × 10%
} as const;

export interface SalaryOptions {
  /** 본인 포함 부양가족 수 (기본 1 = 본인만) */
  dependents?: number;
  /** 월 비과세액 (예: 식대). 보험료·세금 산정에서 제외됨. 기본 0 */
  nonTaxableMonthly?: number;
}

export interface SalaryBreakdown {
  annualGross: number; // 연봉 (세전, 원)
  monthlyGross: number; // 월 급여 (세전, 원)
  nationalPension: number; // 국민연금 (월)
  healthInsurance: number; // 건강보험 (월)
  longTermCare: number; // 장기요양보험 (월)
  employment: number; // 고용보험 (월)
  incomeTax: number; // 근로소득세 (월)
  localTax: number; // 지방소득세 (월)
  totalDeduction: number; // 공제 합계 (월)
  monthlyNet: number; // 월 실수령액
  annualNet: number; // 연 실수령액 (월 실수령 × 12)
  options: Required<SalaryOptions>;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/** 근로소득공제 (연간) */
function earnedIncomeDeduction(gross: number): number {
  let d: number;
  if (gross <= 5_000_000) d = gross * 0.7;
  else if (gross <= 15_000_000) d = 3_500_000 + (gross - 5_000_000) * 0.4;
  else if (gross <= 45_000_000) d = 7_500_000 + (gross - 15_000_000) * 0.15;
  else if (gross <= 100_000_000) d = 12_000_000 + (gross - 45_000_000) * 0.05;
  else d = 14_750_000 + (gross - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000); // 공제 한도 2,000만원
}

/** 종합소득세율 누진세 (과세표준 → 산출세액) */
function progressiveIncomeTax(base: number): number {
  const brackets: Array<[number, number, number]> = [
    // [상한, 세율, 누진공제]
    [14_000_000, 0.06, 0],
    [50_000_000, 0.15, 1_260_000],
    [88_000_000, 0.24, 5_760_000],
    [150_000_000, 0.35, 15_440_000],
    [300_000_000, 0.38, 19_940_000],
    [500_000_000, 0.4, 25_940_000],
    [1_000_000_000, 0.42, 35_940_000],
    [Infinity, 0.45, 65_940_000],
  ];
  for (const [ceil, rate, deduct] of brackets) {
    if (base <= ceil) return Math.max(0, base * rate - deduct);
  }
  return 0;
}

/** 근로소득 세액공제 (산출세액 + 총급여에 따른 한도 적용) */
function earnedIncomeTaxCredit(calculatedTax: number, gross: number): number {
  const credit =
    calculatedTax <= 1_300_000
      ? calculatedTax * 0.55
      : 715_000 + (calculatedTax - 1_300_000) * 0.3;

  let limit: number;
  if (gross <= 33_000_000) limit = 740_000;
  else if (gross <= 70_000_000)
    limit = Math.max(660_000, 740_000 - (gross - 33_000_000) * 0.008);
  else if (gross <= 120_000_000)
    limit = Math.max(500_000, 660_000 - (gross - 70_000_000) * 0.5);
  else limit = Math.max(200_000, 500_000 - (gross - 120_000_000) * 0.5);

  return Math.min(credit, limit);
}

/** 연간 결정세액(근로소득세) 추정 */
function annualIncomeTax(
  annualTaxableSalary: number,
  dependents: number,
  annualInsurance: number,
): number {
  const earned = earnedIncomeDeduction(annualTaxableSalary);
  const personal = dependents * 1_500_000; // 인적공제 1인당 150만원
  const base = Math.max(
    0,
    annualTaxableSalary - earned - personal - annualInsurance,
  );
  const calculated = progressiveIncomeTax(base);
  const credit = earnedIncomeTaxCredit(calculated, annualTaxableSalary);
  return Math.max(0, calculated - credit);
}

/** 연봉(원)을 받아 월/연 실수령액 및 공제 내역을 계산한다. */
export function computeSalary(
  annualGross: number,
  options: SalaryOptions = {},
): SalaryBreakdown {
  const dependents = Math.max(1, Math.floor(options.dependents ?? 1));
  const nonTaxableMonthly = Math.max(0, options.nonTaxableMonthly ?? 0);

  const monthlyGross = annualGross / 12;
  const taxableMonthly = Math.max(0, monthlyGross - nonTaxableMonthly);

  // 4대보험 (월)
  const pensionBase = clamp(
    taxableMonthly,
    RATES.nationalPensionMinBase,
    RATES.nationalPensionMaxBase,
  );
  const nationalPension = Math.round(pensionBase * RATES.nationalPension);
  const healthInsurance = Math.round(taxableMonthly * RATES.healthInsurance);
  const longTermCare = Math.round(healthInsurance * RATES.longTermCareRate);
  const employment = Math.round(taxableMonthly * RATES.employment);

  // 세금 (월)
  const annualInsurance =
    (nationalPension + healthInsurance + longTermCare + employment) * 12;
  const annualTaxableSalary = taxableMonthly * 12;
  const incomeTax = Math.round(
    annualIncomeTax(annualTaxableSalary, dependents, annualInsurance) / 12,
  );
  const localTax = Math.round(incomeTax * RATES.localTaxRate);

  const totalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employment +
    incomeTax +
    localTax;
  const monthlyNet = Math.round(monthlyGross - totalDeduction);

  return {
    annualGross,
    monthlyGross: Math.round(monthlyGross),
    nationalPension,
    healthInsurance,
    longTermCare,
    employment,
    incomeTax,
    localTax,
    totalDeduction,
    monthlyNet,
    annualNet: monthlyNet * 12,
    options: { dependents, nonTaxableMonthly },
  };
}

// ----------------------------- 포맷 헬퍼 -------------------------------------

/** 1234567 → "1,234,567" */
export function formatKRW(n: number): string {
  return Math.round(n).toLocaleString("ko-KR");
}

export function manwonToWon(manwon: number): number {
  return manwon * 10_000;
}

/** 만원 단위 숫자를 한국식 라벨로. 3000 → "3,000만원", 12000 → "1억 2,000만원" */
export function formatManwonLabel(manwon: number): string {
  if (manwon >= 10_000) {
    const eok = Math.floor(manwon / 10_000);
    const rest = manwon % 10_000;
    return rest === 0
      ? `${eok}억원`
      : `${eok}억 ${rest.toLocaleString("ko-KR")}만원`;
  }
  return `${manwon.toLocaleString("ko-KR")}만원`;
}
