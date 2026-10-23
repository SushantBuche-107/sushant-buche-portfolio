import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "surface-card flex flex-col items-center rounded-2xl px-6 py-14 text-center",
        className,
      )}
    >
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-line-strong bg-white/[0.04] text-accent-cyan">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
