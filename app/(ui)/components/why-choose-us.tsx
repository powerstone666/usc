import { whyChooseUs } from "@/app/(config)/content";
import { Icon, type IconName } from "@/app/(ui)/components/icons";
import { Reveal } from "@/app/(ui)/components/reveal";

export function WhyChooseUs() {
  return (
    <section className="bg-primary py-14 text-on-primary lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Why Bengaluru chooses us
          </h2>
          <p className="mt-2 text-sm text-on-primary/80">
            Not just another repair service — here&apos;s what makes us
            different.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="card-zoom flex h-full flex-col gap-2 rounded-3xl bg-white/10 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <Icon name={item.icon as IconName} className="h-5 w-5" />
                </span>
                <p className="text-base font-bold">{item.title}</p>
                <p className="text-sm text-on-primary/80">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
