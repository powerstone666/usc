"use client";

import { useDiagnostic } from "@/app/(ui)/components/diagnostic-provider";
import { site } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";
import { analytics } from "@/app/(common-lib)/analytics";
import type { ReactNode } from "react";

type Variant = "light" | "dark" | "outline" | "small";

const styles: Record<Variant, string> = {
  light: "btn-zoom inline-flex items-center justify-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-bold text-primary",
  dark: "btn-zoom inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-on-primary",
  outline: "btn-zoom inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/40 px-5 py-3 text-sm font-bold text-on-primary hover:bg-white/10",
  small: "btn-zoom inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary",
};

export function CallButton({
  variant = "light",
  children,
  className,
}: {
  variant?: Variant;
  children?: ReactNode;
  className?: string;
}) {
  const { openDiagnostic } = useDiagnostic();

  function handleClick() {
    analytics.clickToCall("call-button");
    openDiagnostic();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || styles[variant]}
      aria-label={`Book a repair — ${site.phoneDisplay}`}
    >
      <Icon name="phone" className="h-4 w-4" filled />
      {children || "Call now"}
    </button>
  );
}
