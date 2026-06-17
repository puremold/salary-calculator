import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreakdownTable } from "@/components/BreakdownTable";
import {
  computeSalary,
  formatKRW,
  formatManwonLabel,
  manwonToWon,
} from "@/lib/salary";
import {
  MAX_MANWON,
  MIN_MANWON,
  PAGE_MANWONS,
  POPULAR_MANWONS,
} from "@/lib/salaryData";
import { SITE } from "@/lib/site";

// 목록에 없는 연봉도 허용 범위 안이면 요청 시 생성 후 캐시 (long-tail SEO)
export const dynamicParams = true;

export function generateStaticParams() {
  return PAGE_MANWONS.map((m) => ({ amount: String(m) }));
}

function parseAmount(amount: string): number | null {
  if (!/^\d+$/.test(amount)) return null;
  const m = Number(amount);
  if (!Number.isInteger(m) || m < MIN_MANWON || m > MAX_MANWON) return null;
  return m;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const m = parseAmount(amount);
  if (m === null) return {};
  const b = computeSalary(manwonToWon(m));
  const label = formatManwonLabel(m);
  const title = `연봉 ${label} 실수령액 (월 ${formatKRW(b.monthlyNet)}원)`;
  const description = `연봉 ${label}의 월 실수령액은 약 ${formatKRW(
    b.monthlyNet,
  )}원, 연 ${formatKRW(
    b.annualNet,
  )}원입니다. 국민연금·건강보험·장기요양·고용보험·소득세 공제 내역을 2025년 기준으로 확인하세요.`;
  const url = `${SITE.url}/yeonbong/${m}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", locale: "ko_KR" },
  };
}

export default async function YeonbongPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const m = parseAmount(amount);
  if (m === null) notFound();

  const b = computeSalary(manwonToWon(m));
  const label = formatManwonLabel(m);

  const prev = m - 100 >= MIN_MANWON ? m - 100 : null;
  const next = m + 100 <= MAX_MANWON ? m + 100 : null;

  const faq = [
    {
      q: `연봉 ${label} 실수령액은 얼마인가요?`,
      a: `연봉 ${label}의 월 실수령액은 약 ${formatKRW(
        b.monthlyNet,
      )}원, 연 환산 약 ${formatKRW(
        b.annualNet,
      )}원입니다. (부양가족 본인 1인, 비과세 0원 기준 추정치)`,
    },
    {
      q: `연봉 ${label}일 때 4대보험은 얼마나 떼나요?`,
      a: `국민연금 ${formatKRW(b.nationalPension)}원, 건강보험 ${formatKRW(
        b.healthInsurance,
      )}원, 장기요양보험 ${formatKRW(b.longTermCare)}원, 고용보험 ${formatKRW(
        b.employment,
      )}원이 매월 공제됩니다.`,
    },
    {
      q: `연봉 ${label}의 월급(세전)은 얼마인가요?`,
      a: `연봉을 12개월로 나눈 세전 월급은 약 ${formatKRW(
        b.monthlyGross,
      )}원입니다. 여기서 공제 합계 ${formatKRW(
        b.totalDeduction,
      )}원을 빼면 실수령액이 됩니다.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: SITE.url },
          {
            "@type": "ListItem",
            position: 2,
            name: `연봉 ${label} 실수령액`,
            item: `${SITE.url}/yeonbong/${m}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="space-y-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-indigo-600">
          홈
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-700">연봉 {label} 실수령액</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          연봉 {label} 실수령액
        </h1>
        <p className="mt-2 text-slate-600">
          2025년 기준, 연봉 {label}의 월 실수령액과 4대보험·세금 공제 내역입니다.
        </p>
      </header>

      <section className="rounded-2xl bg-indigo-600 px-6 py-5 text-white">
        <div className="text-sm text-indigo-100">월 실수령액</div>
        <div className="mt-0.5 text-4xl font-bold tabular-nums">
          {formatKRW(b.monthlyNet)}원
        </div>
        <div className="mt-1 text-sm text-indigo-100">
          연 실수령 약 {formatKRW(b.annualNet)}원 · 세전 월급 {formatKRW(b.monthlyGross)}원
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">월 공제 내역</h2>
        <BreakdownTable b={b} />
        <p className="mt-2 text-xs text-slate-400">
          ※ 부양가족 본인 1인, 비과세 0원 기준 추정치입니다. 부양가족·비과세액을 바꿔
          계산하려면{" "}
          <Link href="/" className="text-indigo-500 hover:underline">
            홈 계산기
          </Link>
          를 이용하세요.
        </p>
      </section>

      <section className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/yeonbong/${prev}`}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
          >
            ← 연봉 {formatManwonLabel(prev)}
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/yeonbong/${next}`}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
          >
            연봉 {formatManwonLabel(next)} →
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">자주 묻는 질문</h2>
        <div className="space-y-3">
          {faq.map((f) => (
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

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">다른 연봉도 확인하기</h2>
        <div className="grid grid-cols-3 gap-2">
          {POPULAR_MANWONS.filter((p) => p !== m).map((p) => (
            <Link
              key={p}
              href={`/yeonbong/${p}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
            >
              연봉 {formatManwonLabel(p)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
