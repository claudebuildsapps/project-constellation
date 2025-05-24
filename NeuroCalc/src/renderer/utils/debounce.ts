import { useRef, useCallback } from 'react';

/**
 * Creates a debounced version of a function that delays invoking func until after
 * wait milliseconds have elapsed since the last time the debounced function was invoked.
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const immediateRef = useRef(immediate);

  return useCallback(
    ((...args: Parameters<T>) => {
      const callNow = immediateRef.current && !timeoutRef.current;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (!immediateRef.current) {
          func(...args);
        }
      }, wait);

      if (callNow) {
        func(...args);
      }
    }) as T,
    [func, wait]
  );
}

/**
 * Creates a throttled version of a function that only invokes func at most once per wait milliseconds.
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= wait) {
        lastCallRef.current = now;
        func(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          func(...args);
        }, wait - timeSinceLastCall);
      }
    }) as T,
    [func, wait]
  );
}

/**
 * Basic debounce function for non-React contexts
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): T {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);

    if (callNow) func(...args);
  }) as T;
}

// Add React import for useDebouncedValue
import React from 'react';

/**
 * Hook for debouncing a value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}