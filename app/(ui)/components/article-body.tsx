import type { ReactNode } from "react";

export type ArticleSection = { id: string; title: string; body: ReactNode };

// Full-length article: every section stays expanded (long, keyword-rich guides are intentional).
export function ArticleBody({
  intro,
  sections,
  cta,
  ctaAfter = 1,
}: {
  intro: ReactNode;
  sections: ArticleSection[];
  cta?: ReactNode;
  ctaAfter?: number;
}) {
  return (
    <div>
      <div className="space-y-5">{intro}</div>
      {sections.map((section, i) => (
        <div key={section.id}>
          <section id={section.id} className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-extrabold leading-snug text-on-surface sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4">{section.body}</div>
          </section>
          {cta && i === Math.min(ctaAfter, sections.length - 1) && <div className="mt-10">{cta}</div>}
        </div>
      ))}
    </div>
  );
}
