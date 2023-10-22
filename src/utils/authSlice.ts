import jwtDecode from "jwt-decode";
import { UserModel } from "../models/UserModel";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { authAxios } from "./axiosInterceptors";

type UserToken = Omit<UserModel, "confirmPassword" | "password">;

let initialState: UserToken | null = null;
const token = window.localStorage.getItem("token");

if (token) {
  authAxios(token);
  const user = jwtDecode<UserToken>(token);
  initialState = user;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      const token = action.payload;
      const user = jwtDecode<UserToken>(token);
      window.localStorage.setItem("token", token);
      state = user;
      authAxios(token);
      return state;
    },
    logout(state) {
      state = null;
      window.localStorage.removeItem("token");
      return state;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
