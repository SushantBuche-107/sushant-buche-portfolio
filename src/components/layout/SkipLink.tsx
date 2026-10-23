export function SkipLink(): React.ReactElement {
  return (
    <a
      href="#main-content"
      className="sr-only z-[100] rounded-full bg-accent px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to main content
    </a>
  );
}
