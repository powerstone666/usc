import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/app/(config)/blog";
import { keywords } from "@/app/(config)/keywords";
import { site, areas, services } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${site.url}/blog/${slug}`,
    },
  };
}

function isHeading(text: string): boolean {
  return !text.endsWith(".") && !text.endsWith("?");
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const nearbyAreas = areas.slice(0, 12);
  const relevantServices = services.slice(0, 6);
  const postKeywords = keywords.filter((k) => k.service === post.service);
  const faqs = post.content.filter(p => p.includes("?")).slice(0, 9);
  const headings = post.content.filter(isHeading);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        }}
      />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/30" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 text-on-primary lg:pb-20 lg:pt-32">
          <nav className="text-xs text-on-primary/80" aria-label="Breadcrumb">
            <Link href="/blog" className="hover:underline">Blog</Link> · <span>{post.category}</span>
          </nav>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-3 max-w-lg text-sm text-on-primary/90">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-3 text-xs text-on-primary/80">
            <span>{post.date}</span><span>·</span><span>{post.readTime}</span><span>·</span><span>{site.name}</span>
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS — full width at top */}
      <section className="border-b border-outline-variant bg-surface-variant py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:max-w-xs">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Table of contents</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-3">
              <a href="#faqs" className="text-xs font-bold text-on-surface hover:text-primary">FAQs</a>
              {headings.map((h, i) => (
                <a key={i} href={`#section-${i}`} className="text-xs text-on-surface-variant hover:text-primary">
                  {h.length > 50 ? h.slice(0, 50) + "..." : h}
                </a>
              ))}
              <a href="#near-me" className="text-xs text-on-surface-variant hover:text-primary">Near me locations</a>
              <a href="#how-scene" className="text-xs text-on-surface-variant hover:text-primary">How's the repair scene</a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT — left content + right sidebar */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[3fr,1fr]">
            {/* LEFT — content */}
            <div className="space-y-5">
              {/* FAQs at top */}
              {faqs.length > 0 && (
                <div id="faqs" className="scroll-mt-20 rounded-3xl border border-outline-variant bg-surface p-6">
                  <h2 className="text-lg font-extrabold text-on-surface">FAQs — {post.category} repair in {site.city}</h2>
                  <p className="mt-1 text-xs text-on-surface-variant">Quick answers before you read the full guide.</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {faqs.map((faq, i) => (
                      <details key={i} className="group rounded-2xl border border-outline-variant bg-background p-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-on-surface">
                          {faq.split("?")[0] + "?"}
                          <Icon name="chevron" className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="mt-3 text-sm text-on-surface-variant">
                          {faq.split("?").slice(1).join("?").trim() || post.excerpt}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Article content with section IDs on headings */}
              {post.content.map((para, i) => {
                const heading = isHeading(para);
                return (
                  <div key={i} id={heading ? `section-${headings.indexOf(para)}` : undefined} className={heading ? "scroll-mt-20" : ""}>
                    {heading ? (
                      <h2 className="text-lg font-extrabold text-on-surface">{para}</h2>
                    ) : (
                      <p className="text-sm leading-7 text-on-surface-variant">{para}</p>
                    )}
                    {(i === Math.floor(post.content.length / 2)) && (
                      <div className="my-8 rounded-3xl bg-surface-variant p-6">
                        <p className="text-base font-extrabold text-on-surface">Need a repair today in {site.city}?</p>
                        <p className="mt-1 text-sm text-on-surface-variant">Same-day slots. Free diagnosis. Quality assured. Call us now.</p>
                        <CallButton variant="dark"  />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* HOW'S? — question type section */}
              <div id="how-scene" className="scroll-mt-20 mt-10 rounded-3xl border border-outline-variant bg-surface p-6">
                <h2 className="text-lg font-extrabold text-on-surface">How's the repair scene in {site.city}?</h2>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  In {site.city}, appliance repair is in high demand across {areas.length}+ neighbourhoods. From Indiranagar and Koramangala to Whitefield and Electronic City, residents rely on same-day repair services for their microwaves, ACs, washing machines, refrigerators, water filters and kitchen chimneys. The city's mix of Cauvery water and borewell water also makes water purifier maintenance essential in areas like Marathahalli, HSR Layout and BTM Layout where water quality varies significantly.
                </p>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  Whether you're in Jayanagar looking for refrigerator repair near Jayanagar 4th Block, or in Hebbal searching for AC gas refill in Hebbal, our verified technicians reach every corner of {site.city} within 45 to 60 minutes. Same-day slots are available across all {areas.length}+ neighbourhoods — from the city centre to the peripheral suburbs.
                </p>
              </div>

              {/* NEAR ME — location section */}
              <div id="near-me" className="scroll-mt-20 mt-6">
                <h2 className="text-lg font-extrabold text-on-surface">{post.category} repair near me in {site.city}</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Looking for {post.category.toLowerCase()} repair near you? We serve all of {site.city}. Here are some areas where we provide same-day {post.category.toLowerCase()} repair:
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {nearbyAreas.map((area) => (
                    <li key={area}>
                      <Link
                        href={`/areas/${slugify(area)}`}
                        className="rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                      >
                        {post.category} repair in {area}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PROBLEM GUIDES — keyword pages for this service */}
              {postKeywords.length > 0 && (
                <div className="mt-6 rounded-3xl border border-outline-variant bg-surface p-6">
                  <h2 className="text-lg font-extrabold text-on-surface">
                    Common {post.category.toLowerCase()} problems — quick guides
                  </h2>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    Symptom-by-symptom guides for {post.category.toLowerCase()} repair in {site.city}.
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {postKeywords.map((k) => (
                      <li key={k.slug}>
                        <Link
                          href={`/keywords/${k.slug}`}
                          className="block rounded-lg border border-outline-variant bg-background px-3 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                        >
                          {k.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT — sidebar CTA + services */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Sidebar CTA */}
                <div className="rounded-2xl bg-surface-variant p-5">
                  <p className="text-sm font-bold text-on-surface">Book a repair</p>
                  <p className="mt-1 text-xs text-on-surface-variant">Same-day slots across {site.city}.</p>
                  <CallButton variant="light" />
                </div>

                {/* Related services */}
                <div className="rounded-2xl border border-outline-variant bg-surface p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">Our services</p>
                  <ul className="mt-3 space-y-2">
                    {relevantServices.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="text-xs font-medium text-on-surface-variant transition-colors hover:text-primary">
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CONTINUE READING */}
      <section className="bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Continue reading
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="card-zoom flex flex-col gap-2 rounded-3xl border border-outline-variant bg-surface p-6"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={rp.image} alt={rp.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
                <span className="inline-flex w-fit rounded-lg bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
                  {rp.category}
                </span>
                <h3 className="text-base font-extrabold text-on-surface">{rp.title}</h3>
                <p className="text-sm text-on-surface-variant">{rp.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-bold text-primary">
                  Read more <Icon name="arrow" className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
