import Image from "next/image";

export function TipsSection({
  tips,
  image,
}: {
  tips: string[];
  image?: string;
}) {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-4">
          {image && (
            <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:block">
              <Image
                src={image}
                alt="Maintenance tips"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
              Maintenance tips
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Keep your appliance running longer.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 card-zoom rounded-2xl border border-outline-variant bg-surface p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-on-primary">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed text-on-surface-variant">
                {t}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
