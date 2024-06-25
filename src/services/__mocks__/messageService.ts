import { messages } from "../../../mocks/mockData";

class MessageService {
  // async sendMessage({
  //   chatId,
  //   content,
  // }: // frontendTimeStamp,
  // {
  //   chatId: string;
  //   content: string;
  //   // createdAt: Date;
  // }): Promise<MessageModel> {
  //   const { data } = await authenticatedAxios.post<MessageModel>(
  //     messageEndpoint,
  //     {
  //       chat: chatId,
  //       content,
  //       // frontendTimeStamp,
  //     }
  //   );
  //   store.dispatch(setChatLatestMessage(data));
  //   return data;
  // }

  // async getMessagesByChatId(chatId: string): Promise<MessageModel[]> {
  //   const endpoint = getMessagesByChatIDEndpoint(chatId);
  //   const { data } = await authenticatedAxios.get<MessageModel[]>(endpoint);
  //   return data;
  // }

  // async updateReadBy({ chatId }: { chatId: string }) {
  //   const { data } = await authenticatedAxios.put<ChatModel>(messageEndpoint, {
  //     chatId,
  //   });
  //   return data;
  // }
  getAllUnreadMessages = jest.fn().mockReturnValue(messages);
}

export const messageService = new MessageService();
