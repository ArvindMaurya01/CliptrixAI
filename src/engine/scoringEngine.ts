import { Rubric, GeminiParameterEvaluation, ScoringResult } from './types';

/**
 * Objective Backend Scoring Engine:
 * Calculates overall score from weighted parameter scores, applies configurable critical fault deductions,
 * and enforces score caps on severe technical breakdowns.
 */
export function calculateScore(
  evaluations: GeminiParameterEvaluation[],
  rubric: Rubric
): ScoringResult {
  if (!evaluations || evaluations.length === 0) {
    return {
      weightedBaseScore: 50,
      faultDeductions: 0,
      faultCount: 0,
      finalScore: 50,
      scoreBand: 'warn',
      criticalFaultsList: []
    };
  }

  // Map rubric parameter weights for fast lookup
  const weightMap: Record<string, number> = {};
  let totalConfiguredWeight = 0;

  rubric.parameters.forEach(p => {
    weightMap[p.name.toLowerCase()] = p.weight;
    totalConfiguredWeight += p.weight;
  });

  if (totalConfiguredWeight <= 0) totalConfiguredWeight = 1.0;

  let weightedScoreSum = 0;
  let evaluatedWeightSum = 0;
  const criticalFaultsList: string[] = [];

  evaluations.forEach(ev => {
    const pName = (ev.parameter || '').toLowerCase().trim();
    // Match weight or use equal share
    const weight = weightMap[pName] || (1 / evaluations.length);
    
    // Ensure score is valid number between 0 and 100
    const score = Math.min(100, Math.max(0, Number(ev.score) || 0));
    
    weightedScoreSum += score * weight;
    evaluatedWeightSum += weight;

    if (ev.criticalFault) {
      criticalFaultsList.push(ev.parameter);
    }
  });

  // Calculate base weighted average (0 - 100)
  const weightedBaseScore = evaluatedWeightSum > 0 
    ? Math.round(weightedScoreSum / evaluatedWeightSum) 
    : 50;

  // Apply critical fault deductions
  const penaltyPerFault = rubric.penaltyConfig.faultDeductionPerItem || 10;
  const faultCount = criticalFaultsList.length;
  const faultDeductions = faultCount * penaltyPerFault;

  let finalScore = weightedBaseScore - faultDeductions;

  // Enforce score cap if critical faults exceed threshold (e.g., >= 3 critical faults caps final score at 30)
  const maxFaultsBeforeCap = rubric.penaltyConfig.maxFaultsBeforeCap || 3;
  const maxScoreCap = rubric.penaltyConfig.maxScoreCap || 30;

  if (faultCount >= maxFaultsBeforeCap) {
    finalScore = Math.min(finalScore, maxScoreCap);
  }

  // Ensure finalScore remains bounded between 0 and 100
  finalScore = Math.min(100, Math.max(0, Math.round(finalScore)));

  // Determine score band
  let scoreBand: 'good' | 'warn' | 'bad' = 'good';
  if (finalScore < 60) {
    scoreBand = 'bad';
  } else if (finalScore < 75) {
    scoreBand = 'warn';
  }

  return {
    weightedBaseScore,
    faultDeductions,
    faultCount,
    finalScore,
    scoreBand,
    criticalFaultsList
  };
}
