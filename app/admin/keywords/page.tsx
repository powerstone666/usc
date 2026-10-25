export const dynamic = "force-dynamic";

import Link from "next/link";
import { getOverview } from "@/app/(server-lib)/keyword-sync";
import { Banner, PageHeader, Panel } from "../_ui/parts";
import { KeywordManager } from "./keyword-manager";

export default async function AdminKeywords({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const o = await getOverview(parseInt(sp.page ?? "1", 10) || 1);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Keyword pages"
        subtitle="New keyword pages are found and published automatically. They live under /topics/, so your main pages are never changed."
        right={<Link href="/admin/settings" className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-primary hover:underline">Back to settings</Link>}
      />
      {o.demo && <Banner tone="info"><strong>Demo data.</strong> Sample keywords for previewing this screen. Nothing here touches your real database.</Banner>}
      {o.error && <Banner tone="warn"><strong>Could not load keywords:</strong> {o.error}</Banner>}
      {!o.tableReady && (
        <Banner tone="warn">
          <strong>One setup step left.</strong> Open the Supabase SQL editor and run the <em>Keyword discovery</em> section at the end of <code className="rounded bg-surface-variant px-1.5 py-0.5 text-sm">supabase-schema.sql</code>. Until then nothing can be saved.
        </Banner>
      )}

      <KeywordManager overview={o} />

      <Panel title="How it works">
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-on-surface-variant">
          <li><strong>Google autocomplete</strong> needs no key. It reads the phrases Google suggests after words like “microwave not heating”, so these are real searches people type.</li>
          <li><strong>Search Console</strong> is optional. Connect it (see <code className="rounded bg-surface-variant px-1.5 py-0.5">.env.local.example</code>) to also use searches that already show your site.</li>
          <li>Discovery runs on its own, at most once a day, when this screen or a topic page is opened. Up to 10 new pages are published per run, with a limit of 300 pages in total.</li>
          <li>Skipped automatically: other cities, jobs and DIY, competitor names, “official service centre” wording, brands and areas that already have a page, and anything without repair intent.</li>
          <li>Unpublish removes a page and keeps that keyword from coming back. New pages join <code className="rounded bg-surface-variant px-1.5 py-0.5">/sitemap-topics.xml</code> within moments.</li>
        </ul>
      </Panel>
    </div>
  );
}
