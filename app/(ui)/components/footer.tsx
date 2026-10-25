"use client";

import Link from "next/link";
import { services, site, popularAreas } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { Icon } from "@/app/(ui)/components/icons";
import { useDiagnostic } from "@/app/(ui)/components/diagnostic-provider";
import { analytics } from "@/app/(common-lib)/analytics";

export function Footer() {
  const { openDiagnostic } = useDiagnostic();

  return (
    <footer className="content-auto bg-primary text-on-primary pb-24 md:pb-0">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <p className="text-center text-xl font-extrabold sm:text-left">
            Need a repair today? Call us.
          </p>
          <button
            type="button"
            onClick={openDiagnostic}
            className="btn-zoom inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background px-7 py-3.5 text-base font-bold text-primary sm:w-auto"
          >
            <Icon name="phone" className="h-4 w-4" filled />
            Book a repair
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Icon name="wrench" className="h-5 w-5" filled />
            </span>
            <span className="text-base font-extrabold">{site.name}</span>
          </span>
          <p className="mt-3 text-sm leading-relaxed text-on-primary/80">
            {site.tagline}. Same-day microwave, AC, washing machine &amp;
            refrigerator repair across {site.city}.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold">Services</h2>
          <ul className="mt-3 space-y-2 text-sm text-on-primary/80">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-block py-1.5 transition-colors hover:text-on-primary"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">Company</h2>
          <ul className="mt-3 space-y-1 text-sm text-on-primary/80">
            <li>
              <Link href="/about" className="inline-block py-1.5 transition-colors hover:text-on-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="inline-block py-1.5 transition-colors hover:text-on-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/blog" className="inline-block py-1.5 transition-colors hover:text-on-primary">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/coverage" className="inline-block py-1.5 transition-colors hover:text-on-primary">
                Coverage
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="inline-block py-1.5 transition-colors hover:text-on-primary">
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">Get in touch</h2>
          <ul className="mt-3 space-y-1 text-sm text-on-primary/80">
            <li>
              <button
                type="button"
                aria-label={`Call us at ${site.phoneDisplay}`}
                onClick={() => {
                  analytics.clickToCall("footer");
                  openDiagnostic();
                }}
                className="inline-flex items-center gap-2 py-1.5 transition-colors hover:text-on-primary"
              >
                <Icon name="phone" className="h-4 w-4" filled />
                <span>{site.phoneDisplay}</span>
              </button>
            </li>
            <li>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.whatsappClick("footer")}
                className="inline-flex items-center gap-2 py-1.5 transition-colors hover:text-on-primary"
              >
                <Icon name="whatsapp" className="h-4 w-4" filled />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 py-1.5 transition-colors hover:text-on-primary"
              >
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2 py-1.5">
              <Icon name="clock" className="h-4 w-4" />
              {site.hours}
            </li>
            <li className="flex items-center gap-2 py-1.5">
              <Icon name="shield" className="h-4 w-4" />
              {site.warranty}
            </li>
          </ul>
        </div>
      </div>

      {/* Popular areas */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h2 className="text-sm font-bold">Popular areas</h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-on-primary/80">
            {popularAreas.map((a) => (
              <li key={a}>
                <Link
                  href={`/areas/${slugify(a)}`}
                  className="inline-block py-1.5 transition-colors hover:text-on-primary"
                >
                  {a}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/coverage" className="inline-flex items-center gap-1 py-1.5 font-bold text-on-primary transition-colors hover:text-on-primary/80">
                All areas
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-on-primary/70 sm:flex-row">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="inline-flex min-h-10 items-center transition-colors hover:text-on-primary">
              Terms
            </Link>
            <Link href="/privacy" className="inline-flex min-h-10 items-center transition-colors hover:text-on-primary">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
