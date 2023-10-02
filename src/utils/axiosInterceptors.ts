import axios from "axios";
import { apiConfig } from "./config";
import { store } from "./reduxStore";

export const defaultAxios = axios.create({
  baseURL: apiConfig.BASE_URL,
});

export const authenticatedAxios = axios.create({
  baseURL: apiConfig.BASE_URL,
});

export function unAuthAxios() {
  authenticatedAxios.interceptors.request.use((config) => {
    delete config.headers.Authorization;
    return config;
  });
}

export function authAxios(token: string) {
  authenticatedAxios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}
