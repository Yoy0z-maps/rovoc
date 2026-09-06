const DEFAULT_API_SERVER_ADDRESS =
  "https://rovoca-api-berzpj4rqq-uw.a.run.app";

export const API_SERVER_ADDRESS = (
  process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_SERVER_ADDRESS
).replace(/\/+$/, "");
