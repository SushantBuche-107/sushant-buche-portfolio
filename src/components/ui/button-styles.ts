import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "subtle";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-[0_14px_34px_-18px_rgba(99,102,241,0.9)] hover:bg-accent-strong",
  secondary:
    "border border-line-strong bg-surface/70 text-ink hover:border-accent/50 hover:bg-surface-raised",
  outline:
    "border border-line-strong bg-transparent text-ink hover:border-accent-cyan/50 hover:bg-white/[0.04]",
  ghost: "bg-transparent text-ink-muted hover:bg-white/[0.05] hover:text-ink",
  subtle: "bg-white/[0.06] text-ink hover:bg-white/[0.1]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  icon: "h-10 w-10",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}
