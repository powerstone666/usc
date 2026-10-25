import type { Metadata } from "next";
import Link from "next/link";
import { services, site } from "@/app/(config)/site";
import type { Faq } from "@/app/(config)/content";
import { CallButton } from "@/app/(ui)/components/call-button";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { SectionHeading } from "@/app/(ui)/components/section-heading";
import { ServiceHero } from "@/app/(ui)/components/service-hero";

const title = `Urban Company alternative for appliance repair in ${site.city}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description: `${site.name} is an independent ${site.city} repair business, not affiliated with Urban Company. What we offer and what to ask any provider.`,
  alternates: { canonical: "/urban-company-alternative" },
};

// Only things this business actually does and already states elsewhere on the site.
// Nothing here describes another company's service or prices.
const offers = [
  { title: "Technicians who are background-checked", text: "The person at your door is vetted and trained for the appliance they are repairing, not a random contractor." },
  { title: "You see the quote before any work starts", text: "Our technician inspects the appliance, explains the fault and shares the quote. Nothing is done until you agree." },
  { title: "Free diagnosis when you go ahead", text: "Diagnosis is free when you proceed with the repair. If you decide not to repair, only a small visitation fee applies." },
  { title: "Same-day slots in most areas", text: `Tell us the appliance and the problem and we confirm a same-day visit across most of ${site.city}.` },
  { title: "Book without installing anything", text: "Call us, message on WhatsApp or leave your number on this page. No app or account is needed." },
  { title: "A local business you can reach directly", text: `You speak to ${site.name} itself by phone or WhatsApp. We are available ${site.hours.replace("·", ",")}.` },

];

const checklist = [
  { q: "Who will actually come to my home?", a: "A background-checked technician from our own team, trained for your type of appliance." },
  { q: "Will I know the price before the work starts?", a: "Yes. The quote is shared after inspection and you approve it first." },
  { q: "Is the visit free?", a: "Diagnosis is free if you proceed with the repair. A small visitation fee applies only if you choose not to repair." },
  { q: "How do I book?", a: "Phone, WhatsApp or the form below. No app needed." },
  { q: "What if the same fault comes back?", a: "Every repair is quality assured. Call us and we will come back to look at it." },
];

const faqs: Faq[] = [
  { q: `Is ${site.name} the same company as Urban Company?`, a: `No. ${site.name} is an independent appliance repair business in ${site.city}. We are not affiliated with, owned by or endorsed by Urban Company, and we do not speak for them.` },
  { q: "Why do people search for Urban Company when they need a repair?", a: "Many people use the name to mean any home service that comes to your door. If that is what you need, you can book appliance repair with us directly by phone, WhatsApp or the form on this page." },
  { q: "Which appliances do you repair?", a: `${services.map((s) => s.short.toLowerCase()).join(", ")}.` },
  { q: "Do I need an app to book?", a: "No. Call us, message us on WhatsApp or share your number and we will call you back." },
  { q: "How should I compare repair providers?", a: "Ask who will come to your home, whether you see the quote before the work, whether the visit is free, how you can reach them afterwards, and what happens if the fault returns. Ask every provider the same questions." },
];

export default function Page() {
  return (
    <div className="flex flex-col">
      <ServiceHero
        path="/urban-company-alternative"
        title={title}
        tagline="An independent local repair business you can book directly by phone, WhatsApp or a short form."
        answer={`${site.name} is an independent appliance repair business in ${site.city} and is not affiliated with Urban Company. If you want a home repair booked quickly, you can call or message us directly. We offer background-checked technicians, a quote you approve before any work and same-day slots in most areas.`}
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CallButton variant="light" />
          <Link href="#diagnose" className="btn-zoom btn-outline-light">Request a callback</Link>
        </div>
      </ServiceHero>

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-3xl px-4">
          <p role="note" className="rounded-2xl border border-outline bg-surface-variant p-5 text-base text-on-surface">
            <strong>Independent and not affiliated.</strong> {site.name} is a separate business from Urban Company. We are not owned by, partnered with or endorsed by them. The name is used on this page only so you can tell the two apart.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading title={`What you get with ${site.name}`} subtitle="Everything below is how we work today." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o) => (
              <li key={o.title} className="rounded-2xl border border-outline-variant bg-surface p-5">
                <h3 className="text-base font-extrabold text-on-surface">{o.title}</h3>
                <p className="mt-2 text-base text-on-surface-variant">{o.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface-variant py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading title="Five questions to ask any repair provider" subtitle="Use these with us or anyone else. Here is how we answer them." />
          <dl className="mt-8 space-y-4">
            {checklist.map((c) => (
              <div key={c.q} className="rounded-2xl bg-surface p-5">
                <dt className="text-base font-extrabold text-on-surface">{c.q}</dt>
                <dd className="mt-1 text-base text-on-surface-variant">{c.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FaqSection title="Common questions" faqs={faqs} />

      <section id="diagnose" className="scroll-mt-16 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading title={`Book your appliance repair in ${site.city}`} subtitle="Share your number and our technician will call you back to confirm the fault and the slot." />
          <div className="mt-8">
            <LeadForm appliance="general" source="urban-company-alternative" />
          </div>
          <p className="mt-8 text-sm text-muted">
            Urban Company is a trademark of its owner. It is mentioned here only to identify that company and to make clear that {site.name} is a different business.
          </p>
        </div>
      </section>
    </div>
  );
}
