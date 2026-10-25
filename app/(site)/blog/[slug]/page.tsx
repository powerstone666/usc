import { formatDate } from "@/app/(common-lib)/format-date";
import { ServiceHero } from "@/app/(ui)/components/service-hero";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/app/(config)/blog";
import { keywords } from "@/app/(config)/keywords";
import { site, areas } from "@/app/(config)/site";
import { slugify } from "@/app/(common-lib)/slugify";
import { Icon } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { JsonLd } from "@/app/(ui)/components/json-ld";
import { ArticleToc } from "@/app/(ui)/components/article-toc";
import { ArticleBody, type ArticleSection } from "@/app/(ui)/components/article-body";
import { ScrollShortcuts } from "@/app/(ui)/components/scroll-shortcuts";
import { truncate } from "@/app/(common-lib)/truncate";
import { parseFaqParagraph } from "@/app/(config)/aeo";

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
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${site.url}${post.image}`;
  return {
    title: { absolute: post.title },
    description: truncate(post.excerpt),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${site.url}/blog/${slug}`,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
  };
}

function isHeading(text: string): boolean {
  // A line ending in "." "?" "!" or ":" is a sentence or a list intro, not a heading.
  return text.startsWith("#") || (!/[.?!:]$/.test(text) && text.length < 80);
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
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const startIndex = (postIndex >= 0 ? postIndex * 8 : 0) % Math.max(1, areas.length - 12);
  const nearbyAreas = areas.slice(startIndex, startIndex + 12);
  const postKeywords = keywords.filter((k) => k.service === post.service && !k.isComparison).slice(0, 6);

  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${site.url}${post.image}`;

  const firstHeading = post.content.findIndex(isHeading);
  const introParas = firstHeading === -1 ? post.content : post.content.slice(0, firstHeading);
  const paraClass = "text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8";
  const contentSections: { id: string; title: string; paras: string[] }[] = [];
  if (firstHeading !== -1) {
    for (const para of post.content.slice(firstHeading)) {
      if (isHeading(para)) {
        contentSections.push({ id: `section-${contentSections.length}`, title: para.replace(/^#+\s*/, ""), paras: [] });
      } else {
        contentSections[contentSections.length - 1].paras.push(para);
      }
    }
  }
  const faqPairs = contentSections
    .filter((sec) => /^FAQs?\b/i.test(sec.title))
    .flatMap((sec) => sec.paras.map(parseFaqParagraph).filter((qa): qa is { q: string; a: string } => qa !== null));
  const articleSections: ArticleSection[] = [
    ...contentSections.map((sec) => ({
      id: sec.id,
      title: sec.title,
      body: (
        <>
          {sec.paras.map((para, i) => {
            const qa = /^FAQs?\b/i.test(sec.title) ? parseFaqParagraph(para) : null;
            return qa ? (
              <div key={i}>
                <h3 className="text-lg font-bold leading-snug text-on-surface">{qa.q}</h3>
                <p className={`mt-1 ${paraClass}`}>{qa.a}</p>
              </div>
            ) : (
              <p key={i} className={paraClass}>
                {para}
              </p>
            );
          })}
        </>
      ),
    })),
    {
      id: "how-scene",
      title: `How's the repair scene in ${site.city}?`,
      body: (
        <>
          <p className={paraClass}>
            In {site.city}, appliance repair is in high demand across {areas.length}+ neighbourhoods. From Indiranagar and Koramangala to Whitefield and Electronic City, residents rely on same-day repair services for their microwaves, ACs, washing machines, refrigerators, water filters and kitchen chimneys. The city&apos;s mix of Cauvery water and borewell water also makes water purifier maintenance essential in areas like Marathahalli, HSR Layout and BTM Layout where water quality varies significantly.
          </p>
          <p className={paraClass}>
            Whether you&apos;re in Jayanagar looking for refrigerator repair near Jayanagar 4th Block, or in Hebbal searching for AC gas refill in Hebbal, our verified technicians reach every corner of {site.city} within 45 to 60 minutes. Same-day slots are available across all {areas.length}+ neighbourhoods — from the city centre to the peripheral suburbs.
          </p>
        </>
      ),
    },
    {
      id: "near-me",
      title: `${post.category} repair near me in ${site.city}`,
      body: (
        <>
          <p className={paraClass}>
            Looking for {post.category.toLowerCase()} repair near you? We serve all of {site.city}. Here are some areas where we provide same-day {post.category.toLowerCase()} repair:
          </p>
          <ul className="flex flex-wrap gap-2">
            {nearbyAreas.map((area) => (
              <li key={area}>
                <Link
                  href={`/areas/${slugify(area)}`}
                  className="flex min-h-10 items-center rounded-xl border border-outline-variant bg-surface px-3.5 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  {post.category} repair in {area}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    ...(postKeywords.length > 0
      ? [
          {
            id: "problem-guides",
            title: `Common ${post.category.toLowerCase()} problems — quick guides`,
            body: (
              <>
                <p className={paraClass}>
                  Symptom-by-symptom guides for {post.category.toLowerCase()} repair in {site.city}.
                </p>
                <ul className="flex flex-wrap gap-2">
                  {postKeywords.map((k) => (
                    <li key={k.slug}>
                      <Link
                        href={`/keywords/${k.slug}`}
                        className="flex min-h-10 items-center rounded-xl border border-outline-variant bg-background px-3.5 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                      >
                        {k.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
        ]
      : []),
  ];

  const tocItems = articleSections.map((sec) => ({ id: sec.id, label: sec.title }));

  return (
    <div>
      <ScrollShortcuts endId="continue-reading" />
      {faqPairs.length >= 1 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqPairs.map((qa) => ({
              "@type": "Question",
              name: qa.q,
              acceptedAnswer: { "@type": "Answer", text: qa.a },
            })),
          }}
        />
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: imageUrl,
          datePublished: post.date,
          dateModified: post.date,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${site.url}/blog/${slug}`,
          },
          author: {
            "@type": "Person",
            name: "USC Technical Team",
          },
          publisher: {
            "@type": "Organization",
            name: site.name,
            logo: {
              "@type": "ImageObject",
              url: `${site.url}/favicon-192x192.png`,
            },
          },
        }}
      />

      {/* HERO */}
      <ServiceHero
        path={`/blog/${slug}`}
        parent={{ name: "Blog", path: "/blog" }}
        answer={post.excerpt}
        description={truncate(post.excerpt)}
        published={post.date}
        updated={post.date}
        image={post.image}
        title={post.title}
        tagline={`A ${post.readTime} guide for ${site.city} homes`}
        breadcrumb={
          <>
            <Link href="/blog" className="inline-block py-2 hover:underline">
              Blog
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{post.category}</span>
          </>
        }
      >
        <p className="mt-4 text-sm text-on-primary/85">
          {formatDate(post.date)} · {post.readTime} · {site.name}
        </p>
      </ServiceHero>

      {/* ARTICLE — sticky contents on the left, readable column on the right */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
            <aside>
              <div className="space-y-4 lg:sticky lg:top-24">
                <ArticleToc items={tocItems} />
                <div className="hidden rounded-2xl bg-primary p-5 text-on-primary lg:block">
                  <p className="text-base font-extrabold">Need a repair today?</p>
                  <p className="mt-1 text-sm text-on-primary/85">Same-day slots across {site.city}.</p>
                  <div className="mt-4">
                    <CallButton variant="light" />
                  </div>
                </div>
              </div>
            </aside>

            <article className="min-w-0 max-w-3xl">
              <a
                href="#continue-reading"
                className="mb-5 inline-flex min-h-11 items-center gap-1 rounded-xl text-sm font-bold text-primary hover:underline"
              >
                Skip to related guides
                <Icon name="arrow" className="h-4 w-4 rotate-90" />
              </a>
              <ArticleBody
                intro={introParas.map((para, i) => (
                  <p key={i} className="text-base leading-7 text-on-surface sm:text-lg sm:leading-8">
                    {para}
                  </p>
                ))}
                sections={articleSections}
                cta={
                  <div className="rounded-2xl border border-outline-variant bg-surface-variant p-5 sm:p-6">
                    <p className="text-lg font-extrabold text-on-surface">Need a repair today in {site.city}?</p>
                    <p className="mt-1 text-base text-on-surface-variant">Same-day slots. Free diagnosis. Quality assured.</p>
                    <div className="mt-4">
                      <CallButton variant="dark" />
                    </div>
                  </div>
                }
              />
            </article>
          </div>
        </div>
      </section>

      {/* CONTINUE READING */}
      <section id="continue-reading" className="scroll-mt-20 bg-surface-variant py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            Continue reading
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="card-zoom flex flex-col gap-2 rounded-2xl border border-outline-variant bg-surface p-4"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <Image src={rp.image} alt={rp.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide text-primary">
                  {rp.category}
                </span>
                <h3 className="text-base font-extrabold text-on-surface">{rp.title}</h3>
                <p className="text-base text-on-surface-variant">{rp.excerpt}</p>
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
