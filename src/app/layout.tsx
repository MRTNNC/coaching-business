import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arzuno-coaching.com";
const siteName = "Arzuno Coaching";
const defaultDescription =
  "1:1 online coaching for working professionals and aspiring bodybuilders — personalised training plans, nutrition guidance, and weekly check-ins that fit around your life.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — 1:1 Online Fitness & Nutrition Coaching`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — 1:1 Online Fitness & Nutrition Coaching`,
    description: defaultDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — 1:1 Online Fitness & Nutrition Coaching`,
    description: defaultDescription,
  },
  verification: {
    google: "Bl0yxtk5KOS32WQi2PgMKFaHRGkhtT8zJnaw4b3ADIA",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  description: defaultDescription,
  email: "m.cull@arzuno.co.uk",
  areaServed: "GB",
  founder: {
    "@type": "Person",
    name: "Martin Cull",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
