import axios from "axios";
import { apiConfig } from "./config";

export const defaultAxios = axios.create({
  baseURL: apiConfig.BASE_URL,
});

export const authenticatedAxios = axios.create({
  baseURL: apiConfig.BASE_URL,
});

export function authAxios(token: string) {
  authenticatedAxios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}
