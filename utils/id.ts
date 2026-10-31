// 기기에서 만든 데이터의 식별자 (서버 id와는 별개로 관리)
export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
