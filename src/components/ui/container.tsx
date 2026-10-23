import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}): React.ReactElement {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-prose",
        size === "default" && "max-w-container",
        size === "wide" && "max-w-[86rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}
