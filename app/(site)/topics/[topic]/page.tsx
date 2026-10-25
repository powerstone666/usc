import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { keywordAnswer } from "@/app/(config)/aeo";
import { serviceFaqs, serviceProblems } from "@/app/(config)/content";
import { getService, site, steps } from "@/app/(config)/site";
import { truncate } from "@/app/(common-lib)/truncate";
import { getApprovedTopic, getApprovedTopics } from "@/app/(server-lib)/keyword-sync";
import { CallButton } from "@/app/(ui)/components/call-button";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { LeadForm } from "@/app/(ui)/components/lead-form";
import { DiscoveryPing } from "@/app/(ui)/components/discovery-ping";
import { SectionHeading } from "@/app/(ui)/components/section-heading";
import { ServiceHero } from "@/app/(ui)/components/service-hero";

// Pages for reviewed, owner-approved search topics. Kept apart from the curated /keywords/ pages:
// built on request (no database access at build time) and refreshed hourly.
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const topic = await getApprovedTopic((await params).topic);
  if (!topic) return { title: "Not found", robots: { index: false } };
  const service = getService(topic.service);
  return {
    title: topic.title.length + 25 > 70 ? { absolute: topic.title } : topic.title,
    description: truncate(`Same-day repair for ${topic.problem.toLowerCase()} in ${site.city}. Verified ${service.short.toLowerCase()} technicians, free diagnosis and a quote before any work.`),
    alternates: { canonical: `/topics/${topic.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = await getApprovedTopic(slug);
  if (!topic) notFound();

  const service = getService(topic.service);
  const problem = serviceProblems[topic.service].find((p) => p.title === topic.problem);
  const related = (await getApprovedTopics()).filter((t) => t.service === topic.service && t.slug !== topic.slug).slice(0, 6);

  return (
    <div>
      <DiscoveryPing />
      <ServiceHero
        path={`/topics/${topic.slug}`}
        parent={{ name: "Topics", path: "/topics" }}
        answer={keywordAnswer(topic)}
        title={topic.title}
        tagline={`${service.name}: ${topic.problem.toLowerCase()}`}
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CallButton variant="light" />
          <Link href={`/services/${service.slug}`} className="btn-zoom btn-outline-light">
            {service.name}
          </Link>
        </div>
      </ServiceHero>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading title={`About ${topic.problem.toLowerCase()}`} subtitle={problem?.description ?? service.blurb} />
          <h2 className="mt-10 text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">How we fix it</h2>
          <ol className="mt-5 space-y-3">
            {steps.map((st, i) => (
              <li key={st.title} className="flex gap-4 rounded-2xl bg-surface-variant p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-on-primary">{i + 1}</span>
                <div>
                  <p className="text-base font-bold text-on-surface">{st.title}</p>
                  <p className="text-base text-on-surface-variant">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FaqSection title={`${service.short} repair in ${site.city} — FAQ`} faqs={serviceFaqs[topic.service].slice(0, 5)} />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading title={`Book ${service.short.toLowerCase()} repair in ${site.city}`} subtitle="Share your number and our technician will call you back to confirm the fault and the slot." />
          <div className="mt-8">
            <LeadForm appliance={topic.service} source={`topic-${topic.slug}`} />
          </div>
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-extrabold text-on-surface">More {service.short.toLowerCase()} topics</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {related.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/topics/${t.slug}`} className="flex min-h-10 items-center rounded-xl border border-outline-variant bg-surface px-3.5 text-sm font-medium text-on-surface-variant hover:border-primary hover:text-primary">{t.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
