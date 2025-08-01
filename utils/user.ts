import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { AuthResponse } from "@/types/user";
import * as SecureStore from "expo-secure-store";

export async function getUser() {
  const user = await SecureStore.getItemAsync("user");
  return user;
}

export async function getUserData({ token }: { token: string }) {
  const response = await fetch(`${API_SERVER_ADDRESS}/users/user/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function setUser(user: AuthResponse) {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
}

export async function deleteUser(token: string) {
  const response = await fetch(`${API_SERVER_ADDRESS}/users/user/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function patchUser() {}

export async function updateUserActivity({ token }: { token: string }) {
  const response = await fetch(`${API_SERVER_ADDRESS}/users/user/activity/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateUserScore({ token, score_change }: { token: string, score_change: number }) {
  const response = await fetch(`${API_SERVER_ADDRESS}/users/user/score/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ score_change }),
  });
}

export async function postUserExpoPushToken({
  accessToken,
  pushToken,
}: {
  accessToken: string;
  pushToken: string;
}) {
  const response = await fetch(`${API_SERVER_ADDRESS}/users/user/expo-push-token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ push_token: pushToken }),
  });
}