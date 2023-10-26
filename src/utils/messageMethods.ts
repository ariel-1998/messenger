import { QueryClient } from "@tanstack/react-query";
import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";

export const showSenderDetails = (
  isGroupChat: boolean | undefined,
  index: number,
  messages: MessageModel[],
  message: MessageModel,
  senderIsMe: boolean
) => {
  //   if (!isGroupChat || senderIsMe) return false;
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
  //   if (!isGroupChat || senderIsMe) return false;
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

{
  /*add messages to the query cache, 
  if there is no cached data there is no that means still didnt enter that certain chat
  so there is no need to update if havent retrived yet
  **/
}
export const updateMessages = (
  message: MessageModel,
  queryClient: QueryClient,
  checkCached = true
) => {
  if (checkCached) {
    const isCached = queryClient.getQueryData<MessageModel[] | undefined>([
      "messages",
      `{chatId: ${message.chat._id}}`,
    ]);
    if (!isCached) return;
  }
  queryClient.setQueryData<MessageModel[]>(
    ["messages", `{chatId: ${message.chat._id}}`],
    (oldData) => {
      if (!oldData) return [message];
      return [...oldData, message];
    }
  );
};
