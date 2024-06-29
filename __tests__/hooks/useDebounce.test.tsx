import { renderHook, act, waitFor } from "@testing-library/react";
import useDebounce from "../../src/hooks/useDebounce";

describe("useDebounce", () => {
  it("should return isLoadinng false as initialState", () => {
    const { result } = renderHook(() =>
      useDebounce({ fn: jest.fn(), wait: 0 })
    );
    expect(result.current.isLoading).toBe(false);
  });
  it("should return isLoadinng true when the function is used", async () => {
    const { result } = renderHook(() =>
      useDebounce({ fn: jest.fn(), wait: 10 })
    );
    act(() => result.current.debounce());
    expect(result.current.isLoading).toBe(true);
  });
  it("should return isLoadinng false when the function is finished the timeout", async () => {
    const { result } = renderHook(() =>
      useDebounce({ fn: jest.fn(), wait: 10 })
    );
    act(() => result.current.debounce());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
