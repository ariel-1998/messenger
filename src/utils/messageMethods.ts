import { QueryClient } from "@tanstack/react-query";
import { MessageModel } from "../models/MessageModel";
import { ChatModel } from "../models/ChatModel";
// import { UserModel } from "../models/UserModel";

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
  //not updating message if its chat messages haven't been cached (fatched) yet.
  // let cachedData: MessageModel[] | undefined = undefined;
  const cachedData = queryClient.getQueryData<MessageModel[] | undefined>([
    "messages",
    `{chatId: ${message.chat._id}}`,
  ]);
  if (checkCached && !cachedData) return;

  queryClient.setQueryData<Omit<MessageModel, "_id">[]>(
    ["messages", `{chatId: ${message.chat._id}}`],
    (oldData) => {
      if (!oldData) return [message];
      return [...oldData, message];
    }
  );
  return { prevCache: cachedData };
};

// type RevertMessage = Omit<
//   MessageModel,
//   "chat" | "_id" | "content" | "readBy"
// > & {
//   chatId: string;
// };
export const revertMessageOnError = (
  chatId: string,
  prevState: ReturnType<typeof updateMessages>,
  queryClient: QueryClient
) => {
  if (!prevState) return;
  const { prevCache } = prevState;
  queryClient.setQueryData<MessageModel[]>(
    ["messages", `{chatId: ${chatId}}`],
    prevCache
  );
  // queryClient.setQueryData<Omit<MessageModel, "_id">[]>(
  //   ["messages", `{chatId: ${message.chatId}}`],
  //   (oldData) => {
  //     if (!oldData) return;
  //     return oldData.filter((cachedMessage) => {
  //       if (
  //         new Date(cachedMessage.createdAt).getTime() ===
  //           new Date(message.createdAt).getTime() &&
  //         cachedMessage.sender._id === message.sender._id
  //       )
  //         return;
  //       return message;
  //     });
  //   }
  // );
};

export const updateMessagesReadBy = (
  chat: ChatModel,
  userId: string,
  queryClient: QueryClient
) => {
  queryClient.setQueryData<MessageModel[]>(
    ["messages", `{chatId: ${chat._id}}`],
    (oldData) => {
      if (!oldData) return;
      return oldData.map((message) => {
        if (message.readBy.includes(userId)) return message;
        return { ...message, readBy: [...message.readBy, userId] };
      });
    }
  );
};

export const skeletonRandomSender = () => Boolean(Math.round(Math.random()));
