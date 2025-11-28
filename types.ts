export interface CandidatePersona {
  roleTitle: string;
  seniorityLevel: string;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  yearsOfExperience: string;
  locationPreference: string;
  keywords: string[]; // For search queries
  culturalFit: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  headline: string;
  currentCompany: string;
  location: string;
  matchScore: number; // 0-100
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  linkedInUrl?: string; // Simulated URL
}

export enum AppStep {
  INPUT_JD = 'INPUT_JD',
  ANALYZING = 'ANALYZING',
  REVIEW_PERSONA = 'REVIEW_PERSONA',
  SEARCHING = 'SEARCHING', // The "AI Agent" active state
  RESULTS = 'RESULTS',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}