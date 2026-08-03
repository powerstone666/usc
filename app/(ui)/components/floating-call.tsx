"use client";

import { useState, useEffect } from "react";
import { site } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";
import { useDiagnostic } from "@/app/(ui)/components/diagnostic-provider";

type State = "icon" | "callNow" | "number";

export function FloatingCall() {
  const [info, setInfo] = useState<State>("icon");
  const { openDiagnostic } = useDiagnostic();

  useEffect(() => {
    const cycle: State[] = ["icon", "callNow", "number"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % cycle.length;
      setInfo(cycle[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const width = info === "icon" ? "3.5rem" : info === "callNow" ? "10rem" : "14.5rem";

  return (
    <div
      className={`fixed top-[85%] right-4 z-40 -translate-y-1/2 ${
        info === "icon" ? "call-pulse" : ""
      }`}
    >
      {info === "icon" && (
        <span
          className="absolute left-0 top-0 h-14 w-14 animate-ping rounded-full opacity-20"
          style={{ backgroundColor: "#8B1E1E" }}
          aria-hidden="true"
        />
      )}
      <button
        type="button"
        onClick={openDiagnostic}
        className="relative flex h-14 shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full text-white shadow-lg transition-all duration-500 ease-in-out"
        style={{ backgroundColor: info === "icon" ? "#8B1E1E" : "#A32020", width }}
        aria-label={`Book a repair — ${site.phoneDisplay}`}
      >
        <Icon name="phone" className="h-6 w-6 shrink-0" filled />
        {info !== "icon" && (
          <span className="overflow-hidden whitespace-nowrap text-sm font-bold">
            {info === "number" ? site.phoneDisplay : "Call now"}
          </span>
        )}
      </button>
    </div>
  );
}
