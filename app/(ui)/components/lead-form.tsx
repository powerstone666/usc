"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/app/(ui)/components/icons";

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

  async function submit(e: FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit mobile number.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appliance, issue, name, phone: digits, source }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not submit");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-primary-container p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary">
          <Icon name="check-circle" className="h-6 w-6" />
        </span>
        <p className="text-lg font-bold text-on-primary-container">
          Request received!
        </p>
        <p className="text-sm text-on-primary-container/80">
          Our technician will call you shortly to confirm the slot.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 card-zoom rounded-3xl border border-outline-variant bg-surface p-6 sm:p-8"
    >
      <Field label="Name" optional>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-outline bg-background px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
        />
      </Field>
      <Field label="Mobile number">
        <input
          inputMode="numeric"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          className="w-full rounded-xl border border-outline bg-background px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
        />
      </Field>
      <Field label="What's the issue?" optional>
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          rows={3}
          placeholder="e.g. Not cooling, makes a noise…"
          className="w-full rounded-xl border border-outline bg-background px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
        />
      </Field>
      {state === "error" && <p className="text-sm text-error">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary disabled:opacity-60"
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
      <span className="text-sm font-medium text-on-surface">
        {label}
        {optional && <span className="text-muted"> (optional)</span>}
      </span>
      {children}
    </label>
  );
}
