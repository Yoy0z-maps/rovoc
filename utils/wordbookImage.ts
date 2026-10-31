import { Directory, File, Paths } from "expo-file-system";
import { createId } from "./id";

// iOS는 앱을 업데이트하면 문서 폴더의 절대 경로가 바뀌므로, 파일 이름만 저장하고 표시할 때 경로를 만든다
const imageDirectory = () => new Directory(Paths.document, "wordbook-images");

function ensureImageDirectory() {
  const directory = imageDirectory();
  directory.create({ intermediates: true, idempotent: true });
  return directory;
}

const extensionOf = (uri: string) =>
  (/\.(\w{2,5})(?:\?|$)/.exec(uri)?.[1] ?? "jpg").toLowerCase();

export function resolveWordbookImage(fileName: string | null) {
  if (!fileName) return null;
  try {
    return new File(imageDirectory(), fileName).uri;
  } catch {
    return null;
  }
}

/** 이미지 선택기가 준 임시 파일을 앱 문서 폴더로 복사하고 파일 이름을 반환한다 */
export function saveWordbookImage(sourceUri: string) {
  const fileName = `${createId()}.${extensionOf(sourceUri)}`;
  new File(sourceUri).copy(new File(ensureImageDirectory(), fileName));
  return fileName;
}

/** 서버 이미지를 내려받아 저장한다 (서버 이미지 주소는 서명이 만료되므로 기기에 보관) */
export async function downloadWordbookImage(url: string) {
  const fileName = `${createId()}.${extensionOf(url)}`;
  await File.downloadFileAsync(url, new File(ensureImageDirectory(), fileName));
  return fileName;
}

export function deleteWordbookImage(fileName: string | null) {
  if (!fileName) return;
  try {
    const file = new File(imageDirectory(), fileName);
    if (file.exists) file.delete();
  } catch (error) {
    console.warn("Unable to delete wordbook image:", error);
  }
}

export function deleteAllWordbookImages() {
  try {
    const directory = imageDirectory();
    if (directory.exists) directory.delete();
  } catch (error) {
    console.warn("Unable to delete wordbook images:", error);
  }
}
