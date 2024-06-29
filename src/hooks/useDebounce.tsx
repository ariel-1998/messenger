import { useCallback, useRef, useState } from "react";

interface useDebounceProps<T extends unknown[]> {
  fn: (...params: T) => void;
  wait?: number;
}

const useDebounce = <T extends unknown[]>({
  fn,
  wait = 1000,
}: useDebounceProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    (...args: T) => {
      setIsLoading(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setIsLoading(false);
        fn(...args);
      }, wait);
    },
    [fn, wait]
  );

  return { isLoading, debounce };
};
// const useDebounce = <T extends [],>({ fn, wait = 1000 }: useDebounceProps<T>) => {
//   const [isLoading, setIsLoading] = useState(false);
//   let timeout: NodeJS.Timeout;

//   const debounce = useCallback((...args: T) => {
//     setIsLoading(true);
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       setIsLoading(false);
//       fn(...args);
//     }, wait);
//   }, []);

//   return { isLoading, debounce };
// };

export default useDebounce;
