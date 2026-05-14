export type PromptVersion = {
  version: number;
  content: string;
  createdAt: string;
};

export type Prompt = {
  id: string;
  title: string;
  content: string; // The latest content
  tags: string[];
  isFavorite: boolean;
  createdAt?: string;
  versions?: PromptVersion[];
};
