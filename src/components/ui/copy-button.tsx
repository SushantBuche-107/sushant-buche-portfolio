import { AlertCircle, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

type CopyState = "idle" | "copied" | "error";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the selection-based fallback.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  variant = "outline",
  size = "sm",
  className,
}: {
  text?: string | null;
  label?: string;
  copiedLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): React.ReactElement | null {
  const [state, setState] = useState<CopyState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!text?.trim()) return null;

  const handleCopy = async (): Promise<void> => {
    const success = await copyText(text.trim());
    setState(success ? "copied" : "error");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState("idle"), 2400);
  };

  const Icon = state === "copied" ? Check : state === "error" ? AlertCircle : Copy;
  const displayLabel =
    state === "copied" ? copiedLabel : state === "error" ? "Copy unavailable" : label;

  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleCopy}
        aria-label={state === "error" ? "Copy unavailable. Select the text manually." : `${label} ${text}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {displayLabel}
      </Button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? copiedLabel : state === "error" ? "Copy failed" : ""}
      </span>
    </span>
  );
}
