export type Voca = {
  id: string;
  name: string;
  meaning: Mean[];
  created_at: string;
  is_important: boolean;
};

type Mean = {
  part: string;
  definition: string;
  example: string;
};

export type Bookcase = {
  id: string;
  created_at: string;
  is_important: boolean;
  name: string;
};
