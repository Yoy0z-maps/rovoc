import { ApiError, isTemporaryFailure } from "../errors";

describe("isTemporaryFailure", () => {
  it("treats network errors and server errors as temporary", () => {
    expect(isTemporaryFailure(new TypeError("Network request failed"))).toBe(true);
    expect(isTemporaryFailure(new ApiError("Service Unavailable", 503))).toBe(true);
  });

  it("treats rejected sessions as permanent", () => {
    expect(isTemporaryFailure(new ApiError("Unauthorized", 401))).toBe(false);
    expect(isTemporaryFailure(new Error("No refresh token is available."))).toBe(false);
  });
});
