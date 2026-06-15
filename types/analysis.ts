export interface SectionScores {
  skills: number;
  experience: number;
  projects: number;
}

export interface Suggestion {
  original: string;
  rewritten: string;
  reason: string;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionScores: SectionScores;
  suggestions: Suggestion[];
}
