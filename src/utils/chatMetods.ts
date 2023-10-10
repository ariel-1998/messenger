import { ChatModel } from "../models/ChatModel";

export const findChatIndexById = (chatList: ChatModel[], chat: ChatModel) => {
  const index = chatList.findIndex((item) => item._id === chat._id);
  return index;
};
