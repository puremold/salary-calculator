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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                계
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                {SITE.name}
              </span>
            </Link>
            <span className="text-sm text-slate-500">{SITE.tagline}</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-slate-500">
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
