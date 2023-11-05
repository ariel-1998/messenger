import { ChatModel } from "../models/ChatModel";
import { UserModel } from "../models/UserModel";
import { authenticatedAxios } from "../utils/axiosInterceptors";
import {
  createGroup,
  getAllChats,
  updateGroup,
  setSelectedChat,
  deleteGroup,
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
    console.log(data);
    store.dispatch(getAllChats(data));
    return data;
  }

  async createGroupChat({
    users,
    chatName,
    groupImg,
  }: {
    users: UserModel[];
    chatName: string;
    groupImg?: string;
  }) {
    const usersIds = users.map((user) => user._id);
    const stringifyIds = JSON.stringify(usersIds);
    const { data } = await authenticatedAxios.post<ChatModel>(
      createGroupEndpoint,
      { groupImg, users: stringifyIds, chatName }
    );
    store.dispatch(createGroup(data));
    return data;
  }

  async renameGroup({
    chatName,
    groupId,
  }: {
    chatName: string;
    groupId: string;
  }) {
    const endpoint = renameGroupEndpoint(groupId);
    const { data } = await authenticatedAxios.put<ChatModel>(endpoint, {
      chatName,
    });
    store.dispatch(updateGroup(data));
  }

  async addMembersToGroup({
    groupId,
    users,
  }: {
    groupId: string;
    users: UserModel[];
  }) {
    const usersIds = users.map((user) => user._id);
    const stringifyIds = JSON.stringify(usersIds);
    const endpoint = addtoGroupEndpoint(groupId);
    const { data } = await authenticatedAxios.put<ChatModel>(endpoint, {
      users: stringifyIds,
    });
    store.dispatch(updateGroup(data));
    return data;
  }

  async removeMembersFromGroup({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }) {
    const endpoint = removeFromGroupEndpoint(groupId, userId);
    const { data, status } = await authenticatedAxios.put<ChatModel>(endpoint);
    if (status === 200) {
      store.dispatch(updateGroup(data));
      return data;
    } else store.dispatch(deleteGroup(groupId));
  }

  async deleteGroupChat(groupId: string) {
    const endpoint = deleteGroupEndpoint(groupId);
    await authenticatedAxios.delete(endpoint);
    store.dispatch(deleteGroup(groupId));
  }
}

export const chatService = new ChatService();
