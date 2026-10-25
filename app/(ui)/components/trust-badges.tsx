import { trustBadges } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";

export function TrustBadges() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-outline-variant bg-outline-variant shadow-lg shadow-primary/10 lg:grid-cols-4">
      {trustBadges.map((b) => (
        <li key={b.title} className="flex items-start gap-3 bg-surface p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-primary">
            <Icon name={b.icon} className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-on-surface sm:text-base">
              {b.title}
            </span>
            <span className="mt-0.5 block text-sm text-on-surface-variant">
              {b.text}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
