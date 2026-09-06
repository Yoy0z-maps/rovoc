import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { RefreshTokenResponse } from "@/types/token";
import { AuthResponse } from "@/types/user";
import * as SecureStore from "expo-secure-store";

export const AUTH_STORAGE_KEY = "user.gcp-v1";
const LEGACY_AUTH_STORAGE_KEY = "user";

async function getStoredAuthResponse(): Promise<AuthResponse | null> {
  const storedUser = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as Partial<AuthResponse>;
    if (typeof user.access !== "string" || typeof user.refresh !== "string") {
      throw new Error("Stored authentication data is incomplete.");
    }
    return user as AuthResponse;
  } catch {
    await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
    return null;
  }
}

export async function getAccessToken() {
  const user = await getStoredAuthResponse();
  return user?.access ?? null;
}

export async function refreshToken() {
  const user = await getStoredAuthResponse();
  if (!user?.refresh) {
    throw new Error("No refresh token is available.");
  }

  const response = await fetch(`${API_SERVER_ADDRESS}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: user.refresh,
    }),
  });
  const data = (await response
    .json()
    .catch(() => null)) as Partial<RefreshTokenResponse> | null;

  if (!response.ok || !data?.access) {
    await deleteToken();
    throw new Error("Unable to refresh the session.");
  }

  const updatedUser: AuthResponse = {
    ...user,
    access: data.access,
    refresh: data.refresh ?? user.refresh,
  };
  await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  return data.access;
}

export async function deleteToken() {
  await Promise.all([
    SecureStore.deleteItemAsync(AUTH_STORAGE_KEY),
    SecureStore.deleteItemAsync(LEGACY_AUTH_STORAGE_KEY),
  ]);
}
