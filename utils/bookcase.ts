import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken } from "./token";

export async function getOneBookcase(bookcaseId: string) {
  const token = await getAccessToken();
  const response = await fetch(
    `${API_SERVER_ADDRESS}/word/wordbooks/${bookcaseId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function deleteBookcase(bookcaseId: string) {
  const token = await getAccessToken();
  const response = await fetch(
    `${API_SERVER_ADDRESS}/word/wordbooks/${bookcaseId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
}

export async function getAllBookcases() {
  const token = await getAccessToken();

  const response = await fetch(`${API_SERVER_ADDRESS}/word/wordbooks/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
}

export async function importantBookcase(bookcaseId: string) {
  const token = await getAccessToken();
  const response = await fetch(
    `${API_SERVER_ADDRESS}/word/wordbooks/${bookcaseId}/important/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}
