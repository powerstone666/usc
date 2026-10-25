import { formatDate } from "@/app/(common-lib)/format-date";
import type { Metadata } from "next";
import { blogPosts } from "@/app/(config)/blog";
import { areas, site } from "@/app/(config)/site";
import { CallButton } from "@/app/(ui)/components/call-button";
import { BlogList } from "@/app/(ui)/components/blog-list";
import { ServiceHero } from "@/app/(ui)/components/service-hero";

export const metadata: Metadata = {
  title: "Blog — Appliance Repair Tips & Guides",
  description:
    "Expert guides on microwave, AC, washing machine, refrigerator, water filter and chimney maintenance and repair. Tips to extend your appliance's life.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  const posts = blogPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: formatDate(p.date),
    readTime: p.readTime,
    image: p.image,
  }));

  return (
    <div className="flex flex-col">
      <ServiceHero
        path="/blog"
        pageType="CollectionPage"
        title="Appliance repair tips & guides"
        tagline={`Expert advice on maintaining and repairing your home appliances in ${site.city}. From microwaves to water filters — keep your appliances running longer.`}
      />
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <BlogList posts={posts} />
        </div>
      </section>
      <section className="bg-surface-variant py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Need a repair instead of a guide?
          </h2>
          <p className="mt-2 max-w-2xl text-base text-on-surface-variant">
            {site.name} sends a verified technician to your home in {site.city}. Diagnosis is free, you get a quote before any work, and same-day slots are available across {areas.length}+ neighbourhoods.
          </p>
          <div className="mt-5">
            <CallButton variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
