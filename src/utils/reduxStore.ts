import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import chatSlice from "./chatSlice";

export const createStore = () =>
  configureStore({
    reducer: {
      auth: authSlice,
      chat: chatSlice,
    },
  });

export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
