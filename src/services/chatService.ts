import { ChatModel } from "../models/ChatModel";
import { UserModel } from "../models/UserModel";
import { authenticatedAxios } from "../utils/axiosInterceptors";
import {
  createGroup,
  getAllChats,
  renameGroup,
  setSelectedChat,
} from "../utils/chatSlice";
import { store } from "../utils/reduxStore";

const chatEndpoint = "chat";
const createGroupEndpoint = "chat/group";
const deleteGroupEndpoint = (groupId: string) => `chat/group/${groupId}`;
const renameGroupEndpoint = (groupId: string) => `chat/group/${groupId}/rename`;
const addtoGroupEndpoint = (groupId: string) => `chat/group/${groupId}/members`;
const removeFromGroupEndpoint = (groupId: string, userId: string) =>
  `chat/group/${groupId}/members/${userId}`;

class ChatService {
  async accessChat(userId: string) {
    const { chats } = store.getState().chat;
    const chat = chats?.find(
      (chat) =>
        !chat.isGroupChat && chat.users.some((user) => user._id === userId)
    );
    if (chat) return store.dispatch(setSelectedChat({ chat, isExist: true }));

    const { data } = await authenticatedAxios.post<ChatModel>(chatEndpoint, {
      userId,
    });
    store.dispatch(setSelectedChat({ chat: data, isExist: false }));
  }

  async getAllChats() {
    const { data } = await authenticatedAxios.get<ChatModel[]>(chatEndpoint);
    store.dispatch(getAllChats(data));
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
      users: stringifyIds,
      chatName,
    });
    store.dispatch(createGroup(data));
  }

  async renameGroup({
    chatName,
    groupId,
  }: {
    chatName: string;
    groupId: string;
  }) {
    const endpoint = renameGroupEndpoint(groupId);
    const { data } = await authenticatedAxios.put(endpoint, { chatName });
    store.dispatch(renameGroup(data));
  }

  async deleteGroupChat(groupId: string) {
    const endpoint = deleteGroupEndpoint(groupId);
    await authenticatedAxios.delete(endpoint);
  }

  async addMembersToGroup({
    groupId,
    users,
  }: {
    groupId: string;
    users: UserModel[];
  }): Promise<ChatModel> {
    const usersIds = users.map((user) => user._id);
    const stringifyIds = JSON.stringify(usersIds);
    const endpoint = addtoGroupEndpoint(groupId);
    const { data } = await authenticatedAxios.put(endpoint, {
      users: stringifyIds,
    });
    return data;
  }

  async removeMembersFromGroup(groupId: string, userId: string) {
    const endpoint = removeFromGroupEndpoint(groupId, userId);
    await authenticatedAxios.delete(endpoint);
  }
}

export const chatService = new ChatService();
