import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";
import { authenticatedAxios } from "../utils/axiosInterceptors";
import { setChatLatestMessage } from "../utils/chatSlice";
import { store } from "../utils/reduxStore";

const messageEndpoint = "message";
const unreadMessagesEndpoint = `${messageEndpoint}/unread`;
const getMessagesByChatIDEndpoint = (chatId: string) =>
  `message/chat/${chatId}`;
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
    return data;
  }

  async getMessagesByChatId(chatId: string): Promise<MessageModel[]> {
    const endpoint = getMessagesByChatIDEndpoint(chatId);
    const { data } = await authenticatedAxios.get<MessageModel[]>(endpoint);
    return data;
  }

  async updateReadBy({ chatId }: { chatId: string }) {
    const { data } = await authenticatedAxios.put<ChatModel>(messageEndpoint, {
      chatId,
    });
    return data;
  }

  async getAllUnreadMessages(): Promise<MessageModel[]> {
    const { data } = await authenticatedAxios.get<MessageModel[]>(
      unreadMessagesEndpoint
    );
    console.log("data", data);
    return data;
  }
}

export const messageService = new MessageService();
