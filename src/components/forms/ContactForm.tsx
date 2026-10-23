import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import {
  CONTACT_LIMITS,
  buildMailtoUrl,
  isSubmissionTooFast,
  validateContactForm,
  type ContactErrors,
  type ContactFormValues,
} from "@/lib/validation";
import type { ContactMode } from "@/types/portfolio";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export interface ContactFormProps {
  mode: ContactMode;
  endpoint?: string;
  email?: string;
  successMessage: string;
  formIntro?: string;
  privacyNote?: string;
  minSubmitMs?: number;
}

export function ContactForm({
  mode,
  endpoint,
  email,
  successMessage,
  formIntro,
  privacyNote,
  minSubmitMs = 2500,
}: ContactFormProps): React.ReactElement | null {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const startedAtRef = useRef(0);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const isAvailable =
    (mode === "endpoint" && Boolean(endpoint)) ||
    (mode === "mailto" && Boolean(email));

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  if (!isAvailable) return null;

  const updateField = (
    field: keyof ContactFormValues,
    value: string,
  ): void => {
    setValues((current) => ({ ...current, [field]: value }));
    if (field !== "website" && errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
    if (status === "error") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const resetForm = (): void => {
    setValues(EMPTY_VALUES);
    setErrors({});
    setStatus("idle");
    setFeedback("");
    startedAtRef.current = Date.now();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const result = validateContactForm(values);
    if (!result.valid) {
      setErrors(result.errors);
      setStatus("idle");
      setFeedback("");

      const firstError = Object.keys(result.errors)[0];
      if (firstError) {
        document.getElementById(`contact-${firstError}`)?.focus();
      }
      return;
    }

    if (
      result.isSpam ||
      isSubmissionTooFast(startedAtRef.current, Date.now(), minSubmitMs)
    ) {
      setStatus("success");
      setFeedback(successMessage);
      setValues(EMPTY_VALUES);
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      if (mode === "mailto") {
        const mailto = email
          ? buildMailtoUrl(email, {
              name: result.data.name,
              email: result.data.email,
              subject: result.data.subject,
              message: result.data.message,
            })
          : undefined;

        if (!mailto) throw new Error("No email destination configured.");
        window.location.assign(mailto);

        setStatus("success");
        setFeedback(
          "Your email app should open with the message prepared. If it does not, use the email link on this page.",
        );
        setValues(EMPTY_VALUES);
        return;
      }

      if (!endpoint) throw new Error("No endpoint configured.");

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(result.data),
          signal: controller.signal,
          credentials: "omit",
        });

        if (!response.ok) {
          throw new Error("The contact endpoint rejected the message.");
        }
      } finally {
        window.clearTimeout(timeout);
      }

      setStatus("success");
      setFeedback(successMessage);
      setValues(EMPTY_VALUES);
    } catch {
      setStatus("error");
      setFeedback(
        "Your message could not be sent. Please try again in a moment, or use the email link on this page.",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        className="surface-card rounded-2xl p-6 sm:p-8"
        role="status"
        aria-live="polite"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-4 text-xl font-semibold text-ink focus:outline-none"
        >
          {mode === "mailto" ? "Message prepared" : "Message sent"}
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
          {feedback || successMessage}
        </p>
        <Button variant="secondary" size="sm" className="mt-6" onClick={resetForm}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="surface-card rounded-2xl p-6 sm:p-8"
    >
      {formIntro ? (
        <p className="mb-6 max-w-xl text-sm leading-relaxed text-ink-muted">
          {formIntro}
        </p>
      ) : null}

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website ?? ""}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          htmlFor="contact-name"
          required
          error={errors.name}
        >
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            maxLength={CONTACT_LIMITS.nameMax}
            placeholder="Your name"
          />
        </Field>

        <Field
          label="Email"
          htmlFor="contact-email"
          required
          error={errors.email}
        >
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            placeholder="you@company.com"
          />
        </Field>
      </div>

      <Field
        label="Subject"
        htmlFor="contact-subject"
        required
        error={errors.subject}
        className="mt-5"
      >
        <Input
          id="contact-subject"
          name="subject"
          value={values.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          maxLength={CONTACT_LIMITS.subjectMax}
          placeholder="Role, project, or technical question"
        />
      </Field>

      <Field
        label="Message"
        htmlFor="contact-message"
        required
        error={errors.message}
        hint={`${values.message.length}/${CONTACT_LIMITS.messageMax}`}
        className="mt-5"
      >
        <Textarea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          maxLength={CONTACT_LIMITS.messageMax}
          rows={7}
          placeholder="A little context about the role, team, or problem you are working on."
        />
      </Field>

      {status === "error" ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs leading-relaxed text-red-200 focus:outline-none"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {feedback}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.68rem] leading-relaxed text-ink-faint">
          Required fields are marked with an asterisk.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className={cn("w-full sm:w-auto")}
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "submitting" ? "Sending..." : "Send message"}
        </Button>
      </div>

      {privacyNote ? (
        <p className="mt-5 border-t border-line pt-4 text-[0.68rem] leading-relaxed text-ink-faint">
          {privacyNote}
        </p>
      ) : null}
    </form>
  );
}
