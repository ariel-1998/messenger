import React, { ReactNode, createContext, useCallback, useState } from "react";
import { MessageModel } from "../models/MessageModel";
import { useQuery } from "@tanstack/react-query";
import { messageService } from "../services/messageService";
import { chatService } from "../services/chatService";
import { toastifyService } from "../services/toastifyService";

type UnreadMessages = Record<string, MessageModel[]>;
type UnreadMessagesContextProps = {
  unreadMessages: UnreadMessages;
  unreadAmount: number;
  addUnreadMessage: (message: MessageModel) => void;
  removeUnreadMessages: (chatId: string) => void;
  fetchingChats: boolean;
};

export const UnreadMessagesContext =
  createContext<UnreadMessagesContextProps | null>(null);

type UnreadMessagesProviderProps = {
  children: ReactNode;
};

const UnreadMessagesProvider: React.FC<UnreadMessagesProviderProps> = ({
  children,
}) => {
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessages>({});
  const [unreadAmount, setUnreadAmount] = useState<number>(0);

  const { isLoading: fetchingChats } = useQuery({
    queryKey: ["chats"],
    queryFn: chatService.getAllChats,
    onError: (e) => toastifyService.error(e),
  });
  useQuery({
    queryKey: ["getAllUnreadMessages"],
    queryFn: messageService.getAllUnreadMessages,
    onSuccess: (data) => {
      console.log("data ", data);
      const messagesByChatId: UnreadMessages = {};
      data.forEach((message) => addMessageToObj(messagesByChatId, message));
      setUnreadMessages(messagesByChatId);
      setUnreadAmount(data.length);
    },
  });

  const addUnreadMessage = useCallback((message: MessageModel) => {
    setUnreadMessages((prev) => {
      addMessageToObj(prev, message);
      return { ...prev };
    });
    setUnreadAmount((prev) => prev + 1);
  }, []);

  const removeUnreadMessages = useCallback((chatId: string) => {
    setUnreadMessages((prevMessages) => {
      const chatMessages = prevMessages[chatId] || [];

      setUnreadAmount((prevAmount) => prevAmount - chatMessages.length);
      delete prevMessages[chatId];
      return { ...prevMessages };
    });
  }, []);

  function addMessageToObj(obj: UnreadMessages, message: MessageModel) {
    const chatId = message.chat._id;
    if (!obj[chatId]) obj[chatId] = [];
    obj[chatId].push(message);
  }

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadMessages,
        unreadAmount,
        addUnreadMessage,
        removeUnreadMessages,
        fetchingChats,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export default UnreadMessagesProvider;
