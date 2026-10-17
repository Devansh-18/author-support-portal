import { useEffect, useRef } from 'react';

/**
 * Smart polling hook for near-real-time ticket synchronization.
 * Pauses automatically when tab is hidden or offline.
 *
 * @param {() => Promise<any>} fetchCallback
 * @param {number} [intervalMs=3000]
 * @param {boolean} [enabled=true]
 */
export function useTicketSync(fetchCallback, intervalMs = 3000, enabled = true) {
  const savedCallback = useRef(fetchCallback);

  useEffect(() => {
    savedCallback.current = fetchCallback;
  }, [fetchCallback]);

  useEffect(() => {
    if (!enabled) return;

    let isPolling = false;

    async function tick() {
      if (document.hidden || !navigator.onLine || isPolling) {
        return;
      }
      isPolling = true;
      try {
        await savedCallback.current();
      } catch {
        // Silently tolerate transient polling errors
      } finally {
        isPolling = false;
      }
    }

    const intervalId = setInterval(tick, intervalMs);

    // Immediate tick when returning to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        tick();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs, enabled]);
}
