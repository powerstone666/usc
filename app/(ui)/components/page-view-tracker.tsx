"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/app/(common-lib)/analytics";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.init();
  }, []);

  useEffect(() => {
    analytics.onRouteChange(pathname);
  }, [pathname]);

  return null;
}
