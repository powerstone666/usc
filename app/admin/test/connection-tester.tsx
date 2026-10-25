"use client";

import { useState } from "react";

type Status = "idle" | "testing" | "ok" | "fail";
type Result = { name: string; status: Status; detail: string; latency?: string; debug?: Record<string, unknown>; hint?: string };

const tests: { name: string; endpoint: string }[] = [
  { name: "GTM / GA4", endpoint: "/api/admin/test/gtm" },
  { name: "Supabase connection", endpoint: "/api/admin/test/bigquery" },
  { name: "Supabase tables", endpoint: "/api/admin/test/table" },
  { name: "Lead API", endpoint: "/api/admin/test/lead-api" },
  { name: "IP geolocation", endpoint: "/api/admin/test/geo" },
  { name: "User-agent parser", endpoint: "/api/admin/test/ua" },
  { name: "Admin auth", endpoint: "/api/admin/test/auth" },
  { name: "Traffic source detection", endpoint: "/api/admin/test/traffic" },
  { name: "Telegram bot", endpoint: "/api/admin/test/telegram" },
];

const dot: Record<Status, string> = { idle: "bg-outline", testing: "bg-warning animate-pulse", ok: "bg-success", fail: "bg-error" };

export function ConnectionTester() {
  const [results, setResults] = useState<Result[]>(tests.map((t) => ({ name: t.name, status: "idle", detail: "" })));
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function runAll() {
    setRunning(true);
    setExpanded(null);
    setResults(tests.map((t) => ({ name: t.name, status: "testing", detail: "" })));
    const settled = await Promise.all(
      tests.map(async (t): Promise<Result> => {
        const start = Date.now();
        try {
          const data = await (await fetch(t.endpoint)).json();
          return { name: t.name, status: data.ok ? "ok" : "fail", detail: data.detail || data.error || "OK", latency: `${Date.now() - start} ms`, debug: data.debug, hint: data.hint };
        } catch (err) {
          return { name: t.name, status: "fail", detail: err instanceof Error ? err.message : "Request failed", latency: `${Date.now() - start} ms` };
        }
      }),
    );
    setResults(settled);
    setRunning(false);
  }

  return (
    <div className="space-y-3">
      <button type="button" onClick={runAll} disabled={running} aria-busy={running} className="btn-zoom min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60">
        {running ? "Testing…" : "Run all checks"}
      </button>
      <ul className="space-y-2">
        {results.map((r, i) => {
          const more = Boolean(r.debug || r.hint);
          return (
            <li key={r.name} className="rounded-xl border border-outline-variant">
              <button type="button" disabled={!more} onClick={() => setExpanded(expanded === i ? null : i)} aria-expanded={more ? expanded === i : undefined} className="flex w-full items-center gap-3 p-3 text-left disabled:cursor-default">
                <span className={`h-3 w-3 shrink-0 rounded-full ${dot[r.status]}`} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-on-surface">{r.name}</span>
                  <span className={`block break-words text-sm ${r.status === "fail" ? "text-error" : "text-on-surface-variant"}`}>
                    {r.status === "idle" ? "Not checked yet" : r.status === "testing" ? "Checking…" : r.status === "fail" ? `Failed: ${r.detail}` : r.detail}
                  </span>
                </span>
                {r.latency && <span className="shrink-0 font-mono text-sm text-muted">{r.latency}</span>}
              </button>
              {expanded === i && more && (
                <div className="border-t border-outline-variant bg-surface-variant/60 p-3">
                  {r.hint && <p className="mb-2 text-sm font-bold text-on-surface">Hint: {r.hint}</p>}
                  {r.debug && <pre className="overflow-x-auto text-sm leading-relaxed text-on-surface-variant"><code>{JSON.stringify(r.debug, null, 2)}</code></pre>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
