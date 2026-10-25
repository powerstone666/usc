"use client";

import { Icon } from "@/app/(ui)/components/icons";
import { useDiagnostic } from "@/app/(ui)/components/diagnostic-provider";
import { analytics } from "@/app/(common-lib)/analytics";

// Floating pill in the CTA green with a white ring: stands out on blue and on white.
export function CallBar() {
  const { openDiagnostic } = useDiagnostic();

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 md:hidden">
      <button
        type="button"
        onClick={() => {
          analytics.clickToCall("mobile-bar");
          openDiagnostic();
        }}
        className="btn-zoom pointer-events-auto flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-white bg-cta text-base font-bold text-on-cta shadow-lg shadow-black/30 hover:bg-cta-hover"
      >
        <Icon name="phone" className="h-5 w-5" filled />
        Call now
      </button>
    </div>
  );
}
