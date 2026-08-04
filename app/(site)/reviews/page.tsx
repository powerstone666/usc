import type { Metadata } from "next";
import Image from "next/image";
import { site, reviews } from "@/app/(config)/site";
import { Reviews } from "@/app/(ui)/components/reviews";
import { Icon } from "@/app/(ui)/components/icons";
import { Reveal } from "@/app/(ui)/components/reveal";

export const metadata: Metadata = {
  title: "Reviews — What Bengaluru Says About Us",
  description:
    "Read what Bengaluru customers say about our microwave, AC, washing machine and refrigerator repair services. Verified technicians, quality assured.",
  alternates: { canonical: "/reviews" },
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <section className="relative isolate overflow-hidden">
        <Image
          src="/happy-customer.png"
          alt="Happy Bengaluru customer with repaired appliance"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/30" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 text-on-primary lg:pb-20 lg:pt-32">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-on-primary/80">
              Reviews
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Bengaluru trusts us with their appliances
            </h1>
            <p className="mt-4 max-w-lg text-base text-on-primary/90">
              {reviews.length}+ verified reviews from customers across{" "}
              {site.city}. Same-day repair, genuine parts, quality assured.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <Reviews />
          </Reveal>
        </div>
      </section>

    </div>
  );
}
