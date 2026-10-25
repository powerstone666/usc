import type { Metadata } from "next";
import Link from "next/link";
import { services, site } from "@/app/(config)/site";
import { getApprovedTopics } from "@/app/(server-lib)/keyword-sync";
import { DiscoveryPing } from "@/app/(ui)/components/discovery-ping";
import { SectionHeading } from "@/app/(ui)/components/section-heading";
import { ServiceHero } from "@/app/(ui)/components/service-hero";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const hasTopics = (await getApprovedTopics()).length > 0;
  return {
    title: `Appliance repair topics in ${site.city}`,
    description: `Common appliance faults and repair questions in ${site.city}, with how ${site.name} fixes them.`,
    alternates: { canonical: "/topics" },
    robots: hasTopics ? undefined : { index: false, follow: true }, // an empty hub is thin: keep it out of search
  };
}

export default async function Page() {
  const topics = await getApprovedTopics();
  return (
    <div>
      <DiscoveryPing />
      <ServiceHero
        path="/topics"
        pageType="CollectionPage"
        title={`Appliance repair topics in ${site.city}`}
        tagline={`Specific faults and questions people search for, and how ${site.name} fixes them.`}
      />
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-10 px-4">
          {topics.length === 0 && <p className="text-base text-on-surface-variant">No topics have been published yet.</p>}
          {services.map((s) => {
            const list = topics.filter((t) => t.service === s.slug);
            if (list.length === 0) return null;
            return (
              <div key={s.slug}>
                <SectionHeading title={s.name} />
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/topics/${t.slug}`} className="card-zoom flex min-h-14 items-center rounded-2xl border border-outline-variant bg-surface px-4 text-base font-semibold text-on-surface hover:text-primary">{t.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
