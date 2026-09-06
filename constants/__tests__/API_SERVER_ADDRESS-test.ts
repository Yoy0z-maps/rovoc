import { API_SERVER_ADDRESS } from "../API_SERVER_ADDRESS";

it("uses the deployed GCP API without a trailing slash", () => {
  expect(API_SERVER_ADDRESS).toBe(
    "https://rovoca-api-berzpj4rqq-uw.a.run.app"
  );
});
