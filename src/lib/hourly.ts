// =============================================================================
// 시급 → 월급/연봉 + 주휴수당 + 실수령액 계산
// 연봉 실수령 엔진(computeSalary)을 그대로 재사용한다.
// =============================================================================

import { computeSalary, type SalaryBreakdown } from "./salary";

// 주 단위를 월 단위로 환산하는 계수 (1년 = 365일 기준)
const WEEKS_PER_MONTH = 365 / 12 / 7; // ≈ 4.3452
const FULL_TIME_WEEKLY_HOURS = 40;
const WEEKLY_HOLIDAY_HOURS_AT_FULLTIME = 8; // 주 40시간 근무 시 주휴 8시간

export interface HourlyOptions {
  /** 주 소정근로시간 (기본 40시간 = 풀타임) */
  weeklyHours?: number;
}

export interface HourlyBreakdown {
  hourlyWage: number; // 시급(원)
  weeklyHours: number; // 주 소정근로시간
  hasWeeklyHolidayPay: boolean; // 주휴수당 발생 여부(주 15시간 이상)
  weeklyHolidayHours: number; // 주휴 환산시간(주)
  monthlyPaidHours: number; // 월 유급 환산시간(주휴 포함)
  monthlyHolidayPay: number; // 월 주휴수당(원)
  salary: SalaryBreakdown; // 실수령 등 전체 내역
}

/** 주 소정근로시간 → 월 유급 환산시간(주휴 포함). 풀타임 40h → 약 209시간 */
export function monthlyPaidHoursFor(weeklyHours: number): number {
  const holidayHours =
    weeklyHours >= 15
      ? (weeklyHours / FULL_TIME_WEEKLY_HOURS) * WEEKLY_HOLIDAY_HOURS_AT_FULLTIME
      : 0;
  return Math.round((weeklyHours + holidayHours) * WEEKS_PER_MONTH);
}

export function computeHourly(
  hourlyWage: number,
  options: HourlyOptions = {},
): HourlyBreakdown {
  const weeklyHours = Math.max(1, options.weeklyHours ?? FULL_TIME_WEEKLY_HOURS);
  const hasWeeklyHolidayPay = weeklyHours >= 15;
  const weeklyHolidayHours = hasWeeklyHolidayPay
    ? (weeklyHours / FULL_TIME_WEEKLY_HOURS) * WEEKLY_HOLIDAY_HOURS_AT_FULLTIME
    : 0;

  const monthlyPaidHours = monthlyPaidHoursFor(weeklyHours);
  const monthlyGross = hourlyWage * monthlyPaidHours;
  const monthlyHolidayPay = Math.round(
    hourlyWage * weeklyHolidayHours * WEEKS_PER_MONTH,
  );

  const salary = computeSalary(monthlyGross * 12);

  return {
    hourlyWage,
    weeklyHours,
    hasWeeklyHolidayPay,
    weeklyHolidayHours: Math.round(weeklyHolidayHours * 10) / 10,
    monthlyPaidHours,
    monthlyHolidayPay,
    salary,
  };
}
