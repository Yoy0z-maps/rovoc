/** 서버가 오류 상태 코드로 응답한 경우 (네트워크 오류는 TypeError로 따로 구분된다) */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
    // Error를 상속한 클래스가 트랜스파일 환경에서도 instanceof로 구분되도록 보장
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** 오프라인이거나 서버가 일시적으로 응답하지 못한 경우 */
export function isTemporaryFailure(error: unknown) {
  return (
    error instanceof TypeError ||
    (error instanceof ApiError && error.status >= 500)
  );
}
