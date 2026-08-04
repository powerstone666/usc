"use client";

import { useState } from "react";

type Status = "idle" | "testing" | "ok" | "fail";

type Result = {
  name: string;
  status: Status;
  detail: string;
  latency?: string;
};

const tests: { name: string; endpoint: string }[] = [
  { name: "GTM / GA4", endpoint: "/api/admin/test/gtm" },
  { name: "BigQuery Connection", endpoint: "/api/admin/test/bigquery" },
  { name: "BigQuery Table", endpoint: "/api/admin/test/table" },
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

  async function runAll() {
    setRunning(true);
    setResults(tests.map((t) => ({ name: t.name, status: "testing" as Status, detail: "" })));

    const newResults = [...results];

    for (let i = 0; i < tests.length; i++) {
      const start = Date.now();
      try {
        const res = await fetch(tests[i].endpoint);
        const data = await res.json();
        const latency = `${Date.now() - start}ms`;
        newResults[i] = {
          name: tests[i].name,
          status: data.ok ? "ok" : "fail",
          detail: data.detail || data.error || "OK",
          latency,
        };
      } catch (err) {
        newResults[i] = {
          name: tests[i].name,
          status: "fail",
          detail: err instanceof Error ? err.message : "Request failed",
          latency: `${Date.now() - start}ms`,
        };
      }
      setResults([...newResults]);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Connection Test</h1>
          <p className="mt-1 text-xs text-white/40">
            Verify all integrations are working
          </p>
        </div>
        <button
          onClick={runAll}
          disabled={running}
          className="rounded-xl bg-[#0d47a1] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1565c0] disabled:opacity-50"
        >
          {running ? "Testing..." : "Run All Tests"}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {results.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0d2843] p-4"
          >
            <span className={`h-3 w-3 shrink-0 rounded-full ${dotColor[r.status]}`} />
            <div className="flex-1">
              <p className="text-sm font-bold text-white/90">{r.name}</p>
              <p className={`mt-0.5 text-xs ${statusColor[r.status]}`}>
                {r.status === "idle" && "Not tested yet"}
                {r.status === "testing" && "Testing..."}
                {r.status === "ok" && r.detail}
                {r.status === "fail" && `Failed: ${r.detail}`}
              </p>
            </div>
            {r.latency && (
              <span className="text-xs font-mono text-white/30">{r.latency}</span>
            )}
          </div>
        ))}
      </div>

      {results.some((r) => r.status === "fail") && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm font-bold text-red-400">Some tests failed</p>
          <p className="mt-1 text-xs text-white/50">
            Check the error details above. For BigQuery, ensure the service
            account has both <strong>BigQuery Data Editor</strong> and{" "}
            <strong>BigQuery Job User</strong> roles in GCP IAM.
          </p>
        </div>
      )}
    </div>
  );
}
