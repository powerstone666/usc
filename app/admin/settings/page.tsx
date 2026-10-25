export const dynamic = "force-dynamic";

import Link from "next/link";
import { isDemo } from "@/app/(server-lib)/admin-data";
import { PageHeader, Panel } from "../_ui/parts";
import { ConnectionTester } from "../test/connection-tester";
import { DataTools } from "./data-tools";

export default function AdminSettings() {
  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle="Check that tracking and integrations work, and clean up test data." />
      <Panel title="Keyword pages" hint="Review real Google searches that could become their own pages. Kept separate from your main pages.">
        <Link href="/admin/keywords" className="btn-tonal">Open keyword pages</Link>
      </Panel>
      <Panel title="Connection checks" hint="Confirms analytics, the database, lead alerts and tracking are all working.">
        <ConnectionTester />
      </Panel>
      <Panel title="Test traffic" hint="Visits from localhost and dev servers are hidden from every screen by default. Add ?test=1 to a screen's address to include them.">
        <p className="text-sm text-on-surface-variant">If you tested the live database, the tools below remove that data. They cannot be undone.</p>
      </Panel>
      <Panel title="Data tools">
        <DataTools demo={isDemo()} />
      </Panel>
    </div>
  );
}
