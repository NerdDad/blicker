import { useRef, useEffect } from "react";

export function useInterval(callback: (x?: number) => void, delay: number) {
  const savedCallback = useRef<(x?: number) => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let now = new Date().getTime();
    function tick() {
      const nextNow = new Date().getTime();
      if (savedCallback.current) savedCallback.current(nextNow - now);
      now = nextNow;
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
