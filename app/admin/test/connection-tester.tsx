"use client";

import { useState } from "react";

type Status = "idle" | "testing" | "ok" | "fail";

type Result = {
  name: string;
  status: Status;
  detail: string;
  latency?: string;
  debug?: Record<string, unknown>;
  hint?: string;
};

const tests: { name: string; endpoint: string }[] = [
  { name: "GTM / GA4", endpoint: "/api/admin/test/gtm" },
  { name: "Supabase Connection", endpoint: "/api/admin/test/bigquery" },
  { name: "Supabase Tables", endpoint: "/api/admin/test/table" },
  { name: "Lead API", endpoint: "/api/admin/test/lead-api" },
  { name: "IP Geolocation", endpoint: "/api/admin/test/geo" },
  { name: "User-Agent Parser", endpoint: "/api/admin/test/ua" },
  { name: "Admin Auth", endpoint: "/api/admin/test/auth" },
  { name: "Traffic Source Detection", endpoint: "/api/admin/test/traffic" },
  { name: "Telegram Bot", endpoint: "/api/admin/test/telegram" },
];

export function ConnectionTester() {
  const [results, setResults] = useState<Result[]>(
    tests.map((t) => ({ name: t.name, status: "idle" as Status, detail: "" })),
  );
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function runAll() {
    setRunning(true);
    setExpanded(null);
    setResults(tests.map((t) => ({ name: t.name, status: "testing" as Status, detail: "" })));

    const promises = tests.map(async (t, i) => {
      const start = Date.now();
      try {
        const res = await fetch(t.endpoint);
        const data = await res.json();
        return {
          name: t.name,
          status: data.ok ? "ok" as Status : "fail" as Status,
          detail: data.detail || data.error || "OK",
          latency: `${Date.now() - start}ms`,
          debug: data.debug,
          hint: data.hint,
        };
      } catch (err) {
        return {
          name: t.name,
          status: "fail" as Status,
          detail: err instanceof Error ? err.message : "Request failed",
          latency: `${Date.now() - start}ms`,
        };
      }
    });

    const settled = await Promise.all(promises);
    setResults(settled);
    setRunning(false);
  }

  const statusColor: Record<Status, string> = {
    idle: "text-white/30",
    testing: "text-yellow-400 animate-pulse",
    ok: "text-green-400",
    fail: "text-red-400",
  };

  const dotColor: Record<Status, string> = {
    idle: "bg-white/20",
    testing: "bg-yellow-400 animate-pulse",
    ok: "bg-green-400",
    fail: "bg-red-400",
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-white sm:text-xl">Connection Test</h1>
          <p className="mt-1 text-[10px] text-white/40 sm:text-xs">Verify all integrations are working</p>
        </div>
        <button
          onClick={runAll}
          disabled={running}
          className="rounded-xl bg-[#0d47a1] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1565c0] disabled:opacity-50 sm:text-sm"
        >
          {running ? "Testing..." : "Run All Tests"}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:mt-6">
        {results.map((r, i) => (
          <div key={i}>
            <div
              onClick={() => r.debug || r.hint ? setExpanded(expanded === i ? null : i) : undefined}
              className={`flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d2843] p-3 sm:p-4 ${r.debug || r.hint ? "cursor-pointer hover:border-white/20" : ""}`}
            >
              <span className={`h-3 w-3 shrink-0 rounded-full ${dotColor[r.status]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white/90 sm:text-sm">{r.name}</p>
                <p className={`mt-0.5 text-[10px] sm:text-xs ${statusColor[r.status]} break-all`}>
                  {r.status === "idle" && "Not tested yet"}
                  {r.status === "testing" && "Testing..."}
                  {r.status === "ok" && r.detail}
                  {r.status === "fail" && `Failed: ${r.detail}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {r.latency && (
                  <span className="text-[10px] font-mono text-white/30 sm:text-xs">{r.latency}</span>
                )}
                {(r.debug || r.hint) && (
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-white/40 transition-transform ${expanded === i ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
              </div>
            </div>
            {expanded === i && (r.debug || r.hint) && (
              <div className="mt-1 rounded-xl border border-white/10 bg-[#0a1929] p-3 sm:p-4">
                {r.hint && (
                  <p className="mb-2 text-[10px] font-bold text-yellow-400 sm:text-xs">HINT: {r.hint}</p>
                )}
                {r.debug && (
                  <pre className="overflow-x-auto text-[10px] leading-relaxed text-white/60 sm:text-xs">
                    <code>{JSON.stringify(r.debug, null, 2)}</code>
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {results.some((r) => r.status === "fail") && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 sm:mt-6 sm:rounded-2xl sm:p-4">
          <p className="text-xs font-bold text-red-400 sm:text-sm">Some tests failed</p>
          <p className="mt-1 text-[10px] text-white/50 sm:text-xs">
            Click a failed test to expand debug details. For Supabase, ensure DATABASE_URL uses the
            pooler URL (port 6543) and you've run <strong>supabase-schema.sql</strong> in the SQL Editor.
          </p>
        </div>
      )}
    </div>
  );
}
