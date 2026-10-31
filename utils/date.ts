// 기기 시간대 기준 날짜 키 (YYYY-MM-DD)
export function toDateKey(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return toDateKey(new Date(year, month - 1, day + days));
}

/** 오늘(또는 아직 오늘 학습하지 않았다면 어제)까지 이어진 연속 학습 일수 */
export function getStreak(studyDates: readonly string[], today = toDateKey()) {
  const dates = new Set(studyDates);
  let cursor = dates.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
