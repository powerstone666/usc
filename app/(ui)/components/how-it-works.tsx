import { steps } from "@/app/(config)/site";

export function HowItWorks() {
  return (
    <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Base line — faint, from card 1 to card 4 */}
      <div
        className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-0.5 rounded-full bg-primary opacity-20 lg:block"
        aria-hidden="true"
      />
      {/* Fill line — grows left to right, fills with solid color */}
      <div
        className="fill-line absolute left-[12.5%] top-10 hidden h-0.5 rounded-full bg-primary lg:block"
        aria-hidden="true"
      />

      {steps.map((s, i) => (
        <li
          key={s.title}
          className={`card-zoom shine-${i + 1} relative flex flex-col gap-3 rounded-3xl bg-surface-variant p-6`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
            {i + 1}
          </span>
          <p className="text-base font-semibold text-on-surface">{s.title}</p>
          <p className="text-sm text-on-surface-variant">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
