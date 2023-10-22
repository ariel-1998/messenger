import { MessageModel } from "../models/MessageModel";
import { authenticatedAxios } from "../utils/axiosInterceptors";

const sendMessageEndpoint = "message";
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
      sendMessageEndpoint,
      {
        chat: chatId,
        content,
      }
    );
    return data;
  }

  async getMessagesByChatId(chatId: string): Promise<MessageModel[]> {
    const endpoint = getMessagesByChatIDEndpoint(chatId);
    const { data } = await authenticatedAxios.get<MessageModel[]>(endpoint);
    return data;
  }
}

export const messageService = new MessageService();
