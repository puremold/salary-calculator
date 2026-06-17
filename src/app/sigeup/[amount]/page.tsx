import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreakdownTable } from "@/components/BreakdownTable";
import { computeHourly } from "@/lib/hourly";
import { formatKRW } from "@/lib/salary";
import {
  MAX_WAGE,
  MIN_WAGE,
  PAGE_WAGES,
  POPULAR_WAGES,
} from "@/lib/hourlyData";
import { SITE } from "@/lib/site";

export const dynamicParams = true;

export function generateStaticParams() {
  return PAGE_WAGES.map((w) => ({ amount: String(w) }));
}

function parseWage(amount: string): number | null {
  if (!/^\d+$/.test(amount)) return null;
  const w = Number(amount);
  if (!Number.isInteger(w) || w < MIN_WAGE || w > MAX_WAGE) return null;
  return w;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const w = parseWage(amount);
  if (w === null) return {};
  const r = computeHourly(w);
  const title = `시급 ${formatKRW(w)}원 월급·실수령액 (월 ${formatKRW(
    r.salary.monthlyNet,
  )}원)`;
  const description = `시급 ${formatKRW(
    w,
  )}원이면 주휴수당 포함 세전 월급 약 ${formatKRW(
    r.salary.monthlyGross,
  )}원, 실수령 약 ${formatKRW(
    r.salary.monthlyNet,
  )}원입니다. 연봉 환산과 4대보험·세금 공제 내역을 확인하세요.`;
  const url = `${SITE.url}/sigeup/${w}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", locale: "ko_KR" },
  };
}

export default async function SigeupPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const w = parseWage(amount);
  if (w === null) notFound();

  const r = computeHourly(w);
  const b = r.salary;

  const wages = PAGE_WAGES;
  const idx = wages.indexOf(w);
  const prev = idx > 0 ? wages[idx - 1] : null;
  const next = idx >= 0 && idx < wages.length - 1 ? wages[idx + 1] : null;

  const faq = [
    {
      q: `시급 ${formatKRW(w)}원이면 월급은 얼마인가요?`,
      a: `주 40시간(월 ${r.monthlyPaidHours}시간, 주휴수당 포함) 기준 세전 월급은 약 ${formatKRW(
        b.monthlyGross,
      )}원, 실수령액은 약 ${formatKRW(b.monthlyNet)}원입니다.`,
    },
    {
      q: `시급 ${formatKRW(w)}원의 연봉은 얼마인가요?`,
      a: `연봉으로 환산하면 약 ${formatKRW(b.annualGross)}원이며, 연 실수령은 약 ${formatKRW(
        b.annualNet,
      )}원입니다.`,
    },
    {
      q: `시급 ${formatKRW(w)}원의 주휴수당은 얼마인가요?`,
      a: `주 40시간 근무 기준 월 주휴수당은 약 ${formatKRW(
        r.monthlyHolidayPay,
      )}원이 포함되어 있습니다.`,
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
            name: "시급 계산기",
            item: `${SITE.url}/sigeup`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `시급 ${formatKRW(w)}원`,
            item: `${SITE.url}/sigeup/${w}`,
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
        <Link href="/sigeup" className="hover:text-indigo-600">
          시급 계산기
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-700">시급 {formatKRW(w)}원</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          시급 {formatKRW(w)}원 월급·실수령액
        </h1>
        <p className="mt-2 text-slate-600">
          2025년 기준, 주 40시간(주휴수당 포함) 근무 시 월급과 실수령액입니다.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-indigo-600 px-5 py-4 text-white">
          <div className="text-sm text-indigo-100">월 실수령액</div>
          <div className="mt-0.5 text-2xl font-bold tabular-nums sm:text-3xl">
            {formatKRW(b.monthlyNet)}원
          </div>
        </div>
        <div className="rounded-2xl bg-slate-100 px-5 py-4">
          <div className="text-sm text-slate-500">세전 월급</div>
          <div className="mt-0.5 text-2xl font-bold tabular-nums text-slate-800 sm:text-3xl">
            {formatKRW(b.monthlyGross)}원
          </div>
        </div>
      </section>

      <dl className="grid grid-cols-3 gap-x-4 gap-y-1 rounded-xl bg-slate-50 px-4 py-3 text-sm">
        <div className="flex flex-col">
          <dt className="text-slate-500">월 환산시간</dt>
          <dd className="font-medium tabular-nums text-slate-800">
            {r.monthlyPaidHours}시간
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-slate-500">월 주휴수당</dt>
          <dd className="font-medium tabular-nums text-slate-800">
            {formatKRW(r.monthlyHolidayPay)}원
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-slate-500">연봉 환산</dt>
          <dd className="font-medium tabular-nums text-slate-800">
            {formatKRW(b.annualGross)}원
          </dd>
        </div>
      </dl>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">월 공제 내역</h2>
        <BreakdownTable b={b} />
        <p className="mt-2 text-xs text-slate-400">
          ※ 주 40시간·부양가족 본인 1인·비과세 0원 기준 추정치입니다. 근로시간을
          바꿔 계산하려면{" "}
          <Link href="/sigeup" className="text-indigo-500 hover:underline">
            시급 계산기
          </Link>
          를 이용하세요.
        </p>
      </section>

      <section className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/sigeup/${prev}`}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
          >
            ← 시급 {formatKRW(prev)}원
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/sigeup/${next}`}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
          >
            시급 {formatKRW(next)}원 →
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
        <h2 className="mb-3 text-lg font-bold text-slate-900">다른 시급도 확인하기</h2>
        <div className="grid grid-cols-3 gap-2">
          {POPULAR_WAGES.filter((p) => p !== w).map((p) => (
            <Link
              key={p}
              href={`/sigeup/${p}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
            >
              시급 {formatKRW(p)}원
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
