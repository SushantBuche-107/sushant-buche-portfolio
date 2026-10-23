import { cn } from "@/lib/cn";

export function SceneFallback({
  loading = false,
  className,
}: {
  loading?: boolean;
  className?: string;
}): React.ReactElement {
  return (
    <svg
      viewBox="0 0 600 600"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#6366F1" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="core-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="55%" stopColor="#111827" />
          <stop offset="100%" stopColor="#0B0F17" />
        </linearGradient>
        <linearGradient id="core-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="node-cyan">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="100%" stopColor="#06B6D4" />
        </radialGradient>
        <radialGradient id="node-indigo">
          <stop offset="0%" stopColor="#C7D2FE" />
          <stop offset="100%" stopColor="#6366F1" />
        </radialGradient>
        <pattern id="scene-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#94A3B8"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="600" height="600" fill="url(#scene-grid)" opacity="0.75" />
      <circle cx="300" cy="300" r="280" fill="url(#core-glow)" />

      <g fill="none" stroke="#6366F1" strokeOpacity="0.25">
        <ellipse cx="300" cy="300" rx="244" ry="92" transform="rotate(-18 300 300)" />
        <ellipse cx="300" cy="300" rx="212" ry="118" transform="rotate(46 300 300)" stroke="#06B6D4" strokeOpacity="0.18" />
        <ellipse cx="300" cy="300" rx="168" ry="148" transform="rotate(84 300 300)" strokeOpacity="0.2" />
      </g>

      <g stroke="#6366F1" strokeOpacity="0.24">
        <line x1="300" y1="300" x2="126" y2="222" />
        <line x1="300" y1="300" x2="470" y2="190" />
        <line x1="300" y1="300" x2="482" y2="356" />
        <line x1="300" y1="300" x2="174" y2="454" />
        <line x1="300" y1="300" x2="390" y2="500" />
        <line x1="300" y1="300" x2="112" y2="356" />
      </g>

      <g>
        <circle cx="126" cy="222" r="6" fill="url(#node-cyan)" />
        <circle cx="470" cy="190" r="5" fill="url(#node-indigo)" />
        <circle cx="482" cy="356" r="4.5" fill="url(#node-cyan)" />
        <circle cx="174" cy="454" r="5" fill="url(#node-indigo)" />
        <circle cx="390" cy="500" r="4" fill="url(#node-cyan)" />
        <circle cx="112" cy="356" r="4" fill="url(#node-indigo)" />
      </g>

      <g
        className={cn(loading && "animate-soft-pulse")}
        style={{ transformOrigin: "300px 300px" }}
      >
        <polygon
          points="300,178 406,240 406,362 300,424 194,362 194,240"
          fill="url(#core-face)"
          stroke="url(#core-edge)"
          strokeWidth="1.4"
        />
        <polygon
          points="300,214 366,254 366,344 300,384 234,344 234,254"
          fill="#0B0F17"
          fillOpacity="0.8"
          stroke="#06B6D4"
          strokeOpacity="0.26"
          strokeWidth="1"
        />
        <polygon
          points="300,214 366,254 300,294 234,254"
          fill="#6366F1"
          fillOpacity="0.08"
          stroke="#818CF8"
          strokeOpacity="0.3"
        />
        <polygon
          points="300,294 366,254 366,344 300,384"
          fill="#06B6D4"
          fillOpacity="0.05"
          stroke="#06B6D4"
          strokeOpacity="0.28"
        />
        <circle cx="300" cy="300" r="9" fill="#67E8F9" fillOpacity="0.85" />
        <circle cx="300" cy="300" r="18" fill="none" stroke="#67E8F9" strokeOpacity="0.25" />
      </g>
    </svg>
  );
}
