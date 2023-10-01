import axios from "axios";
import { apiConfig } from "./config";
import { store } from "./reduxStore";

export const defaultAxios = axios.create({
  baseURL: apiConfig.BASE_URL,
});

const authenticatedAxios = axios.create({
  baseURL: apiConfig.BASE_URL,
});

authenticatedAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default authenticatedAxios;
