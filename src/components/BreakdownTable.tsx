import { formatKRW, type SalaryBreakdown } from "@/lib/salary";

// 공제 내역 표 (서버/클라이언트 양쪽에서 사용하는 순수 표시용 컴포넌트)
export function BreakdownTable({ b }: { b: SalaryBreakdown }) {
  const rows: Array<{ label: string; value: number; hint?: string }> = [
    { label: "국민연금", value: b.nationalPension, hint: "4.5%" },
    { label: "건강보험", value: b.healthInsurance, hint: "3.545%" },
    { label: "장기요양보험", value: b.longTermCare, hint: "건강보험료의 12.95%" },
    { label: "고용보험", value: b.employment, hint: "0.9%" },
    { label: "근로소득세", value: b.incomeTax, hint: "간이세액 추정" },
    { label: "지방소득세", value: b.localTax, hint: "소득세의 10%" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500">
            <th className="px-4 py-2.5 text-left font-medium">항목</th>
            <th className="px-4 py-2.5 text-right font-medium">월 금액</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr className="bg-white">
            <td className="px-4 py-2.5 font-medium text-slate-700">월 급여 (세전)</td>
            <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-900">
              {formatKRW(b.monthlyGross)}원
            </td>
          </tr>
          {rows.map((r) => (
            <tr key={r.label} className="bg-white">
              <td className="px-4 py-2.5 text-slate-600">
                {r.label}
                {r.hint && (
                  <span className="ml-1.5 text-xs text-slate-400">({r.hint})</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums text-rose-600">
                −{formatKRW(r.value)}원
              </td>
            </tr>
          ))}
          <tr className="bg-slate-50">
            <td className="px-4 py-2.5 font-medium text-slate-700">공제 합계</td>
            <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-rose-600">
              −{formatKRW(b.totalDeduction)}원
            </td>
          </tr>
          <tr className="bg-indigo-50">
            <td className="px-4 py-3 text-base font-bold text-indigo-900">
              월 실수령액
            </td>
            <td className="px-4 py-3 text-right text-base font-bold tabular-nums text-indigo-700">
              {formatKRW(b.monthlyNet)}원
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
