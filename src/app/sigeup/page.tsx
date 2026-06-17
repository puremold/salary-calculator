import type { Metadata } from "next";
import Link from "next/link";
import { HourlyCalculator } from "@/components/HourlyCalculator";
import { POPULAR_WAGES, MINIMUM_WAGE_2025 } from "@/lib/hourlyData";
import { formatKRW } from "@/lib/salary";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "시급 계산기 2025 (월급·주휴수당·실수령액)",
  description:
    "시급을 입력하면 주휴수당 포함 월급, 연봉 환산, 4대보험·세금을 뺀 실수령액까지 한 번에 계산합니다. 2025년 최저시급 10,030원 기준.",
  alternates: { canonical: "/sigeup" },
};

const FAQ = [
  {
    q: "시급으로 월급을 어떻게 계산하나요?",
    a: "주 40시간 근무 시 주휴수당을 포함하면 월 환산 근로시간은 약 209시간입니다. 시급 × 209시간이 세전 월급이 됩니다.",
  },
  {
    q: "주휴수당은 언제 받나요?",
    a: "주 15시간 이상 근무하고 소정근로일을 개근하면 주휴수당이 발생합니다. 주 40시간 기준 주 8시간분의 유급휴일 수당이 추가됩니다.",
  },
  {
    q: "2025년 최저시급은 얼마인가요?",
    a: `2025년 최저시급은 ${formatKRW(MINIMUM_WAGE_2025)}원입니다. 주 40시간(월 209시간) 기준 월 환산 최저임금은 약 ${formatKRW(MINIMUM_WAGE_2025 * 209)}원입니다.`,
  },
];

export default function SigeupHome() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${SITE.name} 시급 계산기`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        url: `${SITE.url}/sigeup`,
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

      <section className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          시급 계산기 2025
        </h1>
        <p className="mt-2 text-slate-600">
          시급만 입력하면 <strong>주휴수당 포함 월급</strong>과 4대보험·세금을 뺀{" "}
          <strong>실수령액</strong>을 바로 계산해 드립니다.
        </p>
      </section>

      <HourlyCalculator />

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">인기 시급 계산</h2>
        <div className="grid grid-cols-3 gap-2">
          {POPULAR_WAGES.map((w) => (
            <Link
              key={w}
              href={`/sigeup/${w}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
            >
              시급 {formatKRW(w)}원
            </Link>
          ))}
        </div>
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
