import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/app/(config)/site";
import { homeFaqs, serviceProblems } from "@/app/(config)/content";
import { blogPosts } from "@/app/(config)/blog";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { CallButton } from "@/app/(ui)/components/call-button";
import { ServiceTile } from "@/app/(ui)/components/service-tile";
import { HowItWorks } from "@/app/(ui)/components/how-it-works";
import { Reviews } from "@/app/(ui)/components/reviews";
import { Coverage } from "@/app/(ui)/components/coverage";
import { WhyChooseUs } from "@/app/(ui)/components/why-choose-us";
import { BrandsGrid } from "@/app/(ui)/components/brands-grid";
import { FaqSection } from "@/app/(ui)/components/faq-section";
import { Reveal } from "@/app/(ui)/components/reveal";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero — image blended with blue via horizontal gradient */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/hero.png"
          alt="Appliance repair technician at work in a Bengaluru kitchen"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/30" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-28 text-on-primary lg:pb-24 lg:pt-36">
          <Reveal y={0}>
            <p className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {site.city} · same-day repair
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Microwave, AC, washing machine &amp; fridge repair services in Bengaluru
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-xl text-base text-on-primary/90 sm:text-lg">
              Same-day appliance repair by verified technicians. Free
              diagnosis, transparent quotes, genuine parts, quality
              assured. Serving 84+ neighbourhoods.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <CallButton variant="light" showNumber />
              <Link
                href="/services/microwave-repair"
                className="inline-flex items-center justify-center gap-2 btn-zoom rounded-lg border-2 border-white/40 px-5 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-white/10"
              >
                Diagnose my microwave
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-xs font-medium text-on-primary/80">
              {site.warranty} · {site.damageCover} · {site.hours}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services — image on top, text below */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              What can we fix today?
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Pick your appliance. Same-day repair across {site.city}.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05} className="h-full">
                <ServiceTile service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Common problems — with appliance images */}
      <section className="bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Common problems we fix
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              From microwave not heating to AC gas refill — we repair every
              common appliance fault in Bengaluru.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal
                key={s.slug}
                delay={i * 0.05}
              >
                <div className="card-zoom flex flex-col rounded-3xl bg-surface p-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                    <Image
                      src={`/${s.icon}-problem.png`}
                      alt={`${s.name} — common problems and repair in Bengaluru`}
                      fill
                      sizes="(max-width: 640px) 100vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-on-surface">
                    {s.name}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {serviceProblems[s.slug].slice(0, 3).map((p) => (
                      <li
                        key={p.title}
                        className="flex items-center gap-1.5 text-sm text-on-surface-variant"
                      >
                        <Icon name={p.icon as IconName} className="h-3.5 w-3.5 shrink-0 text-primary" />
                        {p.title}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary"
                  >
                    Read more
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-4">
            <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:block">
              <Image src="/parts.png" alt="Genuine appliance spare parts" fill sizes="80px" className="object-cover" />
            </div>
            <Reveal>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
                How it works
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Four steps from fault to fixed — same day, at your doorstep.
              </p>
            </Reveal>
          </div>
          <div className="mt-8">
            <Reveal>
              <HowItWorks />
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="reviews"
        className="scroll-mt-16 bg-surface-variant py-14 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-4">
            <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:block">
              <Image src="/happy-home.png" alt="Happy Bengaluru homes with working appliances" fill sizes="80px" className="object-cover" />
            </div>
            <Reveal>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
                Bengaluru trusts us with their appliances
              </h2>
            </Reveal>
          </div>
          <div className="mt-8">
            <Reveal>
              <Reviews />
            </Reveal>
          </div>
        </div>
      </section>

      <BrandsGrid />

      <FaqSection
        title="Frequently asked questions"
        subtitle="Everything you need to know about appliance repair in Bengaluru — microwave, AC, washing machine and refrigerator."
        faqs={homeFaqs.slice(0, 6)}
        image="/microwave.png"
      />

      <section id="coverage" className="scroll-mt-16 py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Coverage />
        </div>
      </section>

      {/* Blog section */}
      <section id="blog" className="scroll-mt-16 bg-surface-variant py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
                  Blog &amp; guides
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Expert tips to keep your appliances running longer.
                </p>
              </div>
              <Link
                href="/blog"
                className="btn-zoom inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary"
              >
                All articles
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, i) => (
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
                  <h3 className="text-lg font-extrabold leading-tight text-on-surface">
                    {post.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
