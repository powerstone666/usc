import type { ServiceSlug } from "@/app/(common-lib)/types";
import { whyChooseUs } from "@/app/(config)/content";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { SectionHeading } from "@/app/(ui)/components/section-heading";

const serviceSpecialties: Record<ServiceSlug, { icon: string; title: string; text: string }> = {
  "microwave-repair": {
    icon: "microwave",
    title: "Microwave-first specialists",
    text: "We lead with microwave oven repair — dedicated specialists, faster diagnosis, genuine magnetrons and parts.",
  },
  "ac-repair": {
    icon: "ac",
    title: "HVAC & cooling specialists",
    text: "Dedicated AC technicians for split & window units — certified leak fixes, vacuuming, and accurate gas refills.",
  },
  "washing-machine-repair": {
    icon: "washing-machine",
    title: "Washing machine specialists",
    text: "Expert technicians for front-load, top-load, and semi-automatic machines — genuine drum bearings, pumps, and belts.",
  },
  "refrigerator-repair": {
    icon: "refrigerator",
    title: "Refrigeration experts",
    text: "Specialists in inverter, double-door, and side-by-side refrigerators — genuine relays, thermostats, and compressor repairs.",
  },
  "water-filter-repair": {
    icon: "water-filter",
    title: "Water purification specialists",
    text: "Certified technicians for RO, UV, and UF systems — genuine membrane replacement, TDS testing, and sanitisation.",
  },
  "chimney-repair": {
    icon: "chimney",
    title: "Kitchen chimney specialists",
    text: "Expert technicians for baffle, filterless, and auto-clean chimneys — motor repairs and touch panel replacements.",
  },
};

export function WhyChooseUs({ serviceSlug }: { serviceSlug?: ServiceSlug }) {
  const items = serviceSlug
    ? [serviceSpecialties[serviceSlug], ...whyChooseUs.slice(1)]
    : whyChooseUs;

  return (
    <section className="content-auto bg-primary py-12 text-on-primary sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          tone="inverse"
          title="Why Bengaluru chooses us"
          subtitle="Not just another repair service — here's what makes us different."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-2xl bg-white/10 p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Icon name={item.icon as IconName} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold">{item.title}</h3>
                <p className="mt-1 text-base text-on-primary/85">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
