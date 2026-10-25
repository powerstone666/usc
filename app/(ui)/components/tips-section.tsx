import { SectionHeading } from "@/app/(ui)/components/section-heading";

export function TipsSection({
  tips,
}: {
  tips: string[];
  image?: string;
}) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          title="Maintenance tips"
          subtitle="Keep your appliance running longer."
        />
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {tips.map((t, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-outline-variant bg-surface p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-on-primary">
                {i + 1}
              </span>
              <p className="pt-1 text-base text-on-surface-variant">{t}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
