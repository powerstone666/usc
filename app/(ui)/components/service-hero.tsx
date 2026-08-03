import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function ServiceHero({
  image,
  title,
  tagline,
  children,
}: {
  image?: string;
  title: string;
  tagline: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-on-primary">
      {image && (
        <>
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/30" />
        </>
      )}
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 lg:pb-20 lg:pt-32">
        <nav className="text-xs text-on-primary/80" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          · <span>{title}</span>
        </nav>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-on-primary/90 sm:text-base">
          {tagline}
        </p>
        {children}
      </div>
    </section>
  );
}
