import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "accent"
  | "cyan"
  | "neutral"
  | "success"
  | "warning"
  | "outline";

const variants: Record<BadgeVariant, string> = {
  accent: "border-accent/25 bg-accent/12 text-indigo-200",
  cyan: "border-accent-cyan/25 bg-accent-cyan/10 text-cyan-200",
  neutral: "border-line bg-white/[0.04] text-ink-muted",
  success: "border-success/30 bg-success/10 text-emerald-200",
  warning: "border-warning/30 bg-warning/10 text-amber-200",
  outline: "border-line-strong bg-transparent text-ink-muted",
};

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-medium leading-none tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TechBadge({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-white/[0.035] px-2 py-1 font-mono text-[0.68rem] text-ink-muted">
      {children}
    </span>
  );
}
