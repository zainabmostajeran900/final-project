import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
} from "@/libs/session-manager";
import { store } from "@/redux/store";
import {
  logout,
  updateTokens as updateTokensAction,
} from "@/redux/slices/authSlice";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 3000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (!originalRequest.sent) {
      originalRequest.sent = true;
    } else {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (originalRequest.url === "/auth/token") {
      store.dispatch(logout());
      removeTokens();
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${baseURL}/auth/token`, {
        refreshToken,
      });

      const newAccessToken = data.token.accessToken;
      const newRefreshToken = data.token.refreshToken;

      store.dispatch(
        updateTokensAction({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      );

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      store.dispatch(logout());
      removeTokens();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
