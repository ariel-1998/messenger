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
  }: {
    chatId: string;
    content: string;
  }): Promise<MessageModel> {
    const { data } = await authenticatedAxios.post<MessageModel>(
      messageEndpoint,
      {
        chat: chatId,
        content,
      }
    );
    // store.dispatch(setChatLatestMessage(data));
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
    await authenticatedAxios.put(messageEndpoint, {
      messages: stringifyIds,
      chatId,
    });
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
