import { reviews } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-0.5 text-star"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" className="h-4 w-4" filled={i < rating} />
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {reviews.map((r, i) => (
        <li
          key={r.name}
          className="flex flex-col gap-3 card-zoom rounded-3xl border border-outline-variant bg-surface p-6"
        >
          <Stars rating={r.rating} />
          <p className="text-sm text-on-surface">&ldquo;{r.text}&rdquo;</p>
          <p className="mt-auto text-sm">
            <span className="font-bold text-on-surface">{r.name}</span>
            <span className="text-on-surface-variant"> · {r.area}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
