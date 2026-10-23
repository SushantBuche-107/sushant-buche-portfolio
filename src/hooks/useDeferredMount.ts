import { useEffect, useState } from "react";

interface IdleDeadlineLike {
  didTimeout: boolean;
  timeRemaining: () => number;
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: (deadline: IdleDeadlineLike) => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function useDeferredMount(delay = 200): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const idleWindow = window as IdleWindow;
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const mount = (): void => {
      if (!cancelled) setReady(true);
    };

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(mount, { timeout: 1200 });
    } else {
      timeoutHandle = setTimeout(mount, delay);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) clearTimeout(timeoutHandle);
    };
  }, [delay]);

  return ready;
}
