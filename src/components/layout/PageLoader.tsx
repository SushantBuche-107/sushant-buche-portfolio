export function PageLoader(): React.ReactElement {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-faint">
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent-cyan" />
        Loading
      </span>
    </div>
  );
}
