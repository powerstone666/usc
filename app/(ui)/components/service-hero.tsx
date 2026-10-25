import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AnswerBlock } from "@/app/(ui)/components/answer-block";
import { LastUpdated } from "@/app/(ui)/components/last-updated";
import { PageSchema, type Crumb, type PageType } from "@/app/(ui)/components/page-schema";

export function ServiceHero({
  image,
  title,
  tagline,
  breadcrumb,
  children,
  path,
  answer,
  description,
  pageType,
  updated,
  published,
  parent,
}: {
  image?: string;
  title: string;
  tagline: string;
  breadcrumb?: ReactNode;
  children?: ReactNode;
  /** Canonical path of the page, e.g. "/services/ac-repair". Feeds the page schema. */
  path: string;
  /** 20–80 word self-contained answer shown near the top and marked as speakable. */
  answer?: string;
  description?: string;
  pageType?: PageType;
  updated?: string;
  published?: string;
  /** Optional middle breadcrumb, e.g. { name: "Blog", path: "/blog" }. */
  parent?: Crumb;
}) {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, ...(parent ? [parent] : []), { name: title, path }];
  return (
    <section className="bg-primary text-on-primary">
      <PageSchema
        path={path}
        name={title}
        description={description ?? tagline}
        type={pageType}
        updated={updated}
        published={published}
        crumbs={crumbs}
      />
      <div
        className={`mx-auto max-w-6xl px-4 pb-12 pt-28 min-[360px]:pt-24 lg:pb-16 lg:pt-28 ${
          image ? "grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12" : ""
        }`}
      >
        <div>
          <nav className="text-sm text-on-primary/85" aria-label="Breadcrumb">
            {breadcrumb ?? (
              <>
                <Link href="/" className="inline-block py-2 hover:underline">
                  Home
                </Link>
                <span aria-hidden="true"> / </span>
                <span>{title}</span>
              </>
            )}
          </nav>
          <h1 className="mt-3 max-w-2xl text-xl font-extrabold leading-[1.2] tracking-tight min-[360px]:text-2xl min-[380px]:text-[1.75rem] min-[380px]:leading-[1.15] sm:text-4xl sm:leading-tight">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-on-primary/90 sm:text-lg">
            {tagline}
          </p>
          {children}
          {answer && <AnswerBlock>{answer}</AnswerBlock>}
          <LastUpdated date={updated} />
        </div>
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-secondary lg:aspect-[4/3]">
            <Image
              src={image}
              alt={title}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 85vw, 40vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
