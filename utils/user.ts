import { AuthResponse } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export async function getUser() {
  const user = await SecureStore.getItemAsync("user");
  return user;
}

export async function setUser(user: AuthResponse) {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
}

export async function removeUser() {}

export async function patchUser() {}
