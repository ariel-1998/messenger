import React, { ReactNode, createContext, useState } from "react";
import { MessageModel } from "../models/MessageModel";
import { useMutation, useQuery } from "@tanstack/react-query";
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
    onSuccess: (data) => {
      if (!data.length) return;
      const chatIds = data?.map((chat) => chat._id);
      getUnreadMessagesMutation.mutate({ chats: chatIds });
    },
  });

  const getUnreadMessagesMutation = useMutation({
    mutationFn: messageService.getAllUnreadMessages,
    onSuccess: (data) => {
      const messagegeByChatId: UnreadMessages = {};
      data.forEach((message) => addMessageToObj(messagegeByChatId, message));
      setUnreadMessages(messagegeByChatId);
      setUnreadAmount(data.length);
    },
  });

  const addUnreadMessage = (message: MessageModel) => {
    setUnreadMessages((prev) => {
      addMessageToObj(prev, message);
      return { ...prev };
    });
    setUnreadAmount((prev) => prev + 1);
  };

  const removeUnreadMessages = (chatId: string) => {
    setUnreadMessages((prevMessages) => {
      setUnreadAmount(
        (prevAmount) => prevAmount - prevMessages[chatId]?.length
      );
      delete prevMessages[chatId];
      return { ...prevMessages };
    });
  };

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

function addMessageToObj(obj: UnreadMessages, message: MessageModel) {
  const chatId = message.chat._id;
  if (!obj[chatId]) obj[chatId] = [];
  obj[chatId].push(message);
}
