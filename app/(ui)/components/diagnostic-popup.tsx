"use client";

import { useState, useEffect } from "react";
import { services, site } from "@/app/(config)/site";
import { serviceProblems } from "@/app/(config)/content";
import { slugify } from "@/app/(common-lib)/slugify";
import { Icon } from "@/app/(ui)/components/icons";
import { analytics } from "@/app/(common-lib)/analytics";

export function DiagnosticPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string>("");
  const [issue, setIssue] = useState<string>("");
  const [otherIssue, setOtherIssue] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const selectedService = services.find((s) => s.slug === service);
  const problems = service ? serviceProblems[service as keyof typeof serviceProblems] || [] : [];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!service) {
      setError("Please select a category.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliance: service,
          issue: issue === "other" ? otherIssue : issue,
          name,
          phone: digits,
          source: "diagnostic-popup",
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not submit");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(0);
    setService("");
    setIssue("");
    setOtherIssue("");
    setName("");
    setPhone("");
    setDone(false);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
      <div className="relative w-full max-w-md rounded-3xl bg-background shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {done ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="check" className="h-7 w-7" filled />
            </span>
            <p className="text-lg font-extrabold text-on-surface">Got it!</p>
            <p className="text-sm text-on-surface-variant">
              Our technician will call you within 15 minutes. Or call us now for
              instant help.
            </p>
            <a
              href={`tel:${site.phone}`}
              onClick={() => analytics.telClick("diagnostic-done")}
              className="btn-zoom inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-on-primary"
            >
              <Icon name="phone" className="h-4 w-4" filled /> 
              Call now
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 text-xs text-muted hover:text-on-surface"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 p-6">
            {/* Direct call button at top */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                Urban Service Company
              </p>
              <a
                href={`tel:${site.phone}`}
                onClick={() => analytics.telClick("diagnostic-top")}
                className="btn-zoom mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-on-primary"
              >
                <Icon name="phone" className="h-5 w-5" filled />
                Call now
              </a>
              <p className="mt-1.5 text-center text-xs text-muted">
                {site.hours} · Same-day slots
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-outline-variant" />
              <span className="text-xs font-medium text-muted">or book below</span>
              <div className="h-px flex-1 bg-outline-variant" />
            </div>

            {/* Step 1: What are you looking for? */}
            <div>
              <p className="text-sm font-bold text-on-surface">
                What are you looking for?
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {services.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => {
                      setService(s.slug);
                      setIssue("");
                      setStep(1);
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-colors ${
                      service === s.slug
                        ? "border-primary bg-primary-container text-on-primary-container"
                        : "border-outline-variant bg-surface text-on-surface hover:border-primary"
                    }`}
                  >
                    <Icon name={s.icon} className="h-5 w-5" />
                    <span className="text-[10px] font-bold text-center leading-tight">
                      {s.short}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select an issue */}
            {step >= 1 && selectedService && (
              <div>
                <p className="text-sm font-bold text-on-surface">
                  What's the issue with your {selectedService.short.toLowerCase()}?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {problems.slice(0, 6).map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => setIssue(p.title)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        issue === p.title
                          ? "border-primary bg-primary-container text-on-primary-container"
                          : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary"
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIssue("other")}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      issue === "other"
                        ? "border-primary bg-primary-container text-on-primary-container"
                        : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary"
                    }`}
                  >
                    Other
                  </button>
                </div>
                {issue === "other" && (
                  <input
                    type="text"
                    value={otherIssue}
                    onChange={(e) => setOtherIssue(e.target.value)}
                    placeholder="Describe the issue..."
                    className="mt-3 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary"
                  />
                )}
              </div>
            )}

            {/* Step 3: Name + Number */}
            {step >= 1 && (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-on-surface">
                      Name <span className="text-muted">(optional)</span>
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="rounded-lg border border-outline bg-background px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-on-surface">
                      Mobile
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="rounded-lg border border-outline bg-background px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary"
                    />
                  </label>
                </div>
                {error && <p className="text-xs text-error">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-zoom flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Get a callback"}
                  {!submitting && <Icon name="arrow" className="h-4 w-4" />}
                </button>
                <p className="text-center text-xs text-muted">
                  No spam. We call to confirm the fault and slot.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
