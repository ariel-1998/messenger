import React, { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
}

interface useFetchStateProps<T> {
  fn: () => Promise<T>;
  enabled?: boolean;
  onSucess?: (data?: T) => void;
  onError?: (error?: unknown) => void;
}

const useFetchState = <T,>({
  fn,
  enabled = true,
  onSucess = () => undefined,
  onError = () => undefined,
}: useFetchStateProps<T>): FetchState<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fnData = await fn();
        setData(fnData);
        onSucess();
      } catch (error) {
        setIsError(true);
        onError();
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fn, enabled]);

  return { data, isError, isLoading };
};

export default useFetchState;
