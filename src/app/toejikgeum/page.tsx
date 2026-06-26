import type { Metadata } from "next";
import Link from "next/link";
import { SeveranceCalculator } from "@/components/SeveranceCalculator";
import { POPULAR_MONTHLY_MANWONS } from "@/lib/severanceData";
import { formatManwonLabel } from "@/lib/salary";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "퇴직금 계산기 2025 (평균임금·근속기간으로 자동 계산)",
  description:
    "월급과 근속기간만 입력하면 퇴직금을 자동 계산합니다. 1일 평균임금·총 재직일수까지 한눈에. 근로자퇴직급여보장법 기준 세전 추정.",
  alternates: { canonical: "/toejikgeum" },
};

const FAQ = [
  {
    q: "퇴직금은 어떻게 계산하나요?",
    a: "퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 ÷ 365)로 계산합니다. 1일 평균임금은 퇴직 전 3개월 임금총액을 그 기간의 총일수로 나눈 값입니다.",
  },
  {
    q: "퇴직금은 언제부터 받을 수 있나요?",
    a: "1년 이상 계속 근로하고 4주 평균 주 15시간 이상 일한 근로자라면 퇴직 시 퇴직금을 받을 수 있습니다. 계속근로기간 1년에 대해 30일분 이상의 평균임금이 지급됩니다.",
  },
  {
    q: "상여금과 연차수당도 퇴직금에 포함되나요?",
    a: "네. 연간 상여금과 연차수당은 3/12(3개월분)만큼 평균임금 산정에 포함됩니다. 계산기 상단에서 직접 입력할 수 있습니다.",
  },
];

export default function ToejikgeumHome() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${SITE.name} 퇴직금 계산기`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        url: `${SITE.url}/toejikgeum`,
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
          퇴직금 계산기 2025
        </h1>
        <p className="mt-2 text-slate-600">
          월급과 근속기간만 입력하면 <strong>퇴직금</strong>을 바로 계산해 드립니다.
        </p>
      </section>

      <SeveranceCalculator />

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">월급별 퇴직금</h2>
        <div className="grid grid-cols-3 gap-2">
          {POPULAR_MONTHLY_MANWONS.map((m) => (
            <Link
              key={m}
              href={`/toejikgeum/${m}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
            >
              월급 {formatManwonLabel(m)}
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
