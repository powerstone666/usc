import { Header } from "@/app/(ui)/components/header";
import { Footer } from "@/app/(ui)/components/footer";
import { CallBar } from "@/app/(ui)/components/call-bar";
import { DiagnosticProvider } from "@/app/(ui)/components/diagnostic-provider";
import { PageViewTracker } from "@/app/(ui)/components/page-view-tracker";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DiagnosticProvider>
      <PageViewTracker />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CallBar />
    </DiagnosticProvider>
  );
}
