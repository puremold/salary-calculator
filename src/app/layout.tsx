import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.tagline} 2025 | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "연봉 실수령액",
    "실수령액 계산기",
    "연봉 계산기",
    "시급 계산기",
    "월급 실수령액",
    "4대보험 계산기",
    "2025 연봉 실수령액",
  ],
  alternates: { canonical: "/" },
  verification: { google: "75RAQW4vbtb36KCLTHYJYKMHibOyvsWyhrUpXEMDmbo" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE.name,
    title: `${SITE.tagline} 2025`,
    description: SITE.description,
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

const NAV = [
  { href: "/", label: "연봉 실수령액" },
  { href: "/sigeup", label: "시급" },
  { href: "/toejikgeum", label: "퇴직금" },
];

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#4f46e5" />
      <rect x="16" y="12" width="32" height="40" rx="5" fill="#ffffff" />
      <rect x="20" y="16" width="24" height="9" rx="2" fill="#c7d2fe" />
      <g fill="#4f46e5">
        <circle cx="24" cy="33" r="2.6" />
        <circle cx="32" cy="33" r="2.6" />
        <circle cx="40" cy="33" r="2.6" />
        <circle cx="24" cy="42" r="2.6" />
        <circle cx="32" cy="42" r="2.6" />
        <rect x="37.4" y="39.4" width="5.2" height="5.2" rx="1.4" />
      </g>
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                {SITE.name}
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-slate-500">
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-indigo-600">
                  {n.label}
                </Link>
              ))}
            </div>
            <p>
              본 계산기의 결과는 2025년 기준 요율로 계산한{" "}
              <strong className="font-medium text-slate-600">추정치</strong>이며,
              실제 급여명세서·연말정산 결과와 다를 수 있습니다. 참고용으로만
              활용하세요.
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} {SITE.name}
            </p>
          </div>
        </footer>

        {SITE.adsenseClient && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
