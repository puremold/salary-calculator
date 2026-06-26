"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeSeverance } from "@/lib/severance";
import { formatKRW } from "@/lib/salary";
import { MAX_MONTHLY_MANWON, MIN_MONTHLY_MANWON } from "@/lib/severanceData";

export function SeveranceCalculator({
  initialMonthlyManwon = 300,
}: {
  initialMonthlyManwon?: number;
}) {
  const [monthly, setMonthly] = useState(initialMonthlyManwon); // 월급(만원)
  const [bonus, setBonus] = useState(0); // 연간 상여(만원)
  const [leave, setLeave] = useState(0); // 연차수당(만원)
  const [years, setYears] = useState(3);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);

  const r = useMemo(
    () =>
      computeSeverance({
        monthlyWage: monthly * 10000,
        annualBonus: bonus * 10000,
        annualLeaveAllowance: leave * 10000,
        serviceYears: years,
        serviceMonths: months,
        serviceDays: days,
      }),
    [monthly, bonus, leave, years, months, days],
  );

  const clamped = Math.min(Math.max(monthly, MIN_MONTHLY_MANWON), MAX_MONTHLY_MANWON);

  const inputCls =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tabular-nums text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">월 평균급여 (만원)</span>
          <input
            type="number"
            inputMode="numeric"
            value={monthly}
            min={MIN_MONTHLY_MANWON}
            max={MAX_MONTHLY_MANWON}
            step={10}
            onChange={(e) => setMonthly(Number(e.target.value) || 0)}
            className={inputCls + " font-semibold"}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">연간 상여금 (만원)</span>
          <input
            type="number"
            inputMode="numeric"
            value={bonus}
            min={0}
            step={10}
            onChange={(e) => setBonus(Math.max(0, Number(e.target.value) || 0))}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">연차수당 (만원)</span>
          <input
            type="number"
            inputMode="numeric"
            value={leave}
            min={0}
            step={10}
            onChange={(e) => setLeave(Math.max(0, Number(e.target.value) || 0))}
            className={inputCls}
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="text-sm font-medium text-slate-700">근속기간</span>
        <div className="mt-1 grid grid-cols-3 gap-3">
          <label className="block">
            <input
              type="number"
              inputMode="numeric"
              value={years}
              min={0}
              max={50}
              step={1}
              onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
              className={inputCls}
            />
            <span className="mt-1 block text-center text-xs text-slate-400">년</span>
          </label>
          <label className="block">
            <input
              type="number"
              inputMode="numeric"
              value={months}
              min={0}
              max={11}
              step={1}
              onChange={(e) => setMonths(Math.max(0, Number(e.target.value) || 0))}
              className={inputCls}
            />
            <span className="mt-1 block text-center text-xs text-slate-400">개월</span>
          </label>
          <label className="block">
            <input
              type="number"
              inputMode="numeric"
              value={days}
              min={0}
              max={30}
              step={1}
              onChange={(e) => setDays(Math.max(0, Number(e.target.value) || 0))}
              className={inputCls}
            />
            <span className="mt-1 block text-center text-xs text-slate-400">일</span>
          </label>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-indigo-600 px-5 py-4 text-white">
        <div className="text-sm text-indigo-100">예상 퇴직금 (세전)</div>
        <div className="mt-0.5 text-3xl font-bold tabular-nums">
          {formatKRW(r.severancePay)}원
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl bg-slate-50 px-4 py-3 text-sm">
        <div className="flex justify-between sm:block">
          <dt className="text-slate-500">1일 평균임금</dt>
          <dd className="font-medium tabular-nums text-slate-800">
            {formatKRW(r.dailyAverageWage)}원
          </dd>
        </div>
        <div className="flex justify-between sm:block">
          <dt className="text-slate-500">총 재직일수</dt>
          <dd className="font-medium tabular-nums text-slate-800">
            {formatKRW(r.totalServiceDays)}일
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-slate-400">
        ※ 세전 추정치입니다(퇴직소득세 별도). 1일 평균임금은 3개월 평균일수(91.25일)
        기준으로 계산하며, 실제 퇴직 전 3개월의 일수·임금에 따라 달라질 수 있습니다.
      </p>

      <div className="mt-4 text-center">
        <Link
          href={`/toejikgeum/${clamped}`}
          className="inline-block text-sm font-medium text-indigo-600 underline-offset-2 hover:underline"
        >
          월급 {formatKRW(clamped)}만원 퇴직금 상세 페이지 보기 →
        </Link>
      </div>
    </div>
  );
}
