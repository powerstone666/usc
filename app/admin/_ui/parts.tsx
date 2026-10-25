import Link from "next/link";
import type { ReactNode } from "react";
import { RANGES, type RangeKey } from "@/app/(server-lib)/admin-insights";
import { fmtDay } from "./format";

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-base text-on-surface-variant">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function RangeTabs({ current, path, test }: { current: RangeKey; path: string; test?: boolean }) {
  return (
    <div role="group" aria-label="Time range" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
      {RANGES.map((r) => {
        const active = r.key === current;
        const qs = new URLSearchParams({ range: r.key });
        if (test) qs.set("test", "1");
        return (
          <Link
            key={r.key}
            href={`${path}?${qs}`}
            aria-current={active ? "true" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-4 text-sm font-bold transition-colors ${
              active ? "bg-primary text-on-primary" : "bg-surface text-on-surface-variant ring-1 ring-outline-variant hover:bg-surface-variant"
            }`}
          >
            {r.label}
          </Link>
        );
      })}
    </div>
  );
}

export function Banner({ tone, children }: { tone: "info" | "warn"; children: ReactNode }) {
  return (
    <div
      role="status"
      className={`rounded-2xl px-4 py-3 text-sm ${tone === "warn" ? "bg-warning/15 text-on-surface" : "bg-primary-container text-on-primary-container"}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, note }: { label: string; value: string | number; note?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-surface p-4 ring-1 ring-outline-variant sm:p-5">
      <p className="text-sm font-medium text-on-surface-variant">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">{typeof value === "number" ? value.toLocaleString("en-IN") : value}</p>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
    </div>
  );
}

export function Panel({ title, hint, children, className = "" }: { title: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-surface p-4 ring-1 ring-outline-variant sm:p-5 ${className}`}>
      <h2 className="text-lg font-extrabold text-on-surface">{title}</h2>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-surface-variant px-4 py-6 text-center text-sm text-on-surface-variant">{children}</p>;
}

export type BarRow = { label: string; bar: number; value: string; note?: string; href?: string };

export function RankedBars({ rows, empty = "Nothing to show for this period." }: { rows: BarRow[]; empty?: string }) {
  if (rows.length === 0) return <EmptyNote>{empty}</EmptyNote>;
  const max = Math.max(...rows.map((r) => r.bar), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-semibold text-on-surface" title={r.label}>
              {r.href ? <Link href={r.href} className="hover:text-primary hover:underline">{r.label}</Link> : r.label}
            </span>
            <span className="shrink-0 font-bold text-on-surface">{r.value}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-variant" aria-hidden="true">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((r.bar / max) * 100, r.bar > 0 ? 3 : 0)}%` }} />
          </div>
          {r.note && <p className="mt-0.5 text-sm text-muted">{r.note}</p>}
        </li>
      ))}
    </ul>
  );
}

type Day = { day: string; form: number; call: number; whatsapp: number };

export function DayBars({ days }: { days: Day[] }) {
  const max = Math.max(...days.map((d) => d.form + d.call + d.whatsapp), 1);
  const total = days.reduce((s, d) => s + d.form + d.call + d.whatsapp, 0);
  const every = days.length > 14 ? 5 : 1;
  return (
    <div>
      <div role="img" aria-label={`Leads per day, ${total} in total`} className="flex h-40 items-end gap-1">
        {days.map((d) => {
          const sum = d.form + d.call + d.whatsapp;
          const seg = (n: number) => (sum === 0 ? 0 : (n / sum) * 100);
          return (
            <div key={d.day} className="flex h-full min-w-0 flex-1 flex-col justify-end" title={`${fmtDay(d.day)}: ${sum} (${d.form} form, ${d.call} call, ${d.whatsapp} WhatsApp)`}>
              {sum === 0 ? (
                <div className="h-0.5 rounded-full bg-outline-variant" />
              ) : (
                <div className="flex flex-col-reverse overflow-hidden rounded-t-md" style={{ height: `${Math.max((sum / max) * 100, 6)}%` }}>
                  <div className="bg-primary" style={{ height: `${seg(d.form)}%` }} />
                  <div className="bg-tertiary" style={{ height: `${seg(d.call)}%` }} />
                  <div className="bg-success" style={{ height: `${seg(d.whatsapp)}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-1" aria-hidden="true">
        {days.map((d, i) => {
          const shown = i % every === 0 || i === days.length - 1;
          const align = i === 0 ? "justify-start" : i === days.length - 1 ? "justify-end" : "justify-center";
          return (
            <span key={d.day} className={`flex min-w-0 flex-1 whitespace-nowrap text-xs text-muted ${align}`}>
              {shown ? fmtDay(d.day).replace(" ", "\u00a0") : ""}
            </span>
          );
        })}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-surface-variant">
        <Legend color="bg-primary" label="Form" />
        <Legend color="bg-tertiary" label="Call tap" />
        <Legend color="bg-success" label="WhatsApp tap" />
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} aria-hidden="true" />
      {label}
    </span>
  );
}

export function HourBars({ counts }: { counts: number[] }) {
  const max = Math.max(...counts, 1);
  const total = counts.reduce((a, b) => a + b, 0);
  const peak = counts.indexOf(Math.max(...counts));
  return (
    <div>
      <div role="img" aria-label={`Leads by hour of day (IST). Peak at hour ${peak}.`} className="flex h-28 items-end gap-0.5">
        {counts.map((c, h) => (
          <div key={h} className="flex h-full flex-1 items-end" title={`${h}:00 – ${h + 1}:00 IST: ${c}`}>
            <div className={`w-full rounded-t-sm ${c > 0 && h === peak && total >= 5 ? "bg-primary" : "bg-primary/40"}`} style={{ height: c === 0 ? "2px" : `${Math.max((c / max) * 100, 6)}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted" aria-hidden="true">
        <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
      </div>
    </div>
  );
}

export type TableRow = { label: string; sub?: string; values: (string | number)[]; href?: string };

// Compact responsive table: label on the left, up to three numeric columns on the right.
export function StatTable({ headers, rows, empty = "Nothing to show for this period." }: { headers: [string, string, string]; rows: TableRow[]; empty?: string }) {
  if (rows.length === 0) return <EmptyNote>{empty}</EmptyNote>;
  const grid = "grid grid-cols-[minmax(0,1fr)_3.75rem_3.25rem_3.75rem] items-baseline gap-2 sm:grid-cols-[minmax(0,1fr)_6rem_5rem_6rem]";
  return (
    <div>
      <div className={`${grid} border-b border-outline-variant pb-2 text-xs font-bold uppercase tracking-wide text-muted`} aria-hidden="true">
        <span />
        {headers.map((h) => <span key={h} className="text-right">{h}</span>)}
      </div>
      <ul className="divide-y divide-outline-variant">
        {rows.map((r) => (
          <li key={`${r.label}|${r.sub ?? ""}`} className={`${grid} py-2.5`}>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-on-surface" title={r.label}>{r.label}</span>
              {r.sub && <span className="block truncate text-sm text-muted" title={r.sub}>{r.sub}</span>}
            </span>
            {r.values.map((v, i) => (
              <span key={i} className={`text-right text-sm ${i === 1 ? "font-extrabold text-on-surface" : "text-on-surface-variant"}`}>
                <span className="sr-only">{headers[i]}: </span>
                {typeof v === "number" ? v.toLocaleString("en-IN") : v}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
