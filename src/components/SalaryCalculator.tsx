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

// 빈 칸 허용: 비우면 ""로 두고 계산 시 0으로 취급
type Num = number | "";
const n = (v: Num) => (v === "" ? 0 : v);
const parse = (s: string): Num => (s === "" ? "" : Number(s));

export function SalaryCalculator({ initialManwon = 3600 }: { initialManwon?: number }) {
  const [manwon, setManwon] = useState<Num>(initialManwon);
  const [dependents, setDependents] = useState<Num>(1);
  const [mealAllowance, setMealAllowance] = useState<Num>(0); // 월 비과세(식대 등)

  const breakdown = useMemo(
    () =>
      computeSalary(manwonToWon(n(manwon)), {
        dependents: n(dependents),
        nonTaxableMonthly: n(mealAllowance),
      }),
    [manwon, dependents, mealAllowance],
  );

  const clamped = Math.min(Math.max(n(manwon), MIN_MANWON), MAX_MANWON);

  const inputCls =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tabular-nums text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className="text-sm font-medium text-slate-700">연봉 (만원)</span>
          <input
            type="number"
            inputMode="numeric"
            value={manwon}
            placeholder="0"
            min={MIN_MANWON}
            max={MAX_MANWON}
            step={100}
            onChange={(e) => setManwon(parse(e.target.value))}
            className={inputCls + " text-lg font-semibold"}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">부양가족 수 (본인 포함)</span>
          <input
            type="number"
            inputMode="numeric"
            value={dependents}
            placeholder="1"
            min={1}
            max={11}
            step={1}
            onChange={(e) => setDependents(parse(e.target.value))}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">월 비과세액 (식대 등)</span>
          <input
            type="number"
            inputMode="numeric"
            value={mealAllowance}
            placeholder="0"
            min={0}
            step={10000}
            onChange={(e) => setMealAllowance(parse(e.target.value))}
            className={inputCls}
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
