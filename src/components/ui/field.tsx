import * as React from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required ? (
            <span className="ml-1 text-accent-cyan" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {hint ? (
          <span id={`${htmlFor}-hint`} className="text-[0.7rem] text-ink-faint">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClasses =
  "w-full rounded-xl border bg-background/70 px-3.5 py-3 text-sm text-ink placeholder:text-ink-faint/70 transition-colors focus-visible:border-accent-cyan/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/30 disabled:cursor-not-allowed disabled:opacity-60";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          controlClasses,
          invalid ? "border-danger/60" : "border-line-strong",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<"textarea"> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          controlClasses,
          "min-h-36 resize-y",
          invalid ? "border-danger/60" : "border-line-strong",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);
