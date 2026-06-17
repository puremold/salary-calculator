"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  computeSalary,
  formatKRW,
  formatManwonLabel,
  manwonToWon,
} from "@/lib/salary";
import { MAX_MANWON, MIN_MANWON } from "@/lib/salaryData";
import { BreakdownTable } from "./BreakdownTable";

export function SalaryCalculator({ initialManwon = 3600 }: { initialManwon?: number }) {
  const [manwon, setManwon] = useState(initialManwon);
  const [dependents, setDependents] = useState(1);
  const [mealAllowance, setMealAllowance] = useState(0); // 월 비과세(식대 등)

  const breakdown = useMemo(
    () =>
      computeSalary(manwonToWon(manwon), {
        dependents,
        nonTaxableMonthly: mealAllowance,
      }),
    [manwon, dependents, mealAllowance],
  );

  const clamped = Math.min(Math.max(manwon, MIN_MANWON), MAX_MANWON);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className="text-sm font-medium text-slate-700">연봉 (만원)</span>
          <input
            type="number"
            inputMode="numeric"
            value={manwon}
            min={MIN_MANWON}
            max={MAX_MANWON}
            step={100}
            onChange={(e) => setManwon(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg font-semibold tabular-nums text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">부양가족 수 (본인 포함)</span>
          <input
            type="number"
            inputMode="numeric"
            value={dependents}
            min={1}
            max={11}
            step={1}
            onChange={(e) => setDependents(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tabular-nums text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">월 비과세액 (식대 등)</span>
          <input
            type="number"
            inputMode="numeric"
            value={mealAllowance}
            min={0}
            step={10000}
            onChange={(e) => setMealAllowance(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tabular-nums text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      </div>

      <div className="mt-5 rounded-xl bg-indigo-600 px-5 py-4 text-white">
        <div className="text-sm text-indigo-100">
          연봉 {formatManwonLabel(clamped)}의 월 실수령액
        </div>
        <div className="mt-0.5 text-3xl font-bold tabular-nums">
          {formatKRW(breakdown.monthlyNet)}원
        </div>
        <div className="mt-0.5 text-sm text-indigo-100">
          연 실수령 약 {formatKRW(breakdown.annualNet)}원
        </div>
      </div>

      <div className="mt-5">
        <BreakdownTable b={breakdown} />
      </div>

      <div className="mt-4 text-center">
        <Link
          href={`/yeonbong/${clamped}`}
          className="inline-block text-sm font-medium text-indigo-600 underline-offset-2 hover:underline"
        >
          연봉 {formatManwonLabel(clamped)} 실수령액 상세 페이지 보기 →
        </Link>
      </div>
    </div>
  );
}
