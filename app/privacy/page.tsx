import type { Metadata } from "next";
import { site } from "@/app/(config)/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <section className="bg-surface-variant pb-14 pt-28 lg:pb-20 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
            Privacy Policy
          </h1>
        </div>
      </section>
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-sm leading-7 text-on-surface-variant">
          <p>
            This policy explains how {site.name} ({site.url}) handles the
            information you share when you request a repair.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            What we collect
          </h2>
          <p>
            When you request a callback or use the diagnostic tool, we collect
            your name, phone number, appliance details and the issue you
            describe. We may also collect standard analytics such as the page you
            visited and how you found us.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            How we use it
          </h2>
          <p>
            We use your information solely to contact you about your repair
            request, schedule a visit, and provide the service. We do not sell
            your personal information.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            Retention
          </h2>
          <p>
            We retain your request details only for as long as needed to provide
            the service and handle any quality concerns, and then delete or
            anonymise them.
          </p>
          <h2 className="mt-6 text-base font-semibold text-on-surface">
            Your choices
          </h2>
          <p>
            You may request access to, correction of, or deletion of your
            information by writing to {site.email}.
          </p>
          <p className="mt-6 text-muted">Last updated: 2026</p>
        </div>
      </section>
    </div>
  );
}
