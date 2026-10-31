import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { authFetch, ensureOk } from "@/lib/api";
import { syncNow } from "@/lib/sync";
import {
  clearLibrary,
  setLoggedIn,
  unlinkFromAccount,
  useLibrary,
} from "@/store/library";
import { AuthResponse } from "@/types/user";
import { deleteToken, getAccessToken } from "@/utils/token";
import { deleteUser } from "@/utils/user";

export type AccountSwitchChoice = "merge" | "replace";

/** 이 기기가 마지막으로 동기화한 계정과 다른 계정으로 로그인했는지 */
export function isDifferentAccount(auth: AuthResponse) {
  const previous = useLibrary.getState().sync.account;
  return !!previous && previous.id !== auth.user?.id;
}

/**
 * 소셜 로그인 직후 호출한다. 서버 데이터를 받아와 기기 데이터와 병합하고 기기 데이터를 올린다.
 * 이전에 다른 계정과 동기화했던 기기라면 choice에 따라 기기 데이터를 새 계정에 합치거나 비운다.
 * (같은 계정이면 기존 연결을 그대로 이어서 동기화)
 */
export async function completeLogin(
  auth: AuthResponse,
  choice: AccountSwitchChoice = "merge"
) {
  if (isDifferentAccount(auth)) {
    if (choice === "replace") clearLibrary();
    else unlinkFromAccount();
  }
  setLoggedIn(true);
  const result = await syncNow();
  void registerPushToken();
  return result;
}

/** 로그아웃: 클라우드 동기화만 멈추고 기기 데이터는 그대로 둔다 */
export async function logout() {
  await deleteToken();
  setLoggedIn(false);
  useLibrary.setState({
    syncStatus: { state: "idle", error: null, failedItems: 0 },
  });
}

/** 회원 탈퇴: 서버 계정과 클라우드 데이터를 지우고, 기기 데이터는 로그인 없이 계속 쓸 수 있게 남긴다 */
export async function deleteAccount() {
  const token = await getAccessToken();
  if (!token) throw new Error("Please sign in again.");
  await deleteUser(token);
  await logout();
  unlinkFromAccount();
}

/** 로그인 상태이고 알림 권한이 있으면 서버에 푸시 토큰을 등록한다 (권한을 새로 묻지는 않음) */
export async function registerPushToken() {
  try {
    if (!Device.isDevice || !useLibrary.getState().loggedIn) return;
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return;
    const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    const response = await authFetch("/users/user/expo-push-token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expo_push_token: pushToken }),
    });
    await ensureOk(response);
  } catch (error) {
    console.warn("Unable to register the push token:", error);
  }
}
