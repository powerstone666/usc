"use client";

import Link from "next/link";
import { nav, services, site } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";
import { useDiagnostic } from "@/app/(ui)/components/diagnostic-provider";

export function Footer() {
  const { openDiagnostic } = useDiagnostic();

  return (
    <footer className="bg-primary text-on-primary pb-14 md:pb-0">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <p className="text-lg font-extrabold">
            Need a repair today? Call us.
          </p>
          <button
            type="button"
            onClick={openDiagnostic}
            className="btn-zoom inline-flex items-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-bold text-primary"
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
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              <Icon name="wrench" className="h-5 w-5" filled />
            </span>
            <span className="text-base font-extrabold">{site.name}</span>
          </span>
          <p className="mt-3 text-sm text-on-primary/70">
            {site.tagline}. Same-day microwave, AC, washing machine &amp;
            refrigerator repair across {site.city}.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold">Services</p>
          <ul className="mt-3 space-y-2 text-sm text-on-primary/70">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="transition-colors hover:text-on-primary"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-on-primary/70">
            <li>
              <Link href="/about" className="transition-colors hover:text-on-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-on-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/blog" className="transition-colors hover:text-on-primary">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/coverage" className="transition-colors hover:text-on-primary">
                Coverage
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="transition-colors hover:text-on-primary">
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">Get in touch</p>
          <ul className="mt-3 space-y-3 text-sm text-on-primary/70">
            <li>
              <button
                type="button"
                onClick={openDiagnostic}
                className="inline-flex items-center gap-2 transition-colors hover:text-on-primary"
              >
                <Icon name="phone" className="h-4 w-4" filled />
                {site.phoneDisplay}
              </button>
            </li>
            <li>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-on-primary"
              >
                <Icon name="whatsapp" className="h-4 w-4" filled />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-on-primary"
              >
                <Icon name="wrench" className="h-4 w-4" filled />
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4" />
              {site.hours}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="shield" className="h-4 w-4" />
              {site.warranty}
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-on-primary/60 sm:flex-row">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="transition-colors hover:text-on-primary">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-on-primary">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
