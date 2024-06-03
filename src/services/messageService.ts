import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";
import { authenticatedAxios } from "../utils/axiosInterceptors";
import { setChatLatestMessage } from "../utils/chatSlice";
import { store } from "../utils/reduxStore";

const messageEndpoint = "message";
const unreadMessagesEndpoint = `${messageEndpoint}/unread`;
const getMessagesByChatIDEndpoint = (chatId: string) => `message/${chatId}`;
class MessageService {
  async sendMessage({
    chatId,
    content,
    frontendTimeStamp,
  }: {
    chatId: string;
    content: string;
    frontendTimeStamp: Date;
  }): Promise<MessageModel> {
    const { data } = await authenticatedAxios.post<MessageModel>(
      messageEndpoint,
      {
        chat: chatId,
        content,
        frontendTimeStamp,
      }
    );
    store.dispatch(setChatLatestMessage(data));
    console.log("data", data);
    return data;
  }

  async getMessagesByChatId(chatId: string): Promise<MessageModel[]> {
    const endpoint = getMessagesByChatIDEndpoint(chatId);
    const { data } = await authenticatedAxios.get<MessageModel[]>(endpoint);
    return data;
  }

  async updateReadBy({
    messages,
    chatId,
  }: {
    messages: string[];
    chatId: string;
  }) {
    const stringifyIds = JSON.stringify(messages);
    console.log("updatingReadBy", messages);
    const { data } = await authenticatedAxios.put<ChatModel>(messageEndpoint, {
      messages: stringifyIds,
      chatId,
    });
    console.log(data);
    return data;
  }

  async getAllUnreadMessages({
    chats,
  }: {
    chats: string[];
  }): Promise<MessageModel[]> {
    const stringifyIds = JSON.stringify(chats);
    const { data } = await authenticatedAxios.post<MessageModel[]>(
      unreadMessagesEndpoint,
      {
        chats: stringifyIds,
      }
    );
    return data;
  }
}

export const messageService = new MessageService();
