/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { render, screen, waitFor } from "@testing-library/react";
import { ComponentProps, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as query from "@tanstack/react-query";
import { theme } from "../../../src/utils/theme";
import DrawerSearch from "../../../src/components/AppBarArea/DrawerSearch";
import userEvent from "@testing-library/user-event";
import { chatService } from "../../../src/services/chatService";
import { users } from "../../../mocks/mockData";
import useDrawer from "../../../src/hooks/useDrawer";

jest.mock("../../../src/services/userService");
jest.mock("../../../src/services/chatService");

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(false),
}));

jest.mock("../../../src/components/CustomComponents/LoadingSkeletons", () => ({
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

jest.mock("../../../src/components/ChatArea/GroupForms/ListItems", () => ({
  User: ({
    user,
    disableBtnProps,
    sx,
    ...rest
  }: {
    sx: unknown;
    disableBtnProps: boolean;
    user: unknown;
  } & ComponentProps<"button">) => {
    return (
      <button data-testid="user-list-item" {...rest} disabled={disableBtnProps}>
        Mock User
      </button>
    );
  },
}));

jest.mock("../../../src/hooks/useDrawer", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
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
  it("should fetch + display users and show loading states properly", async () => {
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
    expect(users[0]).not.toBeDisabled();
    expect(users[1]).not.toBeDisabled();

    expect(screen.queryByTestId("skeletons-wrapper")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("mock-loading-skeletons")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-skeleton-user")).not.toBeInTheDocument();

    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
  });
  it("should fetch chat when user is clicked", async () => {
    render(<DrawerSearchTest />);
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");

    await user.type(input, "a");
    const userList = await screen.findAllByRole("user-list-item");
    await user.click(userList[0]);
    await waitFor(async () => {
      expect(chatService.accessChat).toHaveBeenCalledTimes(1);
      expect(chatService.accessChat).toHaveBeenCalledWith(users[0]._id);
    });
    await waitFor(() => {
      expect(useDrawer().closeDrawer).toHaveBeenCalledTimes(1);
    });
  });
  it("should show loading state when fetching chat", () => {
    const queryRes = {
      data: users,
      isFetching: false,
      isError: false,
    } as query.UseQueryResult;
    const mutationRes = {
      mutate: jest.fn(),
      isLoading: true,
    } as unknown as query.UseMutationResult;
    jest.spyOn(query, "useMutation").mockReturnValueOnce(mutationRes);
    jest.spyOn(query, "useQuery").mockReturnValueOnce(queryRes);
    render(<DrawerSearchTest />);
    const userList = screen.getAllByRole("user-list-item");
    expect(userList[0]).toBeDisabled();
    expect(userList[1]).toBeDisabled();
    expect(screen.getByTestId("loading-chat")).toBeInTheDocument();
  });
  it("should display users error properly when users not found", () => {
    const queryRes = {
      data: undefined,
      isFetching: false,
      isError: true,
    } as query.UseQueryResult;
    jest.spyOn(query, "useQuery").mockReturnValueOnce(queryRes);
    render(<DrawerSearchTest />);
    expect(screen.getByText("Users not found!")).toBeInTheDocument();
    expect(screen.queryByRole("user-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("skeletons-wrapper")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-chat")).not.toBeInTheDocument();
  });
});
