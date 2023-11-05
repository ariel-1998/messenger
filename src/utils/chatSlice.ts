import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";

type ChatState = {
  chats: ChatModel[] | null;
  selectedChat: ChatModel | null;
};
let initialState: ChatState = {
  chats: null,
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getAllChats(state, action: PayloadAction<ChatModel[]>) {
      const chats = action.payload;
      state.chats = chats;
      return state;
    },

    setSelectedChat(
      state,
      action: PayloadAction<{
        chat: ChatModel | null;
        checkIfExists?: boolean;
        isExist?: boolean;
      }>
    ) {
      const { chat, isExist, checkIfExists } = action.payload;
      state.selectedChat = chat;
      if (!chat || isExist) return state;
      if (checkIfExists) {
        const chatIndex = state.chats?.findIndex(
          (cachedChat) => cachedChat._id === chat._id
        );
        if (chatIndex !== -1) return state;
      }
      state.chats?.unshift(chat);
      return state;
    },
    createGroup(state, action: PayloadAction<ChatModel>) {
      const chat = action.payload;
      state.selectedChat = chat;
      state.chats?.unshift(chat);
      return state;
    },
    updateGroup(state, action: PayloadAction<ChatModel>) {
      const updatedGroup = action.payload;
      if (!state.chats) return;
      const chatToUpdateIndex = state.chats?.findIndex(
        (chat) => chat._id === updatedGroup._id
      );
      if (chatToUpdateIndex === -1) {
        state.chats.unshift(updatedGroup);
      } else {
        state.chats[chatToUpdateIndex] = { ...updatedGroup };
      }
      if (state.selectedChat?._id !== updatedGroup._id) return state;
      state.selectedChat = { ...updatedGroup };
      return state;
    },
    onAddedToGroup(state, action: PayloadAction<ChatModel>) {
      const AddedToGroup = action.payload;
      if (!state.chats) state.chats = [];
      const index = state.chats.findIndex(
        (chat) => AddedToGroup._id === chat._id
      );
      if (index !== -1) state.chats[index] = AddedToGroup;
      else state.chats.unshift(action.payload);
      return state;
    },
    onRemoveFromGroup(
      state,
      action: PayloadAction<{ chat: ChatModel; isRemoved: boolean }>
    ) {
      if (!state.chats) return;
      const { chat, isRemoved } = action.payload;

      const index = state.chats.findIndex(
        (cachedChat) => cachedChat._id === chat._id
      );
      if (state.selectedChat?._id === chat._id && isRemoved)
        state.selectedChat = null;
      if (state.selectedChat?._id === chat._id && !isRemoved)
        state.selectedChat = chat;
      if (index === -1) return;
      if (isRemoved) state.chats.splice(index, 1);
      else state.chats[index] = chat;
      return state;
    },
    deleteGroup(state, action: PayloadAction<string>) {
      const groupId = action.payload;
      if (state.selectedChat?._id === groupId) state.selectedChat = null;
      if (!state.chats) return;
      const chatToUpdateIndex = state.chats?.findIndex(
        (chat) => chat._id === groupId
      );
      if (chatToUpdateIndex === -1) return;
      state.chats.splice(chatToUpdateIndex, 1);
      return state;
    },
    setChatLatestMessage(state, action: PayloadAction<MessageModel>) {
      const message = action.payload;
      const chatId = message.chat._id;
      if (!state.chats) state.chats = [];
      const chatToUpdateIndex = state.chats.findIndex(
        (chat) => chat._id === chatId
      );
      if (chatToUpdateIndex === -1) {
        const chat = { ...message.chat };
        chat.latestMessage = { ...message };
        state.chats.unshift(chat);
      } else state.chats[chatToUpdateIndex].latestMessage = message;
      return state;
    },
  },
});

export const {
  getAllChats,
  setSelectedChat,
  createGroup,
  updateGroup,
  deleteGroup,
  onAddedToGroup,
  onRemoveFromGroup,
  setChatLatestMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
