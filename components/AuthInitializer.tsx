"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  setAuthInitialized,
} from "@/redux/slices/authSlice";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/libs/session-manager";
import axiosInstance from "@/apis/client";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const jwtDecode = (token: string): DecodedToken => {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        dispatch(logout());
        dispatch(setAuthInitialized());
        return;
      }

      const isAccessTokenValid = (): boolean => {
        try {
          const decoded = jwtDecode(accessToken!);
          const currentTime = Date.now() / 1000;
          return decoded.exp > currentTime;
        } catch {
          return false;
        }
      };

      if (accessToken && isAccessTokenValid()) {
        try {
          const decoded = jwtDecode(accessToken);
          const response = await axiosInstance.get(`/users/${decoded.id}`);
          const user = response.data.data.user;
          dispatch(
            loginSuccess({ tokens: { accessToken, refreshToken: refreshToken ?? "" }, user })
          );
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          dispatch(logout());
        }
      } else if (refreshToken) {
        try {
          const resp = await axiosInstance.post("/auth/token", {
            refreshToken,
          });
          const { accessToken: newAT, refreshToken: newRT } = resp.data.token;
          setTokens(newAT, newRT);

          const decoded = jwtDecode(newAT);
          const userResponse = await axiosInstance.get(`/users/${decoded.id}`);
          const user = userResponse.data.data.user;

          dispatch(
            loginSuccess({
              tokens: { accessToken: newAT, refreshToken: newRT },
              user,
            })
          );
        } catch (error) {
          console.error("Failed to refresh token:", error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }

      dispatch(setAuthInitialized());
    };

    initializeAuth();
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
