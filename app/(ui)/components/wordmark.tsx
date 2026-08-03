import { Icon } from "@/app/(ui)/components/icons";
import { site } from "@/app/(config)/site";

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary">
        <Icon name="wrench" className="h-5 w-5" filled />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-extrabold tracking-tight text-on-surface">
          {site.name}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
          {site.city}
        </span>
      </span>
    </span>
  );
}
