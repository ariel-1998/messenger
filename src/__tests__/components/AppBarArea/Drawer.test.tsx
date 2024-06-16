import { ThemeProvider, useMediaQuery } from "@mui/material";
import Drawer from "../../../components/AppBarArea/Drawer";
import DrawerProvider from "../../../contexts/DrawerProvider";
import { theme } from "../../../utils/theme";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(true),
}));

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
  it("should render properly in larger then medium screen sizes", () => {
    render(<DrawerTest />);
    const inputField = screen.getByRole("textbox");
    const drawerOpener = screen.getByRole("drawer-opener");
    const muiDrawer = screen.queryByTestId("mui-drawer");
    const drawerChildren = screen.queryByText("mui drawer children");

    expect(drawerOpener).toBeInTheDocument();
    expect(drawerOpener.tagName).toBe("DIV");
    expect(drawerChildren).not.toBeInTheDocument();
    expect(muiDrawer).not.toBeInTheDocument();
    expect(inputField).toBeInTheDocument();
  });
  it("should render properly in smaller then medium screen sizes", () => {
    (useMediaQuery as jest.Mock).mockReturnValueOnce(false),
      render(<DrawerTest />);
    const drawerOpener = screen.getByRole("drawer-opener");
    const inputField = screen.queryByRole("textbox");
    const muiDrawer = screen.queryByTestId("mui-drawer");
    const drawerChildren = screen.queryByText("mui drawer children");

    expect(drawerOpener).toBeInTheDocument();
    expect(drawerOpener.tagName).toBe("BUTTON");
    expect(inputField).not.toBeInTheDocument();
    expect(muiDrawer).not.toBeInTheDocument();
    expect(drawerChildren).not.toBeInTheDocument();
  });
  it("should open and close drawer properly in smaller then medium screen sizes", async () => {
    (useMediaQuery as jest.Mock).mockReturnValueOnce(false),
      render(<DrawerTest />);
    const user = userEvent.setup();

    expect(screen.queryByTestId("mui-drawer")).not.toBeInTheDocument();
    expect(screen.queryByText("mui drawer children")).not.toBeInTheDocument();

    await user.click(screen.getByRole("drawer-opener"));
    expect(screen.queryByText("mui drawer children")).toBeInTheDocument();

    const backdrop = screen
      .getByTestId("mui-drawer")
      .querySelector(".MuiBackdrop-root");

    await user.click(backdrop as HTMLElement);

    await waitFor(() => {
      expect(screen.queryByTestId("mui-drawer")).not.toBeInTheDocument();
      expect(screen.queryByText("mui drawer children")).not.toBeInTheDocument();
    });
  });

  it("should open and close drawer properly in larger then medium screen sizes", async () => {
    render(<DrawerTest />);
    const user = userEvent.setup();

    expect(screen.queryByTestId("mui-drawer")).not.toBeInTheDocument();
    expect(screen.queryByText("mui drawer children")).not.toBeInTheDocument();

    await user.click(screen.getByRole("drawer-opener"));
    expect(screen.queryByText("mui drawer children")).toBeInTheDocument();

    const backdrop = screen
      .getByTestId("mui-drawer")
      .querySelector(".MuiBackdrop-root");

    await user.click(backdrop as HTMLElement);

    await waitFor(() => {
      expect(screen.queryByTestId("mui-drawer")).not.toBeInTheDocument();
      expect(screen.queryByText("mui drawer children")).not.toBeInTheDocument();
    });
  });
});
