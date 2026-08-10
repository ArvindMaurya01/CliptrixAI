export interface ParameterConfig {
  name: string;
  description: string;
  weight: number; // e.g. 0.15 (summing to 1.0)
  defaultFaultPenalty?: number;
  exampleEvidence?: string;
  technicalCriteria?: string;
}

export interface PenaltyConfig {
  faultDeductionPerItem: number; // e.g. 10 points deducted per critical fault
  maxFaultsBeforeCap: number; // e.g. 3 critical faults
  maxScoreCap: number; // e.g. 30 score cap
}

export interface Rubric {
  key: string;
  title: string;
  category: string;
  parameters: ParameterConfig[];
  penaltyConfig: PenaltyConfig;
  scoreBands: {
    optimalMin: number; // >= 85
    goodMin: number;    // >= 70
    reviewMin: number;  // >= 50
  };
}

export interface GeminiParameterEvaluation {
  parameter: string;
  score: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  criticalFault: boolean;
  observedEvidence: string;
  technicalAnalysis: string;
  coachingRecommendation: string;
}

export interface GeminiRawResponse {
  assessment: GeminiParameterEvaluation[];
  summary?: string;
  aiInsight?: string;
}

export interface ScoringResult {
  weightedBaseScore: number;
  faultDeductions: number;
  faultCount: number;
  finalScore: number;
  scoreBand: 'good' | 'warn' | 'bad';
  criticalFaultsList: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  duplicatePairs: string[];
  cleanedEvaluations: GeminiParameterEvaluation[];
}
