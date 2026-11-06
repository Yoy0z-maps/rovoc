import type { Meaning } from "@/types/word";
import type { ReviewState } from "@/utils/srs";

/**
 * 기기에 저장되는 데이터.
 * rev는 기기에서 수정할 때마다 1씩 늘고, syncedRev는 서버에 마지막으로 올린 rev다.
 * 두 값이 다르면 아직 서버에 반영되지 않은 변경이 있다는 뜻이다.
 */
type SyncFields = {
  id: string; // 기기 id
  remoteId: string | null; // 서버 id (아직 올리지 않았으면 null)
  rev: number;
  syncedRev: number;
  deleted: boolean; // 서버에서 지워야 하는 삭제 기록
};

export type LocalWordbook = SyncFields & {
  name: string;
  description: string;
  imageFile: string | null; // 기기 문서 폴더 안의 이미지 파일 이름
  imageDirty: boolean; // 기기에서 바꾼 이미지를 아직 올리지 않음
  remoteImagePath: string | null; // 서버 이미지 경로 (서명 쿼리 제외, 변경 감지용)
  is_important: boolean;
  created_at: string;
  views: number;
};

export type LocalWord = SyncFields & {
  wordbookId: string; // 기기 단어장 id
  text: string;
  meanings: Meaning[];
  is_important: boolean;
  created_at: string;
  review: ReviewState; // 학습 기록은 기기에만 저장한다
};

export type Progress = {
  score: number;
  pendingScore: number; // 아직 서버에 반영하지 않은 점수 변화
  studyDates: string[]; // 학습한 날짜 (YYYY-MM-DD)
};

export type ReviewPromptState = {
  positiveMoments: number; // 마지막 평가 요청 이후 좋은 결과로 끝낸 게임 수
  lastPromptAt: string | null; // 마지막으로 평가를 요청했거나 직접 리뷰 페이지를 연 시각
};

export type Settings = {
  reminderEnabled: boolean;
  reminderHour: number;
  notificationPermissionAsked: boolean;
  reviewPrompt: ReviewPromptState;
};

export type AccountInfo = {
  id: number;
  nickname: string;
  profile_image: string | null;
  social_id: string;
  provider: string;
};

export type SyncInfo = {
  lastSyncedAt: string | null;
  account: AccountInfo | null; // 마지막으로 동기화한 계정 (로그아웃해도 유지)
};

export const isDirty = (entity: { rev: number; syncedRev: number }) =>
  entity.rev !== entity.syncedRev;
