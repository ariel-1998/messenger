import { useCallback, useRef, useState } from "react";

const useDebounce = jest.fn().mockImplementation(({ fn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const debounce = useCallback(
    (...args: unknown[]) => {
      setIsLoading(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setIsLoading(false);
        fn(...args);
      }, 30);
    },
    [fn]
  );
  return { isLoading, debounce };
});

export default useDebounce;
