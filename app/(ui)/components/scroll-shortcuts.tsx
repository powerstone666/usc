"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/app/(ui)/components/icons";

// Quick ways to skip a long page: jump to the end, jump back to the top, and a progress bar.
export function ScrollShortcuts({ endId }: { endId: string }) {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [showEnd, setShowEnd] = useState(true);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const end = document.getElementById(endId);
      const y = window.scrollY;
      const endTop = end ? end.getBoundingClientRect().top + y : document.documentElement.scrollHeight;
      const readable = Math.max(endTop - window.innerHeight, 1);
      setProgress(Math.min(Math.max(y / readable, 0), 1));
      setShowTop(y > 600);
      setShowEnd(y < endTop - window.innerHeight * 1.2);
    }
    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [endId]);

  function behavior(): ScrollBehavior {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }

  const buttonClass =
    "btn-zoom flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-primary text-on-primary shadow-lg shadow-black/25 hover:bg-secondary";

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 bg-transparent"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div className="h-full bg-cta transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="fixed bottom-24 right-4 z-30 flex flex-col gap-2 md:bottom-6">
        {showTop && (
          <button
            type="button"
            aria-label="Back to top"
            title="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: behavior() })}
            className={buttonClass}
          >
            <Icon name="arrow" className="h-5 w-5 -rotate-90" />
          </button>
        )}
        {showEnd && (
          <button
            type="button"
            aria-label="Skip to the end of the article"
            title="Skip to the end"
            onClick={() => document.getElementById(endId)?.scrollIntoView({ behavior: behavior(), block: "start" })}
            className={buttonClass}
          >
            <Icon name="arrow" className="h-5 w-5 rotate-90" />
          </button>
        )}
      </div>
    </>
  );
}
