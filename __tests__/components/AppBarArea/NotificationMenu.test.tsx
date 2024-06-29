import { render, screen } from "@testing-library/react";
import NotificationMenu from "../../../src/components/AppBarArea/NotificationMenu";
import * as chatSlice from "../../../src/utils/chatSlice";
import { messages } from "../../../mocks/mockData";
import userEvent from "@testing-library/user-event";
import useUnreadMessages from "../../../src/hooks/useUnreadMessages";
import { useDispatch } from "react-redux";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("../../../src/hooks/useUnreadMessages");
const mockSetSelectedChat = jest.spyOn(chatSlice, "setSelectedChat");

const mockUseUnreadMessages = useUnreadMessages as jest.MockedFunction<
  typeof useUnreadMessages
>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;

describe("NotificationMenu", () => {
  it("should render properly when there are unread messages", () => {
    render(<NotificationMenu />);
    expect(screen.getByRole("notification-menu")).toBeInTheDocument();
    expect(screen.getByRole("open-menu-button")).toBeInTheDocument();
    const bagdge = screen.getByTestId("icon-badge");
    expect(bagdge).toBeInTheDocument();
    expect(bagdge).toHaveTextContent("2");

    expect(screen.getByTestId("NotificationsIcon")).toBeInTheDocument();

    const messagesList = screen.queryAllByRole("unread-message-list-item");
    expect(messagesList).toHaveLength(0);
    expect(screen.queryByText("No messages")).not.toBeInTheDocument();
  });
  it("should render properly when there are NO unread messages", () => {
    mockUseUnreadMessages.mockReturnValue({
      unreadMessages: {},
      unreadAmount: 0,
      addUnreadMessage: jest.fn(),
      removeUnreadMessages: jest.fn(),
      fetchingChats: false,
    });
    render(<NotificationMenu />);
    const badge = screen.getByTestId("icon-badge");
    console.log(useUnreadMessages().unreadMessages);

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("");
  });
  it("message list should apear properly when clicking the menu and there are unread messages", async () => {
    render(<NotificationMenu />);
    const user = userEvent.setup();
    const menuBtn = screen.getByRole("open-menu-button");

    await user.click(menuBtn);

    const messagesList = screen.queryAllByRole("unread-message-list-item");
    expect(messagesList).toHaveLength(messages.length);
    expect(screen.queryByText("No messages")).not.toBeInTheDocument();
  });
  it("message list should apear properly when clicking the menu and there are NO unread messages", async () => {
    mockUseUnreadMessages.mockReturnValue({
      unreadMessages: {},
      unreadAmount: 0,
      addUnreadMessage: jest.fn(),
      removeUnreadMessages: jest.fn(),
      fetchingChats: false,
    });
    render(<NotificationMenu />);
    const user = userEvent.setup();
    const menuBtn = screen.getByRole("open-menu-button");
    await user.click(menuBtn);

    const messagesList = screen.queryAllByRole("unread-message-list-item");
    expect(messagesList).toHaveLength(0);
    expect(screen.getByText("No messages")).toBeInTheDocument();
  });
  it("should dispatch setSelectedChat when clicking a chat", async () => {
    render(<NotificationMenu />);
    const user = userEvent.setup();
    const menuBtn = screen.getByRole("open-menu-button");
    await user.click(menuBtn);

    const messagesList = screen.getAllByRole("unread-message-list-item");
    await user.click(messagesList[0]);
    expect(mockUseDispatch()).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedChat).toHaveBeenCalledTimes(1);
  });
});
