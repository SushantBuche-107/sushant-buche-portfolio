import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "surface-card rounded-2xl",
        interactive && "interactive-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
