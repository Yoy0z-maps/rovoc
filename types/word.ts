export interface Meaning {
  definition: string;
  example: string;
  part: string;
}

export interface Word {
  id: string;
  text: string;
  meanings: Meaning[];
  created_at: string;
  is_important: boolean;
}
