"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/app/(ui)/components/icons";

export type BlogListPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
};

// Every post stays in the HTML; filtering only hides cards, so crawlers still see all links.
export function BlogList({ posts }: { posts: BlogListPost[] }) {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const visible = posts.filter((p) => category === "All" || p.category === category);
  const featuredSlug = visible[0]?.slug;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">All guides</h2>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Filter guides by category">
        {categories.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(c)}
              className={`min-h-11 shrink-0 rounded-xl border px-4 text-sm font-bold transition-colors ${
                active
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "guide" : "guides"}
        {category !== "All" && <> in {category}</>}
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {posts.map((post) => {
          const shown = visible.includes(post);
          const featured = post.slug === featuredSlug;
          return (
            <li
              key={post.slug}
              className={`${shown ? "" : "hidden"} ${featured ? "sm:col-span-2 lg:col-span-3" : ""}`}
            >
              <Link
                href={`/blog/${post.slug}`}
                className={`card-zoom group flex h-full overflow-hidden rounded-2xl border border-outline-variant bg-surface ${
                  featured ? "flex-col lg:flex-row" : "flex-col"
                }`}
              >
                <span
                  className={`relative block overflow-hidden ${
                    featured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className={`flex flex-1 flex-col gap-2 p-5 ${featured ? "lg:justify-center lg:p-8" : ""}`}>
                  <span className="text-sm font-bold uppercase tracking-wide text-primary">
                    {post.category}
                  </span>
                  <h3
                    className={`font-extrabold leading-snug text-on-surface ${
                      featured ? "text-xl sm:text-2xl lg:text-3xl" : "text-lg"
                    }`}
                  >
                    {post.title}
                  </h3>
                  <span className={`text-base text-on-surface-variant ${featured ? "" : "line-clamp-3"}`}>
                    {post.excerpt}
                  </span>
                  <span className="mt-auto flex items-center justify-between gap-3 pt-3 text-sm">
                    <span className="text-muted">
                      {post.date} · {post.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-primary">
                      Read guide
                      <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
