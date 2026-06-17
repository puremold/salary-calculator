"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeHourly } from "@/lib/hourly";
import { formatKRW } from "@/lib/salary";
import { MAX_WAGE, MIN_WAGE } from "@/lib/hourlyData";
import { BreakdownTable } from "./BreakdownTable";

export function HourlyCalculator({ initialWage = 10030 }: { initialWage?: number }) {
  const [wage, setWage] = useState(initialWage);
  const [weeklyHours, setWeeklyHours] = useState(40);

  const r = useMemo(
    () => computeHourly(wage, { weeklyHours }),
    [wage, weeklyHours],
  );

  const clamped = Math.min(Math.max(wage, MIN_WAGE), MAX_WAGE);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">시급 (원)</span>
          <input
            type="number"
            inputMode="numeric"
            value={wage}
            min={MIN_WAGE}
            max={MAX_WAGE}
            step={100}
            onChange={(e) => setWage(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg font-semibold tabular-nums text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">주 소정근로시간</span>
          <input
            type="number"
            inputMode="numeric"
            value={weeklyHours}
            min={1}
            max={68}
            step={1}
            onChange={(e) =>
              setWeeklyHours(Math.max(1, Number(e.target.value) || 1))
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tabular-nums text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <span className="mt-1 block text-xs text-slate-400">
            주 15시간 이상이면 주휴수당이 포함됩니다 (풀타임 40시간 = 월 약 209시간)
          </span>
        </label>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-indigo-600 px-5 py-4 text-white">
          <div className="text-sm text-indigo-100">월 실수령액</div>
          <div className="mt-0.5 text-2xl font-bold tabular-nums sm:text-3xl">
            {formatKRW(r.salary.monthlyNet)}원
          </div>
        </div>
        <div className="rounded-xl bg-slate-100 px-5 py-4">
          <div className="text-sm text-slate-500">세전 월급 (주휴 포함)</div>
          <div className="mt-0.5 text-2xl font-bold tabular-nums text-slate-800 sm:text-3xl">
            {formatKRW(r.salary.monthlyGross)}원
          </div>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl bg-slate-50 px-4 py-3 text-sm sm:grid-cols-3">
        <div className="flex justify-between sm:block">
          <dt className="text-slate-500">월 환산시간</dt>
          <dd className="font-medium tabular-nums text-slate-800">
            {r.monthlyPaidHours}시간
          </dd>
        </div>
        <div className="flex justify-between sm:block">
          <dt className="text-slate-500">월 주휴수당</dt>
          <dd className="font-medium tabular-nums text-slate-800">
            {formatKRW(r.monthlyHolidayPay)}원
          </dd>
        </div>
        <div className="flex justify-between sm:block">
          <dt className="text-slate-500">연봉 환산</dt>
          <dd className="font-medium tabular-nums text-slate-800">
            {formatKRW(r.salary.annualGross)}원
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <BreakdownTable b={r.salary} />
      </div>

      <div className="mt-4 text-center">
        <Link
          href={`/sigeup/${clamped}`}
          className="inline-block text-sm font-medium text-indigo-600 underline-offset-2 hover:underline"
        >
          시급 {formatKRW(clamped)}원 상세 페이지 보기 →
        </Link>
      </div>
    </div>
  );
}
