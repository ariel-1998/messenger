import React, { useCallback, useState } from "react";

interface useDebounceProps {
  fn: (...params: any) => any;
  wait?: number;
}

const useDebounce = ({ fn, wait = 1000 }: useDebounceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  let timeout: NodeJS.Timeout;

  const debounce = useCallback((args: any) => {
    setIsLoading(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setIsLoading(false);
      fn(args);
    }, wait);
  }, []);

  return { isLoading, debounce };
};

export default useDebounce;
