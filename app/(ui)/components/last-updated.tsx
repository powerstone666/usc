import { formatDate } from "@/app/(common-lib)/format-date";
import { site } from "@/app/(config)/site";

// Visible freshness signal; the same date is published as dateModified in the page schema.
export function LastUpdated({ date = site.contentUpdated, tone = "inverse" }: { date?: string; tone?: "inverse" | "default" }) {
  return (
    <p className={`mt-4 text-sm ${tone === "inverse" ? "text-on-primary/85" : "text-muted"}`}>
      Last updated: <time dateTime={date}>{formatDate(date)}</time>
    </p>
  );
}
