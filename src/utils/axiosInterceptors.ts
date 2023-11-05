import axios from "axios";
import { store } from "./reduxStore";
import { logout } from "./authSlice";

export const defaultAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

export const authenticatedAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

export function authAxios(token: string) {
  authenticatedAxios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

authenticatedAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "You are not signed in!"
    ) {
      store.dispatch(logout());
      window.location.reload();
    }

    return Promise.reject(error);
  }
);
