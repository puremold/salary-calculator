import Link from "next/link";
import { SalaryCalculator } from "@/components/SalaryCalculator";
import { POPULAR_MANWONS } from "@/lib/salaryData";
import { formatManwonLabel } from "@/lib/salary";
import { SITE } from "@/lib/site";

const FAQ = [
  {
    q: "연봉 실수령액은 어떻게 계산되나요?",
    a: "세전 연봉에서 국민연금(4.5%), 건강보험(3.545%), 장기요양보험(건강보험료의 12.95%), 고용보험(0.9%)과 근로소득세·지방소득세를 공제한 금액이 실수령액입니다.",
  },
  {
    q: "왜 다른 계산기와 금액이 조금 다른가요?",
    a: "소득세는 부양가족 수, 비과세액, 각종 공제 항목에 따라 달라집니다. 본 계산기는 부양가족 본인 1인·비과세 0원을 기본 가정으로 한 추정치이며, 실제 급여명세서는 회사 설정과 연말정산에 따라 차이가 날 수 있습니다.",
  },
  {
    q: "비과세액(식대)은 무엇인가요?",
    a: "식대 등 비과세 급여는 보험료와 세금 부과 대상에서 제외됩니다. 비과세액이 클수록 공제가 줄어 실수령액이 늘어납니다. 계산기 상단에서 직접 입력할 수 있습니다.",
  },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${SITE.name} ${SITE.tagline}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        url: SITE.url,
        description: SITE.description,
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="rounded-2xl bg-gradient-to-b from-indigo-50 to-slate-50 px-6 py-8 text-center ring-1 ring-indigo-100">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          2025년 기준 · 4대보험 자동 반영
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          연봉 실수령액 계산기
        </h1>
        <p className="mt-2 text-slate-600">
          연봉만 입력하면 4대보험·세금을 뺀 <strong>월 실수령액</strong>을 바로 계산해 드립니다.
        </p>
      </section>

      <SalaryCalculator />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/sigeup"
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-indigo-400 hover:shadow-sm"
        >
          <div>
            <div className="font-bold text-slate-900">시급 계산기 →</div>
            <div className="mt-0.5 text-sm text-slate-500">
              주휴수당 포함 월급·실수령액
            </div>
          </div>
          <span className="text-2xl">⏱️</span>
        </Link>
        <Link
          href="/toejikgeum"
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-indigo-400 hover:shadow-sm"
        >
          <div>
            <div className="font-bold text-slate-900">퇴직금 계산기 →</div>
            <div className="mt-0.5 text-sm text-slate-500">
              월급·근속기간으로 퇴직금 계산
            </div>
          </div>
          <span className="text-2xl">💰</span>
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">인기 연봉 실수령액</h2>
        <div className="grid grid-cols-3 gap-2">
          {POPULAR_MANWONS.map((m) => (
            <Link
              key={m}
              href={`/yeonbong/${m}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
            >
              연봉 {formatManwonLabel(m)}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700">
        <h2 className="text-lg font-bold text-slate-900">실수령액이란?</h2>
        <p className="mt-2">
          실수령액은 회사가 지급하기로 한 세전 급여에서 4대보험료와 세금을 공제하고
          실제로 통장에 들어오는 금액입니다. 한국의 근로자는 매월 다음 항목을
          공제받습니다.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li><strong>국민연금</strong>: 기준소득월액의 4.5%</li>
          <li><strong>건강보험</strong>: 보수월액의 3.545%</li>
          <li><strong>장기요양보험</strong>: 건강보험료의 12.95%</li>
          <li><strong>고용보험</strong>: 보수월액의 0.9%</li>
          <li><strong>근로소득세 · 지방소득세</strong>: 소득과 부양가족 수에 따라 결정</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">자주 묻는 질문</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <summary className="cursor-pointer font-medium text-slate-800">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
