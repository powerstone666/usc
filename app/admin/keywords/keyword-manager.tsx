"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Overview, SyncResult } from "@/app/(server-lib)/keyword-sync";
import { applianceLabels } from "@/app/(server-lib)/admin-insights";
import { DiscoveryPing } from "@/app/(ui)/components/discovery-ping";
import { site } from "@/app/(config)/site";
import { Pagination } from "../_ui/pagination";
import { fmtDateTime, plural, timeAgo } from "../_ui/format";
import { EmptyNote, Panel, StatCard } from "../_ui/parts";

const field = "min-h-11 w-full rounded-xl border border-outline bg-background px-3 text-base text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";
const SOURCE_LABEL = { autocomplete: "Google autocomplete", search_console: "Search Console", manual: "Added by you" } as const;

export function KeywordManager({ overview: o }: { overview: Overview }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [query, setQuery] = useState("");
  const [autoAdded, setAutoAdded] = useState(0);
  const onAuto = useCallback((added: number) => {
    if (added > 0) {
      setAutoAdded(added);
      router.refresh();
    }
  }, [router]);

  async function post(url: string, body?: object): Promise<{ ok: boolean; error?: string } & Record<string, unknown>> {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
    return res.json().catch(() => ({ ok: false, error: "Unexpected response from the server." }));
  }

  async function run() {
    setBusy("run");
    setResult(null);
    setMessage(null);
    setResult((await post("/api/admin/keywords/sync")) as unknown as SyncResult);
    setBusy(null);
    router.refresh();
  }

  async function toggle(slug: string, published: boolean) {
    setBusy(slug);
    setMessage(null);
    const r = await post("/api/admin/keywords/publish", { slug, published });
    if (!r.ok) setMessage({ ok: false, text: r.error ?? "Could not update." });
    setBusy(null);
    router.refresh();
  }

  async function add() {
    setBusy("add");
    setMessage(null);
    const r = await post("/api/admin/keywords/add", { query });
    setMessage(r.ok ? { ok: true, text: "Added and published." } : { ok: false, text: r.error ?? "Could not add." });
    if (r.ok) setQuery("");
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <DiscoveryPing onResult={onAuto} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Published pages" value={o.published} />
        <StatCard label="Unpublished" value={o.unpublished} />
        <StatCard label="Last new page" value={o.lastDiscoveredAt ? timeAgo(o.lastDiscoveredAt) : "Never"} />
        <StatCard label="Sources" value={o.gscConfigured ? "2 of 2" : o.suggestEnabled ? "1 of 2" : "0 of 2"} note={`Autocomplete ${o.suggestEnabled ? "on" : "off"} · Search Console ${o.gscConfigured ? "connected" : "not connected"}`} />
      </div>

      {autoAdded > 0 && (
        <div role="status" className="rounded-xl bg-success/10 p-4 text-sm font-bold text-on-surface">
          Discovery ran automatically as you opened this page: {plural(autoAdded, "new page")} published (see the top of the list below).
        </div>
      )}

      <Panel title="Find keywords now" hint="This also happens by itself, at most once a day. Use the button to check right away.">
        <button type="button" onClick={run} disabled={!o.tableReady || busy !== null} aria-busy={busy === "run"} className="btn-zoom min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
          {busy === "run" ? "Looking for keywords…" : "Find and publish keywords"}
        </button>
        {result && (
          <div role="status" className={`mt-4 rounded-xl p-4 text-sm ${result.ok ? "bg-success/10 text-on-surface" : "bg-error/10 text-on-surface"}`}>
            {result.ok ? (
              <>
                <p className="font-bold">Checked {plural(result.fetched, "search phrase")} — {result.added === 0 ? "nothing new to publish" : `${plural(result.added, "page")} published`}.</p>
                {result.pages.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {result.pages.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/topics/${p.slug}`} target="_blank" className="font-bold text-primary hover:underline">{site.url.replace(/^https?:\/\//, "")}/topics/{p.slug}</Link>
                        <span className="text-on-surface-variant"> · {SOURCE_LABEL[p.source]}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {result.skipped.length > 0 && <p className="mt-2 text-on-surface-variant">Skipped: {result.skipped.map((s) => `${s.count} ${s.reason}`).join(" · ")}.</p>}
              </>
            ) : (
              <p className="font-bold text-error">{result.error}</p>
            )}
            {result.notes.map((n) => <p key={n} className="mt-1 text-on-surface-variant">{n}</p>)}
          </div>
        )}
      </Panel>

      <Panel title="Add one yourself" hint="A search phrase such as “microwave turntable not rotating”. It goes live straight away.">
        <form onSubmit={(e) => { e.preventDefault(); void add(); }} className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Search phrase</span>
            <input className={field} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. washing machine door not opening" maxLength={100} />
          </label>
          <button type="submit" disabled={!o.tableReady || busy !== null || query.trim().length < 4} className="btn-zoom min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
            {busy === "add" ? "Adding…" : "Add page"}
          </button>
        </form>
        {message && <p role="status" className={`mt-3 text-sm font-bold ${message.ok ? "text-success" : "text-error"}`}>{message.text}</p>}
      </Panel>

      <Panel title="Keyword pages" hint="Newest first. Each one lives at /topics/ followed by its name.">
        {o.items.length === 0 ? (
          <EmptyNote>No keyword pages yet. They appear here after discovery runs.</EmptyNote>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {o.items.map((k) => {
              const live = k.status === "approved";
              return (
                <li key={k.slug} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-bold text-on-surface">
                      {k.title}
                      {!live && <span className="ml-2 rounded-full bg-surface-variant px-2 py-0.5 text-xs font-bold text-muted">Unpublished</span>}
                    </p>
                    <p className="break-all text-sm text-on-surface-variant">
                      {live ? (
                        <Link href={`/topics/${k.slug}`} target="_blank" className="font-semibold text-primary hover:underline">{site.url.replace(/^https?:\/\//, "")}/topics/{k.slug}</Link>
                      ) : (
                        `/topics/${k.slug}`
                      )}
                    </p>
                    <p className="text-sm text-muted">
                      {applianceLabels[k.service] ?? k.service} · {SOURCE_LABEL[k.source]}
                      {k.source === "search_console" ? ` · ${plural(k.impressions, "impression")}` : ""} · <span title={fmtDateTime(k.discoveredAt)}>{timeAgo(k.discoveredAt)}</span>
                    </p>
                  </div>
                  <button type="button" onClick={() => toggle(k.slug, !live)} disabled={busy !== null} className="min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold text-primary ring-1 ring-outline hover:bg-surface-variant disabled:opacity-50">
                    {busy === k.slug ? "Saving…" : live ? "Unpublish" : "Publish again"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
      <Pagination page={o.page} pages={o.pages} total={o.published + o.unpublished} pageSize={o.pageSize} hrefFor={(p) => `/admin/keywords?page=${p}`} noun="keyword pages" />
    </div>
  );
}
