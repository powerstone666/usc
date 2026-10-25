import type { ReactNode } from "react";

// Content renders immediately: no fade-in gating, so text is visible on slow
// connections and to crawlers. Kept as a wrapper so call sites stay unchanged.
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
