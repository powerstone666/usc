import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/app/(config)/blog";
import { site } from "@/app/(config)/site";
import { Icon } from "@/app/(ui)/components/icons";
import { Reveal } from "@/app/(ui)/components/reveal";

export const metadata: Metadata = {
  title: "Blog — Appliance Repair Tips & Guides",
  description:
    "Expert guides on microwave, AC, washing machine, refrigerator, water filter and chimney maintenance and repair. Tips to extend your appliance's life.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return (
    <div className="flex flex-col">
      <section className="bg-primary pb-14 pt-28 text-on-primary lg:pb-20 lg:pt-32">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-on-primary/80">
              Blog
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Appliance repair tips &amp; guides
            </h1>
            <p className="mt-4 max-w-lg text-base text-on-primary/90">
              Expert advice on maintaining and repairing your home appliances
              in {site.city}. From microwaves to water filters — keep your
              appliances running longer.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-zoom flex h-full flex-col gap-3 rounded-3xl border border-outline-variant bg-surface p-6"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <span className="inline-flex w-fit rounded-lg bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
                    {post.category}
                  </span>
                  <h2 className="text-lg font-extrabold leading-tight text-on-surface">
                    {post.title}
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                    Read more
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
