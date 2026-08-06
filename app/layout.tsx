import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/app/(config)/site";
import { AnalyticsScript, AnalyticsNoscript } from "@/app/(ui)/components/gtm-script";
import { JsonLd } from "@/app/(ui)/components/json-ld";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Urban Service Company — Appliance Repair in Bengaluru",
    template: "%s · Urban Service Company",
  },
  description:
    "Same-day microwave, AC, washing machine, refrigerator, water filter and chimney repair in Bengaluru. Verified technicians, transparent quotes, genuine parts, quality assured. Call to book.",
  keywords: [
    "appliance repair bengaluru",
    "microwave repair bengaluru",
    "microwave repair near me",
    "ac repair bangalore",
    "ac service near me",
    "ac repair near me",
    "washing machine repair bengaluru",
    "washing machine repair near me",
    "refrigerator repair bengaluru",
    "refrigerator repair near me",
    "fridge repair near me",
    "water filter repair bengaluru",
    "water filter repair near me",
    "ro purifier repair bengaluru",
    "chimney repair bengaluru",
    "chimney repair near me",
    "kitchen chimney repair bengaluru",
    "urbanservicecompany",
  ],
  alternates: { canonical: site.url + "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: "Urban Service Company — Appliance Repair in Bengaluru",
    description:
      "Same-day microwave, AC, washing machine, refrigerator, water filter and chimney repair in Bengaluru. Verified technicians, quality assured.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Service Company — Appliance Repair in Bengaluru",
    description:
      "Same-day microwave, AC, washing machine and refrigerator repair in Bengaluru.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Home services",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    other: [
      { rel: "icon", url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d47a1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-on-surface">
        <AnalyticsNoscript />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            logo: `${site.url}/favicon-192x192.png`,
            description:
              "Same-day microwave, AC, washing machine, refrigerator, water filter and chimney repair in Bengaluru. Verified technicians, genuine parts, quality assured.",
            address: {
              "@type": "PostalAddress",
              streetAddress: site.address.streetAddress,
              addressLocality: site.address.addressLocality,
              addressRegion: site.address.addressRegion,
              postalCode: site.address.postalCode,
              addressCountry: site.address.addressCountry,
            },
            telephone: site.phone,
            email: site.email,
            sameAs: [],
          }}
        />
        {children}
        <AnalyticsScript />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
