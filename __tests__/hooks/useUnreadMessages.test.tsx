import { act, renderHook, waitFor } from "@testing-library/react";
import useUnreadMessages from "../../src/hooks/useUnreadMessages";
import UnreadMessagesProvider from "../../src/contexts/UnreadMessagesProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { MessageModel } from "../../src/models/MessageModel";
import { users } from "../../mocks/mockData";

jest.mock("../../src/services/chatService");
jest.mock("../../src/services/messageService");

const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <UnreadMessagesProvider>{children}</UnreadMessagesProvider>
    </QueryClientProvider>
  );
};

describe("useUnreadMessages", () => {
  it("should provide initial values properly", () => {
    const { result } = renderHook(useUnreadMessages, { wrapper });

    expect(result.current.unreadAmount).toBe(0);
    expect(result.current.unreadMessages).toStrictEqual({});
    expect(result.current.fetchingChats).toBe(true);
  });

  it("should return the right values after fetching initial data", async () => {
    const { result } = renderHook(useUnreadMessages, { wrapper });
    await waitFor(() => {
      expect(result.current.unreadAmount).toBe(2);
      expect(Object.entries(result.current.unreadMessages)).toHaveLength(2);
      expect(result.current.fetchingChats).toBe(false);
    });
  });
  it("should add and remove unread messages and reduce unread amount when reading chat", async () => {
    const messageToAdd: MessageModel = {
      chat: {
        _id: "someChatId",
        chatName: "someName",
        isGroupChat: false,
        users: [],
      },
      content: "message",
      createdAt: new Date(),
      readBy: [],
      sender: users[0],
      _id: "messageId",
    };
    const { result } = renderHook(useUnreadMessages, { wrapper });
    await waitFor(() => expect(result.current.unreadAmount).toBe(2));
    act(() => result.current.addUnreadMessage(messageToAdd));

    expect(result.current.unreadAmount).toBe(3);
    expect(Object.entries(result.current.unreadMessages)).toHaveLength(3);
    expect(result.current.fetchingChats).toBe(false);

    act(() => result.current.removeUnreadMessages("someChatId"));

    expect(result.current.unreadAmount).toBe(2);
    expect(Object.entries(result.current.unreadMessages)).toHaveLength(2);
    expect(result.current.fetchingChats).toBe(false);
  });
});
