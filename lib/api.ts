import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken, refreshToken } from "@/utils/token";

let refreshPromise: Promise<string> | null = null;

function resolveUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_SERVER_ADDRESS}${path.startsWith("/") ? path : `/${path}`}`;
}

function withAuthorization(init: RequestInit, token: string) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return { ...init, headers };
}

async function getRefreshedAccessToken(staleToken: string) {
  const storedToken = await getAccessToken();
  if (storedToken && storedToken !== staleToken) return storedToken;

  if (!refreshPromise) {
    refreshPromise = refreshToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Fetches a protected API resource and retries once after refreshing a 401.
 * Concurrent 401 responses share one refresh request.
 */
export async function authFetch(
  path: string,
  init: RequestInit = {},
  initialToken?: string | null
) {
  const token = initialToken ?? (await getAccessToken());
  if (!token) throw new Error("Authentication is required.");

  const url = resolveUrl(path);
  let response = await fetch(url, withAuthorization(init, token));

  if (response.status === 401) {
    const refreshedToken = await getRefreshedAccessToken(token);
    response = await fetch(url, withAuthorization(init, refreshedToken));
  }

  return response;
}

export async function getApiError(response: Response) {
  const body = (await response
    .clone()
    .json()
    .catch(() => null)) as
    | { detail?: string; error?: string; message?: string }
    | null;
  return (
    body?.detail ||
    body?.error ||
    body?.message ||
    `Request failed (${response.status}).`
  );
}

export async function ensureOk(response: Response) {
  if (!response.ok) throw new Error(await getApiError(response));
  return response;
}
