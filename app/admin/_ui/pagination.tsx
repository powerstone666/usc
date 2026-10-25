import Link from "next/link";

function windowed(page: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pages - 1, page + 1);
  if (from > 2) out.push("…");
  for (let p = from; p <= to; p++) out.push(p);
  if (to < pages - 1) out.push("…");
  out.push(pages);
  return out;
}

// Real pagination: the server sends one page at a time, so lists stay fast as data grows.
export function Pagination({ page, pages, total, pageSize, hrefFor, noun }: { page: number; pages: number; total: number; pageSize: number; hrefFor: (p: number) => string; noun: string }) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const base = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-bold transition-colors";
  const idle = "bg-surface text-on-surface-variant ring-1 ring-outline-variant hover:bg-surface-variant";
  return (
    <nav aria-label={`${noun} pages`} className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted" aria-live="polite">
        Showing {from.toLocaleString("en-IN")}–{to.toLocaleString("en-IN")} of {total.toLocaleString("en-IN")} {noun}
      </p>
      {pages > 1 && (
        <ul className="flex flex-wrap items-center justify-center gap-1.5">
          <li>
            {page > 1 ? (
              <Link href={hrefFor(page - 1)} prefetch={false} rel="prev" className={`${base} ${idle}`}>Previous</Link>
            ) : (
              <span aria-disabled="true" className={`${base} cursor-not-allowed bg-surface-variant text-muted`}>Previous</span>
            )}
          </li>
          {windowed(page, pages).map((p, i) => (
            <li key={`${p}-${i}`}>
              {p === "…" ? (
                <span className="px-1 text-muted" aria-hidden="true">…</span>
              ) : (
                <Link href={hrefFor(p)} prefetch={false} aria-current={p === page ? "page" : undefined} aria-label={`Page ${p}`} className={`${base} ${p === page ? "bg-primary text-on-primary" : idle}`}>{p}</Link>
              )}
            </li>
          ))}
          <li>
            {page < pages ? (
              <Link href={hrefFor(page + 1)} prefetch={false} rel="next" className={`${base} ${idle}`}>Next</Link>
            ) : (
              <span aria-disabled="true" className={`${base} cursor-not-allowed bg-surface-variant text-muted`}>Next</span>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}
