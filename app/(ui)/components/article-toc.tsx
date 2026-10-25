"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/app/(ui)/components/icons";

export type TocItem = { id: string; label: string };

// Highlights the section currently in view; collapsible on mobile, always open on desktop.
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  // Keep the current item visible inside the scrollable desktop list (never moves the page).
  useEffect(() => {
    const list = listRef.current;
    if (!list || !window.matchMedia("(min-width: 1024px)").matches) return;
    const link = list.querySelector<HTMLElement>('a[aria-current="location"]');
    if (!link) return;
    const top = link.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + link.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: top - list.clientHeight / 3, behavior: "smooth" });
    }
  }, [active]);

  useEffect(() => {
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inView[0]) setActive(inView[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="In this article" className="rounded-2xl border border-outline-variant bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between px-4 text-left text-sm font-bold uppercase tracking-wide text-primary lg:pointer-events-none"
      >
        In this article
        <Icon name="chevron" className={`h-4 w-4 lg:hidden ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      <ol ref={listRef} className={`${open ? "block" : "hidden"} px-2 pb-3 lg:block lg:max-h-[calc(100dvh-18rem)] lg:overflow-y-auto`}>
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                onClick={() => {
                  setActive(item.id);
                  setOpen(false);
                }}
                className={`block rounded-lg px-3 py-2 text-sm leading-snug transition-colors ${
                  current
                    ? "bg-primary-container font-bold text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
