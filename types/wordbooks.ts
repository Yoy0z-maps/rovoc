export type Wordbook = {
  id: string;
  user: number;
  name: string;
  description: string;
  is_important: boolean;
  created_at: string; // ISO 8601 날짜 문자열
  image: string;
  views: number;
  word_count: number;
};
