import { ThemeProvider, useMediaQuery } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Drawer from "../../../src/components/AppBarArea/Drawer";
import DrawerProvider from "../../../src/contexts/DrawerProvider";
import { theme } from "../../../src/utils/theme";
import useDrawer from "../../../src/hooks/useDrawer";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../src/components/CustomComponents/CustomSearchInput");
jest.mock("../../../src/hooks/useDrawer");

function DrawerTest() {
  return (
    <ThemeProvider theme={theme}>
      <DrawerProvider>
        <Drawer>
          <div>mui drawer children</div>
        </Drawer>
      </DrawerProvider>
    </ThemeProvider>
  );
}

describe("Drawer", () => {
  it("should initial render properly in larger then medium screen sizes", () => {
    render(<DrawerTest />);
    const inputField = screen.getByRole("textbox");
    expect(inputField).toBeInTheDocument();
    expect(inputField).toBeDisabled();

    const drawerOpener = screen.getByRole("drawer-opener");
    expect(drawerOpener).toBeInTheDocument();
    expect(drawerOpener.tagName).toBe("DIV");

    expect(screen.queryByText("mui drawer children")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mui-drawer")).not.toBeInTheDocument();
  });
  it("should initial render properly in smaller then medium screen sizes", () => {
    (useMediaQuery as jest.Mock).mockReturnValueOnce(false),
      render(<DrawerTest />);

    const drawerOpener = screen.getByRole("drawer-opener");
    expect(drawerOpener).toBeInTheDocument();
    expect(drawerOpener.tagName).toBe("BUTTON");

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
  it("should open drawer when useDrawer hook return open == true", () => {
    (useDrawer as jest.Mock).mockReturnValueOnce({
      open: true,
      closeDrawer: jest.fn(),
      openDrawer: jest.fn(),
    });
    render(<DrawerTest />);
    expect(screen.getByText("mui drawer children")).toBeInTheDocument();
  });
  it("should call openDrawer when opening drawer in smaller then medium screen sizes", async () => {
    (useMediaQuery as jest.Mock).mockReturnValueOnce(false);
    render(<DrawerTest />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("drawer-opener"));
    expect(useDrawer().openDrawer).toHaveBeenCalledTimes(1);
  });
  it("should call closeDrawer when closing drawer in smaller then medium screen sizes", async () => {
    const closeDrawer = jest.fn();
    const openDrawer = jest.fn();
    (useDrawer as jest.Mock).mockReturnValueOnce({
      open: true,
      closeDrawer,
      openDrawer,
    });
    (useMediaQuery as jest.Mock).mockReturnValueOnce(false);
    render(<DrawerTest />);
    const user = userEvent.setup();

    const backdrop = screen
      .getByTestId("mui-drawer")
      .querySelector(".MuiBackdrop-root");

    await user.click(backdrop as HTMLElement);
    expect(closeDrawer).toHaveBeenCalledTimes(1);
  });

  it("should call openDrawer when opening drawer in larger screen sizes", async () => {
    render(<DrawerTest />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("drawer-opener"));
    expect(useDrawer().openDrawer).toHaveBeenCalledTimes(1);
  });
  it("should call closeDrawer when closing drawer in larger screen sizes", async () => {
    const closeDrawer = jest.fn();
    const openDrawer = jest.fn();
    (useDrawer as jest.Mock).mockReturnValueOnce({
      open: true,
      closeDrawer,
      openDrawer,
    });
    render(<DrawerTest />);
    const user = userEvent.setup();

    const backdrop = screen
      .getByTestId("mui-drawer")
      .querySelector(".MuiBackdrop-root");

    await user.click(backdrop as HTMLElement);
    expect(closeDrawer).toHaveBeenCalledTimes(1);
  });
});
