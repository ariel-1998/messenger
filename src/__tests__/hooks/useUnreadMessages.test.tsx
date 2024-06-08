import { render, screen, waitFor } from "@testing-library/react";
import useUnreadMessages from "../../hooks/useUnreadMessages";
import { MessageModel } from "../../models/MessageModel";
import UnreadMessagesProvider from "../../contexts/UnreadMessagesProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import "../serverSetup";

const Messages = ({ chatId = "15" }) => {
  const {
    addUnreadMessage,
    fetchingChats,
    removeUnreadMessages,
    unreadAmount,
    unreadMessages,
  } = useUnreadMessages();
  const message: MessageModel = {
    _id: "someId",
    content: "message",
    frontendTimeStamp: new Date(),
    sender: {
      _id: "userId",
      email: "someEmail@gmail.com",
      image: "someUrl",
      name: "userName",
    },
    readBy: [],
    chat: { _id: chatId, chatName: "chatName", isGroupChat: false, users: [] },
  };
  return (
    <>
      <div role="unreadMessages">{Object.entries(unreadMessages).length}</div>
      <div role="unreadAmount">{unreadAmount}</div>
      {fetchingChats && <div role="fetchingChats">fetching</div>}
      <button onClick={() => removeUnreadMessages(chatId)}>
        removeUnreadMessages
      </button>
      <button onClick={() => addUnreadMessage(message)}>
        addUnreadMessage
      </button>
    </>
  );
};
describe("useUnreadMessages", () => {
  it("initial states should be correct", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <UnreadMessagesProvider>
          <Messages chatId="15" />
        </UnreadMessagesProvider>
      </QueryClientProvider>
    );

    const fetchingChats = screen.getByRole("fetchingChats");
    expect(fetchingChats).toHaveTextContent("fetching");
    const undreadMessages = screen.getByRole("unreadMessages");
    expect(undreadMessages).toHaveTextContent("0");
    const unreadAmount = screen.getByRole("unreadAmount");
    expect(unreadAmount).toHaveTextContent("0");
  });
  it("should have the fetched data stored in states", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <UnreadMessagesProvider>
          <Messages chatId="15" />
        </UnreadMessagesProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const undreadMessages = screen.getByRole("unreadMessages");
      expect(undreadMessages).toHaveTextContent("2");
      const unreadAmount = screen.getByRole("unreadAmount");
      expect(unreadAmount).toHaveTextContent("2");
    });
    const fetchingChats = screen.queryByRole("fetchingChats");
    expect(fetchingChats).not.toBeInTheDocument();
  });
  it("should add and remove unread messages and reduce unread amount when reading chat", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <UnreadMessagesProvider>
          <Messages chatId="15" />
        </UnreadMessagesProvider>
      </QueryClientProvider>
    );
    const user = userEvent.setup();
    const undreadMessages = screen.getByRole("unreadMessages");
    const unreadAmount = screen.getByRole("unreadAmount");

    await waitFor(async () => {
      const addUnreadMessage = screen.getByText("addUnreadMessage");
      await user.click(addUnreadMessage);
      expect(undreadMessages).toHaveTextContent("3");
      expect(unreadAmount).toHaveTextContent("3");
    });
    const removeUnreadMessages = screen.getByText("removeUnreadMessages");
    await user.click(removeUnreadMessages);
    expect(undreadMessages).toHaveTextContent("2");
    expect(unreadAmount).toHaveTextContent("2");
  });
});
