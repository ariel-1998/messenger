import "../../serverSetup";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import DrawerSearch from "../../../components/AppBarArea/DrawerSearch";
import { theme } from "../../../utils/theme";
import { ToastContainer } from "react-toastify";
import { render, screen, waitFor } from "@testing-library/react";
import { ComponentProps, ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { server } from "../../../__mocks__/mswServer";
import { rest } from "msw";

// import { userService } from "../../../services/userService";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(false),
}));

jest.mock("../../../components/CustomComponents/LoadingSkeletons", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-loading-skeletons">{children}</div>
  ),
  SkeletonUser: () => (
    <div data-testid="mock-skeleton-user">Mock Skeleton User</div>
  ),
}));

jest.mock("@mui/icons-material", () => ({
  ...jest.requireActual("@mui/icons-material"),
  Search: () => <div data-testid="search-icon">search icon</div>,
}));

jest.mock("../../../components/ChatArea/GroupForms/ListItems", () => ({
  User: ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user,
    disableBtnProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sx,
    ...rest
  }: {
    sx: unknown;
    disableBtnProps: boolean;
    user: unknown;
  } & ComponentProps<"button">) => {
    console.log("disableBtnProps", disableBtnProps);
    return (
      <button data-testid="user-list-item" {...rest} disabled={disableBtnProps}>
        Mock User
      </button>
    );
  },
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useMutation: jest.fn(),
}));

jest.mock("../../../hooks/useDrawer", () => ({
  __esModule: true,
  default: () => ({
    closeDrawer: jest.fn(),
  }),
}));

function DrawerSearchTest() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider theme={theme}>
        <DrawerSearch />
        <ToastContainer />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
describe("DrawerSearch", () => {
  beforeEach(() => {
    (useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });
  });
  it("initial render should work properly", () => {
    render(<DrawerSearchTest />);
    const drawerWrapper = screen.getByTestId("drawer-wrapper");
    expect(drawerWrapper).toBeInTheDocument();
    expect(drawerWrapper).toHaveStyle({ width: "400px" });
    expect(screen.getByRole("list")).toBeInTheDocument();
    const inputWrapper = screen.getByTestId("input-wrapper");
    expect(inputWrapper).toBeInTheDocument();
    expect(inputWrapper).toHaveStyle({ position: "sticky", top: 0, zIndex: 1 });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("icon-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
    expect(screen.queryByText("Users not found!")).not.toBeInTheDocument();
    expect(screen.queryByTestId("skeletons-wrapper")).not.toBeInTheDocument();
    expect(screen.queryByRole("user-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-chat")).not.toBeInTheDocument();
  });
  it("drawer wrapper should have specific width in smaller screens", () => {
    (useMediaQuery as jest.Mock).mockReturnValueOnce(true);
    render(<DrawerSearchTest />);
    expect(screen.getByTestId("drawer-wrapper")).toHaveStyle({ width: "80vw" });
  });
  // it.only("should display users error properly when users not found", async () => {
  //   server.use(
  //     // http://localhost:3001/api/
  //     rest.get(`http://localhost:3001/api/user`, (_, res, ctx) => {
  //       return res(
  //         ctx.status(500),
  //         ctx.json({ message: "Internal Server Error" })
  //       );
  //     })
  //   );
  //   render(<DrawerSearchTest />);
  //   const user = userEvent.setup();
  //   const input = screen.getByRole("textbox");

  //   await user.type(input, "a");

  //   expect(screen.queryByTestId("skeletons-wrapper")).not.toBeInTheDocument();
  //   expect(screen.queryByRole("user-list")).not.toBeInTheDocument();
  //   expect(screen.queryByTestId("loading-chat")).not.toBeInTheDocument();
  //   expect(await screen.findByText("Users not found!")).toBeInTheDocument();
  // });
  it("should search and display users and loading states properly", async () => {
    render(<DrawerSearchTest />);
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");

    await user.type(input, "a");

    expect(screen.queryByTestId("search-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("progress-bar")).toBeInTheDocument();

    await waitFor(async () => {
      expect(screen.getByTestId("skeletons-wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("mock-loading-skeletons")).toBeInTheDocument();
      expect(screen.getByTestId("mock-skeleton-user")).toBeInTheDocument();
    });

    const userList = await screen.findByRole("user-list");
    expect(userList).toBeInTheDocument();
    const users = await screen.findAllByRole("user-list-item");
    expect(users).toHaveLength(2);

    expect(screen.queryByTestId("skeletons-wrapper")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("mock-loading-skeletons")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-skeleton-user")).not.toBeInTheDocument();

    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
  });
  it("should call chat mutation", async () => {
    render(<DrawerSearchTest />);
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");

    expect(screen.queryByTestId("loading-chat")).not.toBeInTheDocument();

    await user.type(input, "a");

    const users = await screen.findAllByRole("user-list-item");
    expect(users[0]).not.toBeDisabled();
    expect(users[1]).not.toBeDisabled();
    await user.click(users[0]);
    expect(useMutation({}).mutate).toHaveBeenCalledTimes(1);
  });
  it("should display loading states and disable user buttons when mutation is loading", async () => {
    useMutation({}).isLoading = true;
    render(<DrawerSearchTest />);

    const user = userEvent.setup();
    const input = screen.getByRole("textbox");

    await user.type(input, "a");

    const users = await screen.findAllByRole("user-list-item");
    expect(users[0]).toBeDisabled();
    expect(users[1]).toBeDisabled();
    expect(screen.getByTestId("loading-chat")).toBeInTheDocument();
  });
});
