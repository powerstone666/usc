import Image from "next/image";
import type { Faq } from "@/app/(config)/content";
import { Icon } from "@/app/(ui)/components/icons";
import { JsonLd } from "@/app/(ui)/components/json-ld";
import { SectionHeading } from "@/app/(ui)/components/section-heading";

export function FaqSection({
  title,
  subtitle,
  faqs,
  image,
  includeSchema = true,
}: {
  title: string;
  subtitle?: string;
  faqs: Faq[];
  image?: string;
  includeSchema?: boolean;
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
    <section className="content-auto bg-surface-variant py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className={image ? "grid gap-8 lg:grid-cols-[1fr_3fr]" : ""}>
          {image && (
            <div className="relative hidden h-48 overflow-hidden rounded-2xl lg:block lg:self-start">
              <Image
                src={image}
                alt=""
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <SectionHeading title={title} subtitle={subtitle} />
            {includeSchema && <JsonLd data={jsonLd} />}
            <div className="mt-6 flex flex-col gap-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-outline-variant bg-surface"
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-3 text-base font-bold text-on-surface [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Icon
                      name="chevron"
                      className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <p className="px-5 pb-5 text-base text-on-surface-variant">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
