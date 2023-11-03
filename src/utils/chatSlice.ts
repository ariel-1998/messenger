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
      console.log(updatedGroup);
      if (chatToUpdateIndex === -1) {
        state.chats.unshift(updatedGroup);
      } else {
        state.chats[chatToUpdateIndex] = { ...updatedGroup };
      }
      if (state.selectedChat?._id !== updatedGroup._id) return state;
      state.selectedChat = { ...updatedGroup };
      return state;

      // state.chats =
      //   state.chats?.filter((chat) => chat._id !== updatedGroup._id) || [];
      // state.chats.unshift(updatedGroup);
      // state.selectedChat = { ...updatedGroup };
      // return state;
    },
    deleteGroup(state, action: PayloadAction<string>) {
      const groupId = action.payload;
      if (!state.chats) return;
      const chatToUpdateIndex = state.chats?.findIndex(
        (chat) => chat._id === groupId
      );
      if (chatToUpdateIndex === -1) return;
      state.chats[chatToUpdateIndex];
      state.chats.splice(chatToUpdateIndex, 1);
      // state.chats = state.chats?.filter((chat) => chat._id !== groupId) || [];
      if (state.selectedChat?._id === groupId) state.selectedChat = null;
      return state;
    },
    // setChatLatestMessage(state, action: PayloadAction<MessageModel>) {
    //   const message = action.payload;
    //   const chatId = message.chat._id;
    //   if (!state.chats) state.chats = [];
    //   let chatToUpdate: ChatModel = {} as ChatModel;
    //   if (state.chats.length) {
    //     const chatToUpdateIndex = state.chats.findIndex(
    //       (chat) => chat._id === chatId
    //     );
    //     if (chatToUpdateIndex !== -1) {
    //       chatToUpdate = state.chats[chatToUpdateIndex];
    //       state.chats.splice(chatToUpdateIndex, 1);
    //     }
    //   } else {
    //     chatToUpdate = { ...message.chat };
    //   }
    //   chatToUpdate.latestMessage = message;
    //   state.chats.unshift(chatToUpdate);
    //   return state;
    // },
  },
});

export const {
  getAllChats,
  setSelectedChat,
  createGroup,
  updateGroup,
  deleteGroup,
  // setChatLatestMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
