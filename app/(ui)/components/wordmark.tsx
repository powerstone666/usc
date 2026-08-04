import { site } from "@/app/(config)/site";

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-black text-white"
        style={{ backgroundColor: "#0d47a1" }}
      >
        USC
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
