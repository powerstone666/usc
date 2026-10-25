import { steps } from "@/app/(config)/site";

export function HowItWorks() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="flex gap-4 rounded-2xl bg-surface-variant p-5 sm:flex-col sm:gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-on-primary">
            {i + 1}
          </span>
          <div>
            <h3 className="text-base font-bold text-on-surface">{s.title}</h3>
            <p className="mt-1 text-base text-on-surface-variant">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
