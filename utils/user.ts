import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { authFetch, ensureOk, getApiError } from "@/lib/api";
import { AuthProvider, AuthResponse, User } from "@/types/user";
import * as SecureStore from "expo-secure-store";
import { AUTH_STORAGE_KEY } from "./token";

async function getErrorMessage(response: Response) {
  return getApiError(response);
}

async function ensureResponseOk(response: Response) {
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response;
}

export async function getUser() {
  return SecureStore.getItemAsync(AUTH_STORAGE_KEY);
}

export async function getUserData({ token }: { token: string }): Promise<User> {
  const response = await authFetch("/users/user/me/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }, token);
  await ensureOk(response);
  return response.json() as Promise<User>;
}

export async function setUser(user: AuthResponse) {
  await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(user));
  await SecureStore.deleteItemAsync("user");
}

export async function socialLogin(
  provider: AuthProvider,
  credential: unknown
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_SERVER_ADDRESS}/users/auth/social-login/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, result: credential }),
    }
  );
  await ensureResponseOk(response);

  const user = (await response.json()) as Partial<AuthResponse>;
  if (typeof user.access !== "string" || typeof user.refresh !== "string") {
    throw new Error("The login response is missing authentication tokens.");
  }

  await setUser(user as AuthResponse);
  return user as AuthResponse;
}

export async function deleteUser(token: string) {
  const response = await authFetch("/users/user/delete/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }, token);
  await ensureOk(response);
}

export async function updateUserActivity({ token }: { token: string }) {
  const response = await authFetch("/users/user/activity/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }, token);
  await ensureOk(response);
}

export async function updateUserScore({
  token,
  score_change,
}: {
  token: string;
  score_change: number;
}) {
  const response = await authFetch("/users/user/score/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score_change }),
  }, token);
  await ensureOk(response);
}

export async function postUserExpoPushToken({
  accessToken,
  pushToken,
}: {
  accessToken: string;
  pushToken: string;
}) {
  const response = await authFetch(
    "/users/user/expo-push-token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expo_push_token: pushToken }),
    },
    accessToken
  );
  await ensureOk(response);
}
