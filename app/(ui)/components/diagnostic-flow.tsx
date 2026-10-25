"use client";

import { useState, useEffect } from "react";
import { services, site } from "@/app/(config)/site";
import { serviceProblems } from "@/app/(config)/content";
import { Icon } from "@/app/(ui)/components/icons";
import { analytics } from "@/app/(common-lib)/analytics";
import {
  normalizePhone,
  isValidIndianMobile,
  getPhoneValidationError,
} from "@/app/(common-lib)/validation";

export function DiagnosticFlow({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
  const problems = service
    ? (serviceProblems[service as keyof typeof serviceProblems] || [])
    : [];

  function reset() {
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const phoneError = getPhoneValidationError(phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    if (!service) {
      setError("Please select a category.");
      return;
    }

    const cleanPhone = normalizePhone(phone);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliance: service,
          issue: issue === "other" ? otherIssue : issue,
          name: name.trim(),
          phone: cleanPhone,
          source: "diagnostic-popup",
          telemetry: analytics.getTelemetry(),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not submit");
      analytics.diagnosticSubmit(service, issue === "other" ? otherIssue : issue);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a repair"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
    >
      <div className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background shadow-2xl sm:rounded-3xl">
        {/* Close button */}
        <div className="flex justify-end px-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-variant text-on-surface transition-colors hover:bg-primary-container"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="check" className="h-7 w-7" filled />
            </span>
            <p className="text-lg font-extrabold text-on-surface">Got it!</p>
            <p className="text-base text-on-surface-variant">
              Our technician will call you within 15 minutes. Or call us now for
              instant help.
            </p>
            <a
              href={`tel:${site.phone}`}
              onClick={() => analytics.telClick("diagnostic-done")}
              className="btn-zoom inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-on-primary hover:bg-secondary"
            >
              <Icon name="phone" className="h-4 w-4" filled /> 
              Call now
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 min-h-10 px-3 text-sm text-muted hover:text-on-surface"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1 sm:p-6 sm:pt-1">
            {/* Direct call at top */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                {site.name}
              </p>
              <a
                href={`tel:${site.phone}`}
                onClick={() => analytics.telClick("diagnostic-top")}
                className="btn-zoom mt-2 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-bold text-on-primary hover:bg-secondary"
              >
                <Icon name="phone" className="h-5 w-5" filled />
                Call now
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.whatsappClick("diagnostic-popup")}
                className="btn-zoom mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-base font-bold text-white"
                style={{ backgroundColor: "#0B5345" }}
              >
                <Icon name="whatsapp" className="h-5 w-5" filled />
                WhatsApp now
              </a>
              <p className="mt-2 text-center text-sm text-muted">
                {site.hours} · Same-day slots
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-outline-variant" />
              <span className="text-sm font-medium text-muted">or book below</span>
              <div className="h-px flex-1 bg-outline-variant" />
            </div>

            {/* What are you looking for? */}
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
                      analytics.diagnosticCategory(s.slug);
                    }}
                    className={`flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition-colors ${
                      service === s.slug
                        ? "border-primary bg-primary-container text-on-primary-container"
                        : "border-outline-variant bg-surface text-on-surface hover:border-primary"
                    }`}
                  >
                    <Icon name={s.icon} className="h-6 w-6" />
                    <span className="text-center text-sm font-bold leading-tight">
                      {s.short}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* What's the issue? — appears when category selected */}
            {selectedService && (
              <div>
                <p className="text-sm font-bold text-on-surface">
                  What&apos;s the issue with your {selectedService.short.toLowerCase()}?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {problems.slice(0, 6).map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => setIssue(p.title)}
                      className={`min-h-11 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
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
                    className={`min-h-11 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
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
                    className="mt-3 min-h-12 w-full rounded-xl border border-outline bg-background px-4 py-3 text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>
            )}

            {/* Name + number — appears when category selected */}
            {selectedService && (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-on-surface">
                      Name <span className="text-muted">(optional)</span>
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="min-h-12 rounded-xl border border-outline bg-background px-3.5 py-3 text-base text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-on-surface">
                      Mobile
                    </span>
                    <div className="flex overflow-hidden rounded-xl border border-outline bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="flex items-center border-r border-outline-variant bg-surface-variant/40 px-2.5 text-sm font-bold text-on-surface-variant select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const digits = normalizePhone(e.target.value);
                          setPhone(digits);
                          if (error) setError(null);
                        }}
                        placeholder="98765 43210"
                        className="w-full bg-transparent px-3 py-3 text-base font-semibold tracking-wider text-on-surface outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-muted"
                      />
                      {phone.length === 10 && isValidIndianMobile(phone) && (
                        <span className="flex items-center pr-2 text-emerald-600">
                          <Icon name="check" className="h-4 w-4" filled />
                        </span>
                      )}
                    </div>
                  </label>
                </div>
                {error && (
                  <p role="alert" className="text-sm font-medium text-error">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className="btn-zoom flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-bold text-on-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Get a callback"}
                  {!submitting && <Icon name="arrow" className="h-4 w-4" />}
                </button>
                <p className="text-center text-sm text-muted">
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
