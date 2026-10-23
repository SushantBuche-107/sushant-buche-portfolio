import * as React from "react";
import { Link } from "react-router-dom";
import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import { isExternalHref } from "@/lib/url";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonStyles({ variant, size, className })}
        {...props}
      />
    );
  },
);

export interface ActionLinkProps {
  to?: string;
  href?: string;
  external?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  download?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

export function ActionLink({
  to,
  href,
  external = false,
  variant = "primary",
  size = "md",
  className,
  children,
  download,
  onClick,
  "aria-label": ariaLabel,
}: ActionLinkProps): React.ReactElement | null {
  const classes = buttonStyles({ variant, size, className });

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (!href) return null;

  const shouldOpenExternally = external || isExternalHref(href);

  return (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      {...(download ? { download: "" } : {})}
      {...(shouldOpenExternally
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}
