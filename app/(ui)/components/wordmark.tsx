import { site } from "@/app/(config)/site";

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
        style={{ backgroundColor: "#0d47a1" }}
      >
        USC
      </span>
      <span className="flex flex-col gap-1 leading-none">
        <span className="text-sm font-extrabold tracking-tight text-on-surface">
          {site.name}
        </span>
        <span className="text-sm font-medium uppercase tracking-wide text-muted">
          {site.city}
        </span>
      </span>
    </span>
  );
}
