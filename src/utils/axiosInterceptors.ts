import axios from "axios";

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
