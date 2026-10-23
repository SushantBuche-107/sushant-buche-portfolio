import { lazy, Suspense, useState } from "react";
import { SceneFallback } from "@/components/three/SceneFallback";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { Button } from "@/components/ui/button";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import { useIntersection } from "@/hooks/useIntersection";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

const SCENE_LABEL =
  "Interactive 3D visualization of an interconnected software system with a central technology core, orbital rings, and connected nodes.";

export function HeroVisual(): React.ReactElement {
  const webglSupported = useWebGLSupport();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(max-width: 1023px)");
  const deferred = useDeferredMount(200);
  const { ref, inView } = useIntersection<HTMLDivElement>("220px");
  const [optedIn, setOptedIn] = useState(false);

  const showScene =
    webglSupported && deferred && (!prefersReducedMotion || optedIn);

  return (
    <figure className="hero-fade-up relative mx-auto w-full max-w-[26rem] sm:max-w-[30rem] lg:max-w-[34rem] xl:max-w-[36rem]" ref={ref} style={{ animationDelay: "520ms" }}>
      <div
        role="img"
        aria-label={SCENE_LABEL}
        className="relative aspect-square w-full"
      >
        <div
          aria-hidden="true"
          className="absolute inset-12 rounded-full bg-accent/10 blur-[90px] motion-safe:animate-[pulse_16s_ease-in-out_infinite]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_60%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 grid-backdrop rounded-full opacity-40"
        />
        <div className="relative h-full w-full">
          {showScene ? (
            <SceneErrorBoundary fallback={<SceneFallback />}>
              <Suspense fallback={<SceneFallback loading />}>
                <HeroScene isMobile={isMobile} active={inView} />
              </Suspense>
            </SceneErrorBoundary>
          ) : (
            <SceneFallback />
          )}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
        >
          <span className="absolute left-[-4%] top-[16%] flex items-center gap-2 rounded-full border border-line bg-background/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-muted backdrop-blur transition hover:border-line-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_0_6px_rgba(6,182,212,0.14)]" />
            API contracts
          </span>
          <span className="absolute right-[-6%] top-[36%] flex items-center gap-2 rounded-full border border-line bg-background/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-muted backdrop-blur transition hover:border-line-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_6px_rgba(99,102,241,0.14)]" />
            Event flow
          </span>
          <span className="absolute bottom-[14%] left-[6%] flex items-center gap-2 rounded-full border border-line bg-background/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-muted backdrop-blur transition hover:border-line-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_0_6px_rgba(52,211,153,0.14)]" />
            Data layer
          </span>
          {!isTablet ? (
            <span className="absolute right-[2%] bottom-[10%] flex items-center gap-2 rounded-full border border-line bg-background/60 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-faint backdrop-blur">
              Interactive
            </span>
          ) : null}
        </div>
      </div>

      <figcaption className="mt-2 flex min-h-10 flex-col items-center gap-2 text-center text-[0.7rem] text-ink-faint">
        {!webglSupported ? (
          <span>Static visual preview. WebGL is not available on this device.</span>
        ) : null}
        {webglSupported && prefersReducedMotion && !optedIn ? (
          <>
            <span>Reduced motion is enabled, so the scene is paused.</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOptedIn(true)}
              className="text-[0.7rem]"
            >
              Load interactive 3D
            </Button>
          </>
        ) : null}
        {showScene ? (
          <span className="sr-only">
            The interactive 3D scene responds gently to pointer movement.
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
