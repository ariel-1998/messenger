import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatModel } from "../models/ChatModel";

type ChatState = {
  chats: ChatModel[];
  selectedChat: ChatModel | null;
};
let initialState: ChatState = {
  chats: [],
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
      action: PayloadAction<{ chat: ChatModel | null; isExist: boolean }>
    ) {
      const { chat, isExist } = action.payload;
      state.selectedChat = chat;
      if (isExist || !chat) return state;
      state.chats.unshift(chat);
      return state;
    },
    createGroup(state, action: PayloadAction<ChatModel>) {
      const chat = action.payload;
      state.selectedChat = chat;
      state.chats.unshift(chat);
      return state;
    },
    updateGroup(state, action: PayloadAction<ChatModel>) {
      const updatedGroup = action.payload;
      state.chats = state.chats.filter((chat) => chat._id !== updatedGroup._id);
      state.chats.unshift(updatedGroup);
      state.selectedChat = updatedGroup;
      return state;
    },
    deleteGroup(state, action: PayloadAction<string>) {
      const groupId = action.payload;
      state.chats = state.chats.filter((chat) => chat._id !== groupId);
      state.selectedChat = null;
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
} = chatSlice.actions;

export default chatSlice.reducer;
