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
      action: PayloadAction<{ chat: ChatModel; isExist: boolean }>
    ) {
      const { chat, isExist } = action.payload;
      state.selectedChat = chat;
      if (isExist) return state;
      state.chats.unshift(chat);
      return state;
    },
    createGroup(state, action: PayloadAction<ChatModel>) {
      const chat = action.payload;
      state.selectedChat = chat;
      state.chats.unshift(chat);
      return state;
    },
    renameGroup(state, action: PayloadAction<ChatModel>) {
      const renamedChat = action.payload;
      state.chats = state.chats.filter((chat) => chat._id !== renamedChat._id);
      state.chats.unshift(renamedChat);
      return state;
    },
  },
});

export const { getAllChats, setSelectedChat, createGroup, renameGroup } =
  chatSlice.actions;

export default chatSlice.reducer;
