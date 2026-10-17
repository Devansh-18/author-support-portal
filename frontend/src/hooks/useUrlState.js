import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React hook to synchronize state object with URLSearchParams.
 * Enables shareable, bookmarkable, and refresh-safe filtered views.
 *
 * @param {Record<string, string>} defaultValues
 * @returns {[Record<string, string>, (newValues: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void]}
 */
export function useUrlState(defaultValues) {
  const getInitialState = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const state = { ...defaultValues };

    for (const key of Object.keys(defaultValues)) {
      if (searchParams.has(key)) {
        state[key] = searchParams.get(key);
      }
    }
    return state;
  };

  const [state, setState] = useState(getInitialState);

  // Sync state to URL search parameters
  const updateUrlState = useCallback((newValues) => {
    setState((prev) => {
      const next = typeof newValues === 'function' ? newValues(prev) : { ...prev, ...newValues };
      const searchParams = new URLSearchParams(window.location.search);

      for (const [key, value] of Object.entries(next)) {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, value);
        } else {
          searchParams.delete(key);
        }
      }

      const queryString = searchParams.toString();
      const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);

      return next;
    });
  }, []);

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setState(getInitialState());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [state, updateUrlState];
}
