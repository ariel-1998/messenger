import { QueryClient } from "@tanstack/react-query";
import { MessageModel } from "../models/MessageModel";

export const showSenderDetails = (
  isGroupChat: boolean | undefined,
  index: number,
  messages: MessageModel[],
  message: MessageModel,
  senderIsMe: boolean
) => {
  if (!isGroupChat) return false;
  if (isGroupChat && senderIsMe) return false;
  if (!messages[index - 1]) return true;
  if (messages[index - 1].sender._id !== message.sender._id) return true;
  return false;
};

export const shouldMakeMarginLeftToMsg = (
  isGroupChat: boolean | undefined,
  index: number,
  messages: MessageModel[],
  message: MessageModel,
  senderIsMe: boolean
) => {
  if (!isGroupChat) return false;
  if (isGroupChat && senderIsMe) return false;
  if (!messages[index - 1]) return false;
  if (messages[index - 1].sender._id === message.sender._id) return true;
  return false;
};

export const messageMarginTop = (
  messages: MessageModel[],
  message: MessageModel,
  index: number
) => {
  if (!messages[index - 1]) return 0;
  if (messages[index - 1].sender._id === message.sender._id) return 1;
  return 2;
};

export const updateMessages = (
  message: Omit<MessageModel, "_id">,
  queryClient: QueryClient,
  checkCached = true
) => {
  //not updating message if its chat messages haven't been cached (fatched) yet,
  if (checkCached) {
    const isCached = queryClient.getQueryData<MessageModel[] | undefined>([
      "messages",
      `{chatId: ${message.chat._id}}`,
    ]);
    if (!isCached) return;
  }
  queryClient.setQueryData<Omit<MessageModel, "_id" | "createdAt">[]>(
    ["messages", `{chatId: ${message.chat._id}}`],
    (oldData) => {
      if (!oldData) return [message];
      return [...oldData, message];
    }
  );
};
