import { isValidEmail } from "@/lib/email";
import {
  normalizeWhitespace,
  stripControlCharacters,
} from "@/lib/format";

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export type ContactField = Exclude<keyof ContactFormValues, "website">;

export type ContactErrors = Partial<Record<ContactField, string>>;

export interface SanitizedContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactValidationResult =
  | { valid: true; data: SanitizedContactMessage; isSpam: boolean }
  | { valid: false; errors: ContactErrors; isSpam: boolean };

const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  subjectMin: 3,
  subjectMax: 120,
  messageMin: 20,
  messageMax: 5000,
} as const;

function sanitizeSingleLine(value: string): string {
  return normalizeWhitespace(stripControlCharacters(value));
}

function sanitizeMessage(value: string): string {
  return stripControlCharacters(value.replace(/\r\n/g, "\n"))
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .trim();
}

export function validateContactForm(
  values: ContactFormValues,
): ContactValidationResult {
  const name = sanitizeSingleLine(values.name ?? "");
  const email = sanitizeSingleLine(values.email ?? "").toLowerCase();
  const subject = sanitizeSingleLine(values.subject ?? "");
  const message = sanitizeMessage(values.message ?? "");
  const honeypot = values.website?.trim() ?? "";

  const errors: ContactErrors = {};

  if (name.length < LIMITS.nameMin) {
    errors.name = "Please enter your name (at least 2 characters).";
  } else if (name.length > LIMITS.nameMax) {
    errors.name = "Your name is too long. Please use 80 characters or fewer.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (subject.length < LIMITS.subjectMin) {
    errors.subject = "Please add a short subject (at least 3 characters).";
  } else if (subject.length > LIMITS.subjectMax) {
    errors.subject = "Please keep the subject to 120 characters or fewer.";
  }

  if (message.length < LIMITS.messageMin) {
    errors.message = "Please include a little more detail (at least 20 characters).";
  } else if (message.length > LIMITS.messageMax) {
    errors.message = "Please keep your message to 5,000 characters or fewer.";
  }

  const isSpam = honeypot.length > 0;

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors, isSpam };
  }

  return {
    valid: true,
    isSpam,
    data: { name, email, subject, message },
  };
}

export function buildMailtoUrl(
  email: string,
  values: Pick<ContactFormValues, "subject" | "message" | "name" | "email">,
): string | undefined {
  if (!isValidEmail(email)) return undefined;

  const subject = `Portfolio enquiry: ${values.subject.trim()}`;
  const body = [
    values.message.trim(),
    "",
    "—",
    values.name.trim(),
    values.email.trim(),
  ].join("\n");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function isSubmissionTooFast(
  startedAt: number,
  now = Date.now(),
  minimumMs = 3000,
): boolean {
  return now - startedAt < minimumMs;
}

export const CONTACT_LIMITS = LIMITS;
