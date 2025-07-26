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
