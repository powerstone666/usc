import { trustBadges } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";

export function TrustBadges() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {trustBadges.map((b) => (
        <li
          key={b.title}
          className="flex items-start gap-3 card-zoom rounded-2xl border border-outline-variant bg-surface p-4"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary">
            <Icon name={b.icon} className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-on-surface">
              {b.title}
            </span>
            <span className="block text-xs text-on-surface-variant">
              {b.text}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
