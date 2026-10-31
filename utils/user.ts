import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { authFetch, ensureOk, getApiError } from "@/lib/api";
import { AuthProvider, AuthResponse } from "@/types/user";
import * as SecureStore from "expo-secure-store";
import { AUTH_STORAGE_KEY } from "./token";

// 점수·출석·푸시 토큰·내 정보는 lib/sync.ts와 lib/session.ts에서 동기화한다

async function ensureResponseOk(response: Response) {
  if (!response.ok) {
    throw new Error(await getApiError(response));
  }
  return response;
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
