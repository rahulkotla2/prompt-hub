import { Prompt } from './types';

export const getVariables = (text: string) => {
  const regex = /{{(.*?)}}/g;
  const matches = [...text.matchAll(regex)];
  return Array.from(new Set(matches.map(m => m[1].trim())));
};

export const getLatestContent = (prompt: Pick<Prompt, 'content' | 'versions'>) => {
  if (prompt.versions && prompt.versions.length > 0) {
    // Sort versions to make sure latest version is last
    const sorted = [...prompt.versions].sort((a,b) => a.version - b.version);
    return sorted[sorted.length - 1].content;
  }
  return prompt.content;
};
