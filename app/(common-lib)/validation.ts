/**
 * Normalizes any phone input into clean digits.
 * Automatically handles:
 * - '+91' or '91' prefix (12 digits -> 10 digits)
 * - Leading '0' (11 digits -> 10 digits)
 * - Spaces, dashes, brackets, and non-numeric chars
 */
export function normalizePhone(raw: string = ""): string {
  const digits = raw.replace(/\D/g, "");

  // If starts with 91 and has 12 digits (+91 98765 43210)
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  // If starts with leading 0 and has 11 digits (098765 43210)
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }

  // If user entered or pasted more than 10 digits, take the last 10 digits
  if (digits.length > 10) {
    return digits.slice(-10);
  }

  return digits;
}

/**
 * Pure 10-digit Indian mobile number validation.
 * Must start with 6, 7, 8, or 9 and be exactly 10 digits.
 */
export function isValidIndianMobile(phone: string): boolean {
  const clean = normalizePhone(phone);
  return /^[6-9]\d{9}$/.test(clean);
}

/**
 * Returns a user-friendly error message for phone inputs, or null if valid.
 */
export function getPhoneValidationError(phone: string): string | null {
  const clean = normalizePhone(phone);

  if (!clean) {
    return "Please enter your 10-digit mobile number.";
  }

  if (clean.length > 0 && !/^[6-9]/.test(clean)) {
    return "Mobile number must start with 6, 7, 8, or 9.";
  }

  if (clean.length < 10) {
    return `Please enter complete 10 digits (${clean.length}/10).`;
  }

  if (!/^[6-9]\d{9}$/.test(clean)) {
    return "Please enter a valid 10-digit mobile number.";
  }

  return null;
}
