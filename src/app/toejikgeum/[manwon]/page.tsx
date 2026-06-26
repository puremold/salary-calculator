import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { severanceForYears } from "@/lib/severance";
import { formatKRW, formatManwonLabel, manwonToWon } from "@/lib/salary";
import {
  MAX_MONTHLY_MANWON,
  MIN_MONTHLY_MANWON,
  PAGE_MONTHLY_MANWONS,
  POPULAR_MONTHLY_MANWONS,
  SERVICE_YEARS_TABLE,
} from "@/lib/severanceData";
import { SITE } from "@/lib/site";

export const dynamicParams = true;

export function generateStaticParams() {
  return PAGE_MONTHLY_MANWONS.map((m) => ({ manwon: String(m) }));
}

function parseManwon(manwon: string): number | null {
  if (!/^\d+$/.test(manwon)) return null;
  const m = Number(manwon);
  if (!Number.isInteger(m) || m < MIN_MONTHLY_MANWON || m > MAX_MONTHLY_MANWON)
    return null;
  return m;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manwon: string }>;
}): Promise<Metadata> {
  const { manwon } = await params;
  const m = parseManwon(manwon);
  if (m === null) return {};
  const wage = manwonToWon(m);
  const label = formatManwonLabel(m);
  const y3 = severanceForYears(wage, 3);
  const title = `월급 ${label} 퇴직금 (3년 근속 ${formatKRW(y3)}원)`;
  const description = `월급 ${label}일 때 근속연수별 퇴직금을 계산했습니다. 3년 근속 시 약 ${formatKRW(
    y3,
  )}원. 1·2·3·5·10·20년 근속 퇴직금을 한눈에 확인하세요.`;
  const url = `${SITE.url}/toejikgeum/${m}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", locale: "ko_KR" },
  };
}

export default async function ToejikgeumPage({
  params,
}: {
  params: Promise<{ manwon: string }>;
}) {
  const { manwon } = await params;
  const m = parseManwon(manwon);
  if (m === null) notFound();

  const wage = manwonToWon(m);
  const label = formatManwonLabel(m);
  const rows = SERVICE_YEARS_TABLE.map((y) => ({
    years: y,
    pay: severanceForYears(wage, y),
  }));

  const idx = PAGE_MONTHLY_MANWONS.indexOf(m);
  const prev = idx > 0 ? PAGE_MONTHLY_MANWONS[idx - 1] : null;
  const next =
    idx >= 0 && idx < PAGE_MONTHLY_MANWONS.length - 1
      ? PAGE_MONTHLY_MANWONS[idx + 1]
      : null;

  const pay3 = severanceForYears(wage, 3);
  const pay5 = severanceForYears(wage, 5);
  const pay10 = severanceForYears(wage, 10);

  const faq = [
    {
      q: `월급 ${label}이면 3년 근속 퇴직금은 얼마인가요?`,
      a: `월급 ${label} 기준 3년 근속 시 퇴직금은 약 ${formatKRW(
        pay3,
      )}원입니다. (상여·연차 미포함 세전 추정치)`,
    },
    {
      q: `월급 ${label}, 5년·10년 근속 퇴직금은?`,
      a: `5년 근속 약 ${formatKRW(pay5)}원, 10년 근속 약 ${formatKRW(
        pay10,
      )}원입니다. 퇴직금은 근속연수에 거의 비례합니다.`,
    },
    {
      q: `퇴직금은 어떻게 계산되나요?`,
      a: `퇴직금 = 1일 평균임금 × 30 × (재직일수 ÷ 365)입니다. 월급 ${label}의 1일 평균임금은 약 ${formatKRW(
        Math.round((wage * 3) / (365 / 4)),
      )}원입니다.`,
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
            name: "퇴직금 계산기",
            item: `${SITE.url}/toejikgeum`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `월급 ${label} 퇴직금`,
            item: `${SITE.url}/toejikgeum/${m}`,
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
        <Link href="/toejikgeum" className="hover:text-indigo-600">
          퇴직금 계산기
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-700">월급 {label} 퇴직금</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          월급 {label} 퇴직금
        </h1>
        <p className="mt-2 text-slate-600">
          월급 {label} 기준, 근속연수별 예상 퇴직금(세전)입니다.
        </p>
      </header>

      <section className="rounded-2xl bg-indigo-600 px-6 py-5 text-white">
        <div className="text-sm text-indigo-100">3년 근속 시 예상 퇴직금</div>
        <div className="mt-0.5 text-4xl font-bold tabular-nums">
          {formatKRW(pay3)}원
        </div>
        <div className="mt-1 text-sm text-indigo-100">
          5년 {formatKRW(pay5)}원 · 10년 {formatKRW(pay10)}원
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">근속연수별 퇴직금</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="px-4 py-2.5 text-left font-medium">근속기간</th>
                <th className="px-4 py-2.5 text-right font-medium">예상 퇴직금</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.years} className="bg-white">
                  <td className="px-4 py-2.5 text-slate-600">{r.years}년</td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-900">
                    {formatKRW(r.pay)}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          ※ 상여·연차 미포함 세전 추정치입니다. 상여금·연차수당을 반영하려면{" "}
          <Link href="/toejikgeum" className="text-indigo-500 hover:underline">
            퇴직금 계산기
          </Link>
          를 이용하세요.
        </p>
      </section>

      <section className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/toejikgeum/${prev}`}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
          >
            ← 월급 {formatManwonLabel(prev)}
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/toejikgeum/${next}`}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
          >
            월급 {formatManwonLabel(next)} →
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
        <h2 className="mb-3 text-lg font-bold text-slate-900">다른 월급도 확인하기</h2>
        <div className="grid grid-cols-3 gap-2">
          {POPULAR_MONTHLY_MANWONS.filter((p) => p !== m).map((p) => (
            <Link
              key={p}
              href={`/toejikgeum/${p}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
            >
              월급 {formatManwonLabel(p)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
