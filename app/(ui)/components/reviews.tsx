import { reviews } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";

function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span
      role="img"
      className="flex items-center gap-0.5 text-star"
      aria-label={`${Number(rating.toFixed(1))} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" className={className} filled={i < Math.round(rating)} />
      ))}
    </span>
  );
}

export function Reviews({ layout = "carousel" }: { layout?: "carousel" | "grid" }) {
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const listClass =
    layout === "carousel"
      ? "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0"
      : "grid gap-3 sm:grid-cols-2 sm:gap-4";
  const itemClass =
    layout === "carousel"
      ? "w-[85%] shrink-0 snap-start sm:w-auto"
      : "";

  return (
    <div>
      <div className="flex items-center gap-3">
        <p className="text-4xl font-extrabold text-on-surface">
          {average.toFixed(1)}
        </p>
        <div>
          <Stars rating={average} className="h-5 w-5" />
          <p className="mt-0.5 text-sm text-on-surface-variant">
            Average from {reviews.length} customer reviews
          </p>
        </div>
      </div>
      <ul className={`mt-6 ${listClass}`}>
        {reviews.map((r) => (
          <li
            key={r.name}
            className={`flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface p-5 ${itemClass}`}
          >
            <Stars rating={r.rating} />
            <p className="text-base text-on-surface">&ldquo;{r.text}&rdquo;</p>
            <p className="mt-auto text-sm">
              <span className="font-bold text-on-surface">{r.name}</span>
              <span className="text-on-surface-variant"> · {r.area}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
