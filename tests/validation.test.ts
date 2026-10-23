import { describe, expect, it } from "vitest";
import {
  buildMailtoUrl,
  isSubmissionTooFast,
  validateContactForm,
  type ContactFormValues,
} from "@/lib/validation";

const validValues: ContactFormValues = {
  name: "  Sushant   Buche  ",
  email: "HELLO@Example.com",
  subject: "  Backend role  ",
  message: "  I would like to discuss a backend engineering role on your team.  ",
  website: "",
};

describe("contact validation", () => {
  it("accepts and sanitizes a valid message", () => {
    const result = validateContactForm(validValues);

    expect(result.valid).toBe(true);
    if (!result.valid) return;

    expect(result.isSpam).toBe(false);
    expect(result.data).toEqual({
      name: "Sushant Buche",
      email: "hello@example.com",
      subject: "Backend role",
      message:
        "I would like to discuss a backend engineering role on your team.",
    });
  });

  it("rejects missing, invalid, and short fields", () => {
    const result = validateContactForm({
      name: "A",
      email: "not-an-email",
      subject: "No",
      message: "Too short",
      website: "",
    });

    expect(result.valid).toBe(false);
    if (result.valid) return;

    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.subject).toBeDefined();
    expect(result.errors.message).toBeDefined();
  });

  it("flags the honeypot without accepting the submission", () => {
    const result = validateContactForm({
      ...validValues,
      website: "https://spam.example",
    });

    expect(result.valid).toBe(true);
    expect(result.isSpam).toBe(true);
  });

  it("preserves safe line breaks in the message", () => {
    const result = validateContactForm({
      ...validValues,
      message: "First line with enough detail.\n\nSecond line with more detail.",
    });

    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.data.message).toContain("\n\nSecond line");
  });

  it("builds an encoded mailto URL and rejects an invalid destination", () => {
    const url = buildMailtoUrl("hello@example.com", {
      name: "Sushant",
      email: "hello@example.com",
      subject: "A role & team",
      message: "Line one\nLine two",
    });

    expect(url).toContain("mailto:hello@example.com?subject=");
    expect(url).toContain(encodeURIComponent("Portfolio enquiry: A role & team"));
    expect(url).toContain(encodeURIComponent("Line two"));
    expect(buildMailtoUrl("broken", validValues)).toBeUndefined();
  });

  it("detects submissions that are too fast", () => {
    expect(isSubmissionTooFast(1000, 2000, 2500)).toBe(true);
    expect(isSubmissionTooFast(1000, 5000, 2500)).toBe(false);
  });
});
