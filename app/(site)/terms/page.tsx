import type { Metadata } from "next";
import { site } from "@/app/(config)/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${site.name}.`,
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <section className="bg-surface-variant pb-14 pt-28 lg:pb-20 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
            Terms of Service
          </h1>
        </div>
      </section>
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-sm leading-7 text-on-surface-variant">
          <p>
            These terms govern your use of {site.name} ({site.url}) and the
            repair services we provide in {site.city}.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            1. Service requests
          </h2>
          <p>
            By submitting your phone number through this website or calling us,
            you agree to be contacted about your repair request. Diagnosis is
            free; any repair work begins only after you approve a written quote.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            2. Pricing
          </h2>
          <p>
            Quotes are shared before work begins. Spare parts, where required,
            are billed separately at fixed rates. You may decline the quote; in
            that case only any agreed visitation fee applies.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            3. Warranty
          </h2>
          <p>
            Repairs carried out by us are covered by quality assured on
            the work performed, and  per visit,
            subject to the conditions shared at the time of service.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            4. Limitation
          </h2>
          <p>
            {site.name} is not liable for pre-existing damage, third-party
            repairs, or issues arising from misuse of the appliance. Liability
            is limited to the cost of the service rendered.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            5. Changes
          </h2>
          <p>
            We may update these terms from time to time. Continued use of the
            service constitutes acceptance of the latest version.
          </p>
          <p className="mt-6 text-muted">Last updated: 2026</p>
        </div>
      </section>
    </div>
  );
}
