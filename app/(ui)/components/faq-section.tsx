import Image from "next/image";
import type { Faq } from "@/app/(config)/content";
import { Icon } from "@/app/(ui)/components/icons";
import { JsonLd } from "@/app/(ui)/components/json-ld";
import { Reveal } from "@/app/(ui)/components/reveal";

export function FaqSection({
  title,
  subtitle,
  faqs,
  image,
}: {
  title: string;
  subtitle?: string;
  faqs: Faq[];
  image?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="bg-surface-variant py-14 lg:py-20">
      <div className="mx-auto max-w-5xl px-4">
      <div className={image ? "grid gap-8 lg:grid-cols-[1fr,3fr]" : ""}>
        {image && (
          <div className="relative hidden h-48 overflow-hidden rounded-3xl lg:block lg:self-start">
            <Image
              src={image}
              alt={title}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        )}
          <div>
            <Reveal>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 text-sm text-on-surface-variant">
                  {subtitle}
                </p>
              )}
            </Reveal>
            <JsonLd data={jsonLd} />
            <div className="mt-6 flex flex-col gap-3">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.03}>
                  <details className="group card-zoom rounded-2xl border border-outline-variant bg-surface p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-on-surface">
                      {f.q}
                      <Icon
                        name="chevron"
                        className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-90"
                      />
                    </summary>
                    <p className="mt-3 text-sm text-on-surface-variant">
                      {f.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
