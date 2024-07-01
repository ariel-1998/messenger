import { ThemeProvider, useMediaQuery } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as query from "@tanstack/react-query";
import { theme } from "../../../src/utils/theme";
import DrawerSearch from "../../../src/components/AppBarArea/DrawerSearch";
import userEvent from "@testing-library/user-event";
import { chatService } from "../../../src/services/chatService";
import { users } from "../../../mocks/mockData";
import useDrawer from "../../../src/hooks/useDrawer";
import useDebounce from "../../../src/hooks/useDebounce";

jest.mock("../../../src/hooks/useDrawer");
jest.mock("../../../src/hooks/useDebounce");
jest.mock("../../../src/services/userService");
jest.mock("../../../src/services/chatService");
jest.mock("../../../src/components/CustomComponents/LoadingSkeletons");
jest.mock("../../../src/components/ChatArea/GroupForms/ListItems");
jest.mock("../../../src/components/CustomComponents/CustomSearchInput");

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(false),
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
  it("should show loading states when debounce isLoading", () => {
    (useDebounce as jest.Mock).mockReturnValueOnce({
      isLoading: true,
      debounce: () => {},
    });
    render(<DrawerSearchTest />);
    expect(screen.queryByTestId("search-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
  });
  it("should show loading states when fetching users", async () => {
    const queryRes = {
      data: undefined,
      isFetching: true,
      isError: false,
    } as query.UseQueryResult;
    jest.spyOn(query, "useQuery").mockReturnValueOnce(queryRes);

    render(<DrawerSearchTest />);

    expect(screen.getByTestId("skeletons-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("mock-loading-skeletons")).toBeInTheDocument();
    expect(screen.getByTestId("mock-skeleton-user")).toBeInTheDocument();
  });
  it("should fetch users when clicking on user", async () => {
    render(<DrawerSearchTest />);
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");

    await user.type(input, "a");

    const userList = await screen.findByRole("user-list");
    expect(userList).toBeInTheDocument();

    const users = await screen.findAllByTestId("user-list-item");
    expect(users).toHaveLength(2);
    users.forEach((user) => expect(user).not.toBeDisabled());
  });
  it("should fetch chat when user is clicked", async () => {
    render(<DrawerSearchTest />);
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");

    await user.type(input, "a");

    const userList = await screen.findAllByTestId("user-list-item");
    await user.click(userList[0]);

    await waitFor(async () => {
      expect(chatService.accessChat).toHaveBeenCalledTimes(1);
      expect(chatService.accessChat).toHaveBeenCalledWith(users[0]._id);
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
    const userList = screen.getAllByTestId("user-list-item");
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
