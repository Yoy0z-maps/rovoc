import { authFetch, ensureOk } from "@/lib/api";
import { Wordbook } from "@/types/wordbooks";

export async function getOneBookcase(bookcaseId: string) {
  const response = await authFetch(`/word/wordbooks/${bookcaseId}/`);
  await ensureOk(response);
  return response.json() as Promise<Wordbook>;
}

export async function deleteBookcase(bookcaseId: string) {
  const response = await authFetch(`/word/wordbooks/${bookcaseId}/`, {
    method: "DELETE",
  });
  await ensureOk(response);
}

export async function getAllBookcases() {
  const response = await authFetch("/word/wordbooks/");
  await ensureOk(response);
  return response.json() as Promise<{ results: Wordbook[] }>;
}

export async function importantBookcase(bookcaseId: string) {
  const response = await authFetch(
    `/word/wordbooks/${bookcaseId}/important/`,
    { method: "POST" }
  );
  await ensureOk(response);
}
