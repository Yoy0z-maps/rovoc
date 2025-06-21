import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { RefreshTokenResponse } from "@/types/token";
import { AuthResponse } from "@/types/user";
import { setUser } from "./user";
import * as SecureStore from "expo-secure-store";

export async function getAccessToken() {
  const user: AuthResponse = JSON.parse(
    (await SecureStore.getItemAsync("user")) || "{}"
  );
  return user?.access || null;
}

export async function refreshToken() {
  const user: AuthResponse = JSON.parse(
    (await SecureStore.getItemAsync("user")) || "{}"
  );

  const response = await fetch(`${API_SERVER_ADDRESS}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: user.refresh,
    }),
  });
  const data = (await response.json()) as RefreshTokenResponse;

  if (data.access && data.refresh) {
    const updatedUser: AuthResponse = {
      ...user,
      access: data.access,
      refresh: data.refresh,
    };
    await setUser(updatedUser);
    return data.access;
  }
  return "";
}
