import type { Word } from "@/types/word";

// 악센트·구두점을 떼어내 화면 키보드(a-z, space)로 입력할 수 있는 형태로 맞춘다
export const normalizeAnswer = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.,!?;:'"()[\]{}~`/\\|@#$%^&*_+=-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const getDefinitions = (w: Word) =>
  (w.meanings || []).map((m) => (m?.definition ?? "").trim()).filter(Boolean);

// 뜻이 있고, 화면 키보드만으로 칠 수 있는 단어만 출제한다 (칠 수 없는 단어는 무조건 놓치게 됨)
export const isShootingPlayable = (w: Word) =>
  /^[a-z]+( [a-z]+)*$/.test(normalizeAnswer(w.text ?? "")) &&
  getDefinitions(w).length > 0;

export const MAX_LIVES = 3;
const BASE_HIT_POINTS = 5;
const MAX_MULTIPLIER = 4;
const COMBO_STEP = 5;

/** 연속으로 맞힌 횟수(이번 명중 포함)에 따른 점수 배율: 1~4는 x1, 5~9는 x2, 10~14는 x3, 15 이상은 x4 */
export const comboMultiplier = (combo: number) =>
  Math.min(1 + Math.floor(Math.max(combo, 0) / COMBO_STEP), MAX_MULTIPLIER);

export const hitPoints = (combo: number) => BASE_HIT_POINTS * comboMultiplier(combo);

export const waveClearBonus = (wave: number) => BASE_HIT_POINTS * wave;

/** 웨이브가 오를수록 단어가 많아지고, 더 자주·더 빨리 떨어진다 */
export function waveConfig(wave: number) {
  const level = Math.max(wave, 1) - 1;
  return {
    size: Math.min(5 + level, 12), // 이번 웨이브에 나오는 단어 수
    spawnInterval: Math.max(1, 3 - level * 0.25), // 초
    maxOnScreen: Math.min(3 + level, 7),
    speedFactor: Math.min(1 + level * 0.12, 2.4),
  };
}
