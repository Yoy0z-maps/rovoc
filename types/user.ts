export interface AuthResponse {
  access: string;
  refresh: string;
  is_new_user: boolean;
  user: User;
}

export interface User {
  id: number;
  social_id: string;
  provider: AuthProvider;
  nickname: string;
  profile_image: string | null;
  created_at: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export enum AuthProvider {
  APPLE = "apple",
  GOOGLE = "google",
  KAKAO = "kakao",
}
