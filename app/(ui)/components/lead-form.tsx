"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/app/(ui)/components/icons";
import { analytics } from "@/app/(common-lib)/analytics";
import {
  normalizePhone,
  isValidIndianMobile,
  getPhoneValidationError,
} from "@/app/(common-lib)/validation";

type State = "idle" | "sending" | "done" | "error";

export function LeadForm({
  appliance,
  source,
}: {
  appliance: string;
  source: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const cleanPhone = normalizePhone(phone);
  const isPhoneValid = isValidIndianMobile(cleanPhone);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const phoneError = getPhoneValidationError(phone);
    if (phoneError) {
      setError(phoneError);
      setState("error");
      return;
    }

    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliance,
          issue: issue.trim(),
          name: name.trim(),
          phone: cleanPhone,
          source,
          telemetry: analytics.getTelemetry(),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not submit");
      analytics.leadFormSubmit(appliance, source);
      analytics.generateLead(source, appliance);
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-primary-container p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary">
          <Icon name="check-circle" className="h-6 w-6" />
        </span>
        <p className="text-lg font-bold text-on-primary-container">
          Request received!
        </p>
        <p className="text-base text-on-primary-container/90">
          Our technician will call you shortly to confirm the slot.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-5 rounded-2xl border border-outline-variant bg-surface p-5 sm:p-8"
    >
      <Field label="Name" optional>
        <input
          autoComplete="name"
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="min-h-12 w-full rounded-xl border border-outline bg-background px-4 py-3 text-base text-on-surface outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </Field>
      <Field label="Mobile number">
        <div className="flex overflow-hidden rounded-xl border border-outline bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <span className="flex items-center gap-1 border-r border-outline-variant bg-surface-variant/40 px-3.5 text-sm font-bold text-on-surface-variant select-none">
            +91
          </span>
          <input
            inputMode="numeric"
            type="tel"
            autoComplete="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              const digits = normalizePhone(e.target.value);
              setPhone(digits);
              if (error) setError("");
            }}
            placeholder="98765 43210"
            className="w-full bg-transparent px-4 py-3 text-base font-semibold tracking-wider text-on-surface outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-muted"
          />
          {phone.length > 0 && (
            <div className="flex items-center pr-3">
              {isPhoneValid ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Icon name="check" className="h-4 w-4" filled />
                </span>
              ) : (
                <span className="text-sm font-semibold text-muted">
                  {phone.length}/10
                </span>
              )}
            </div>
          )}
        </div>
        <span className="text-sm text-on-surface-variant">
          Enter a 10-digit mobile number for immediate callback
        </span>
      </Field>
      <Field label="What's the issue?" optional>
        <textarea
          value={issue}
          maxLength={500}
          onChange={(e) => setIssue(e.target.value)}
          rows={3}
          placeholder="e.g. Not cooling, makes a noise…"
          className="min-h-12 w-full rounded-xl border border-outline bg-background px-4 py-3 text-base text-on-surface outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </Field>
      {state === "error" && (
        <p role="alert" className="text-sm font-medium text-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        aria-busy={state === "sending"}
        className="btn-zoom inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-on-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Request a callback"}
        {state !== "sending" && <Icon name="arrow" className="h-4 w-4" />}
      </button>
    </form>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-on-surface">
        {label}
        {optional && <span className="text-muted"> (optional)</span>}
      </span>
      {children}
    </label>
  );
}
