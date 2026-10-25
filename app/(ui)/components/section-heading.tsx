import type { ReactNode } from "react";

export function SectionHeading({
  title,
  subtitle,
  action,
  tone = "default",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  tone?: "default" | "inverse";
}) {
  const inverse = tone === "inverse";
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2
          className={`text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl ${
            inverse ? "text-on-primary" : "text-on-surface"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-2 text-base ${
              inverse ? "text-on-primary/85" : "text-on-surface-variant"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
