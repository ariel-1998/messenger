import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import AppBar from "../../../components/AppBarArea/AppBar";
import { theme } from "../../../utils/theme";
import { ThemeProvider, useMediaQuery } from "@mui/material";

jest.mock("../../../components/AppBarArea/Drawer", () => DrawerMock);
jest.mock(
  "../../../components/AppBarArea/DrawerSearch",
  () => DrawerSearchMock
);
jest.mock("../../../components/AppBarArea/ProfileMenu", () => ProfileMenuMock);
jest.mock(
  "../../../components/AppBarArea/NotificationMenu",
  () => NotificationMenuMock
);

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(false),
}));

function DrawerMock({ children }: { children: ReactNode }) {
  return <div data-testid="drawer-mock">{children}</div>;
}

function DrawerSearchMock() {
  return <input data-testid="drawer-search-mock" />;
}

function ProfileMenuMock() {
  return <div data-testid="profile-menu-mock">profile menu</div>;
}

function NotificationMenuMock() {
  return <div data-testid="notification-menu-mock">notification menu</div>;
}

function AppBarTest() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar />
    </ThemeProvider>
  );
}

describe("AppBar", () => {
  it("should render properly", () => {
    render(<AppBarTest />);
    expect(screen.getByTestId("mui-app-bar")).toBeInTheDocument();
    expect(screen.getByTestId("mui-tool-bar")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("menus-wrapper")).toBeInTheDocument();
    expect(screen.getByText("Messenger")).toBeInTheDocument();
  });
  it("should render with proper style small screen", () => {
    (useMediaQuery as jest.Mock).mockReturnValueOnce(true);
    render(<AppBarTest />);
    const messengerDiv = screen.getByText("Messenger");

    expect(messengerDiv).toBeInTheDocument();
    expect(messengerDiv.tagName).toBe("H6");
    expect(messengerDiv).not.toHaveStyle({ position: "absolute" });
    expect(screen.getByTestId("mui-app-bar")).toBeInTheDocument();
    expect(screen.getByTestId("mui-tool-bar")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("menus-wrapper")).toBeInTheDocument();
  });
  it("should render with proper style larger screens", () => {
    render(<AppBarTest />);
    const messengerDiv = screen.getByText("Messenger");

    expect(messengerDiv).toBeInTheDocument();
    expect(messengerDiv.tagName).toBe("H4");
    expect(messengerDiv).toHaveStyle({ position: "absolute" });
    expect(screen.getByTestId("mui-app-bar")).toBeInTheDocument();
    expect(screen.getByTestId("mui-tool-bar")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("menus-wrapper")).toBeInTheDocument();
  });
});
