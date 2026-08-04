"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/app/(ui)/components/icons";
import { analytics } from "@/app/(common-lib)/analytics";

type Answers = {
  brand?: string;
  type?: string;
  symptom?: string;
  age?: string;
  warranty?: string;
  name?: string;
  phone?: string;
};

const brands = [
  "Samsung",
  "LG",
  "IFB",
  "Whirlpool",
  "Bajaj",
  "Godrej",
  "Panasonic",
  "Other",
];
const types = ["Solo", "Grill", "Convection", "Not sure"];
const symptoms = [
  "Not heating",
  "Not turning on",
  "Buttons/panel not working",
  "Sparking",
  "Turntable not rotating",
  "Door/latch issue",
  "Noise",
  "Uneven heating",
  "Display off",
  "Other",
];
const ages = ["Less than 2 years", "2–5 years", "5+ years", "Don't know"];
const warrantyOpts = ["Yes", "No", "Not sure"];

const TOTAL = 5;

export function MicrowaveQuiz() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = (n: number) => setStep(Math.max(0, Math.min(TOTAL, n)));
  const pick = (key: keyof Answers, value: string) => {
    setA((p) => ({ ...p, [key]: value }));
    setTimeout(() => go(step + 1), 130);
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = (a.phone || "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliance: "microwave-repair",
          brand: a.brand,
          issue: [a.type, a.symptom, a.age, a.warranty ? `warranty:${a.warranty}` : null]
            .filter(Boolean)
            .join(" · "),
          name: a.name,
          phone: digits,
          source: "microwave-quiz",
          telemetry: analytics.getTelemetry(),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not submit");
      analytics.leadFormSubmit("microwave-repair", "microwave-quiz");
      analytics.generateLead("microwave-quiz", "microwave-repair");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-primary-container p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary">
          <Icon name="check-circle" className="h-6 w-6" />
        </span>
        <p className="text-lg font-bold text-on-primary-container">
          Thanks! We&apos;ve got it.
        </p>
        <p className="text-sm text-on-primary-container/80">
          Our microwave specialist will call you within 15 minutes to confirm the
          slot and a free diagnosis.
        </p>
      </div>
    );
  }

  const progress = Math.round((step / TOTAL) * 100);

  return (
    <div className="card-zoom rounded-3xl border border-outline-variant bg-surface p-6 sm:p-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-on-surface-variant">
          <span>
            Step {step + 1} of {TOTAL + 1}
          </span>
          {step > 0 && (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="font-medium text-primary hover:underline"
            >
              Back
            </button>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <Field label="Which brand is your microwave?">
          <Chips options={brands} value={a.brand} onPick={(v) => pick("brand", v)} />
        </Field>
      )}
      {step === 1 && (
        <Field label="What type of microwave?">
          <Chips options={types} value={a.type} onPick={(v) => pick("type", v)} />
        </Field>
      )}
      {step === 2 && (
        <Field label="What's the symptom?">
          <Chips options={symptoms} value={a.symptom} onPick={(v) => pick("symptom", v)} />
        </Field>
      )}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <Field label="How old is it?">
            <Chips options={ages} value={a.age} onPick={(v) => pick("age", v)} />
          </Field>
          <Field label="Is it under warranty?">
            <Chips options={warrantyOpts} value={a.warranty} onPick={(v) => pick("warranty", v)} />
          </Field>
          <button
            type="button"
            onClick={() => go(step + 1)}
            className="self-end rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
          >
            Continue
          </button>
        </div>
      )}
      {step === 4 && (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <p className="text-sm text-on-surface-variant">
            Almost done. Share your number and our microwave specialist will call you
            within 15 minutes — free diagnosis, no visit charge to quote.
          </p>
          <Input
            label="Your name"
            optional
            value={a.name || ""}
            onChange={(v) => setA((p) => ({ ...p, name: v }))}
            placeholder="e.g. Priya"
          />
          <Input
            label="Mobile number"
            value={a.phone || ""}
            onChange={(v) => setA((p) => ({ ...p, phone: v }))}
            placeholder="10-digit mobile number"
            type="tel"
            inputMode="numeric"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Get my free diagnosis call"}
            {!submitting && <Icon name="arrow" className="h-4 w-4" />}
          </button>
          <p className="text-xs text-muted">No spam. We only call to confirm the fault and slot.</p>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-semibold text-on-surface">{label}</p>
      {children}
    </div>
  );
}

function Chips({
  options,
  value,
  onPick,
}: {
  options: string[];
  value?: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onPick(o)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
              active
                ? "border-primary bg-primary-container text-on-primary-container"
                : "border-outline-variant bg-background text-on-surface hover:border-primary hover:bg-primary-container"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  optional,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  optional?: boolean;
  type?: string;
  inputMode?: "numeric" | "tel" | "text";
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-on-surface">
        {label}
        {optional && <span className="text-muted"> (optional)</span>}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-outline bg-background px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
      />
    </label>
  );
}
