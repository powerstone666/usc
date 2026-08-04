"use client";

import { site } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";
import { useDiagnostic } from "@/app/(ui)/components/diagnostic-provider";
import { analytics } from "@/app/(common-lib)/analytics";

export function CallBar() {
  const { openDiagnostic } = useDiagnostic();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="flex items-stretch border-t border-outline-variant bg-primary">
        <button
          type="button"
          onClick={() => {
            analytics.clickToCall("mobile-bar");
            openDiagnostic();
          }}
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-bold text-on-primary"
        >
          <Icon name="phone" className="h-5 w-5" filled />
          Book a repair
        </button>
        <div className="flex items-center border-l border-white/20 px-4">
          <a
            href={`tel:${site.phone}`}
            className="text-xs font-semibold text-on-primary/80"
          >
            {site.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
