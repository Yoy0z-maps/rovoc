export interface Word {
  id: string;
  text: string;
  meanings: {
    definition: string;
    example: string;
    part: string;
  }[];
  created_at: string;
  is_learned: boolean;
  is_important: boolean;
}
