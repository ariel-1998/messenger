import { act, renderHook } from "@testing-library/react";
import useDrawer from "../../src/hooks/useDrawer";
import DrawerProvider from "../../src/contexts/DrawerProvider";

describe("useDrawer", () => {
  it("open value should be false on mount", () => {
    const { result } = renderHook(useDrawer, { wrapper: DrawerProvider });
    expect(result.current.open).toBe(false);
  });
  it("should open and close properly", () => {
    const { result } = renderHook(useDrawer, { wrapper: DrawerProvider });

    act(() => result.current.openDrawer());
    expect(result.current.open).toBe(true);

    act(() => result.current.closeDrawer());
    expect(result.current.open).toBe(false);
  });
});
