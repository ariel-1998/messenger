import { ChatModel } from "../models/ChatModel";
import { UserModel } from "../models/UserModel";
import { authenticatedAxios } from "../utils/axiosInterceptors";

const chatEndpoint = "chat";
const createGroupEndpoint = "chat/group";
const deleteGroupEndpoint = (groupId: string) => `chat/group/${groupId}`;
const renameGroupEndpoint = (groupId: string) => `chat/group/${groupId}/rename`;
const addtoGroupEndpoint = (groupId: string) => `chat/group/${groupId}/members`;
const removeFromGroupEndpoint = (groupId: string, userId: string) =>
  `chat/group/${groupId}/members/${userId}`;

class ChatService {
  async accessChat(userId: string): Promise<ChatModel> {
    const { data } = await authenticatedAxios.post(chatEndpoint, { userId });
    return data;
  }

  async getAllChats(): Promise<ChatModel[]> {
    const { data } = await authenticatedAxios.get(chatEndpoint);
    return data;
  }

  async createGroupChat({
    users,
    chatName,
  }: {
    users: UserModel[];
    chatName: string;
  }) {
    const usersIds = users.map((user) => user._id);
    const stringifyIds = JSON.stringify(usersIds);
    const { data } = await authenticatedAxios.post(createGroupEndpoint, {
      stringifyIds,
      chatName,
    });
    return data;
  }

  async deleteGroupChat(groupId: string) {
    const endpoint = deleteGroupEndpoint(groupId);
    await authenticatedAxios.delete(endpoint);
  }

  async renameGroup(chatName: string, groupId: string) {
    const endpoint = renameGroupEndpoint(groupId);
    const { data } = await authenticatedAxios.put(endpoint, { chatName });
    return data;
  }

  async addMembersToGroup(groupId: string, usersIds: string[]) {
    const users = JSON.stringify(usersIds);
    const endpoint = addtoGroupEndpoint(groupId);
    const { data } = await authenticatedAxios.put(endpoint, { users });
    return data;
  }

  async removeMembersFromGroup(groupId: string, userId: string) {
    const endpoint = removeFromGroupEndpoint(groupId, userId);
    await authenticatedAxios.delete(endpoint);
  }
}

export const chatService = new ChatService();
