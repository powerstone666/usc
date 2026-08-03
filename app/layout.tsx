import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { site } from "@/app/(config)/site";
import { Header } from "@/app/(ui)/components/header";
import { Footer } from "@/app/(ui)/components/footer";
import { CallBar } from "@/app/(ui)/components/call-bar";
import { FloatingCall } from "@/app/(ui)/components/floating-call";
import { DiagnosticProvider } from "@/app/(ui)/components/diagnostic-provider";

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
    "Same-day microwave, AC, washing machine and refrigerator repair in Bengaluru. Verified technicians, transparent quotes, quality assured. Call to book.",
  keywords: [
    "appliance repair bengaluru",
    "microwave repair bengaluru",
    "ac repair bangalore",
    "washing machine repair bengaluru",
    "refrigerator repair bengaluru",
    "urbanservicecompany",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: "Urban Service Company — Appliance Repair in Bengaluru",
    description:
      "Same-day microwave, AC, washing machine and refrigerator repair in Bengaluru. Verified technicians, quality assured.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Service Company — Appliance Repair in Bengaluru",
    description:
      "Same-day microwave, AC, washing machine and refrigerator repair in Bengaluru.",
  },
  robots: { index: true, follow: true },
  category: "Home services",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1c6ef6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-on-surface">
        <DiagnosticProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CallBar />
          <FloatingCall />
        </DiagnosticProvider>
      </body>
    </html>
  );
}
