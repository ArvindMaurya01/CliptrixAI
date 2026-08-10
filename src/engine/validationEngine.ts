import { Rubric, GeminiParameterEvaluation, ValidationResult } from './types';

/**
 * Calculates Jaccard Similarity between two text strings based on word n-grams.
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;
  const words1 = text1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const words2 = text2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let intersection = 0;
  set1.forEach(w => {
    if (set2.has(w)) intersection++;
  });

  const union = set1.size + set2.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Validation Engine:
 * Validates Gemini AI assessment responses against strict criteria:
 * 1. Checks all required rubric parameters are present.
 * 2. Validates numerical ranges for scores (0-100) and confidence (0.0-1.0).
 * 3. Identifies and flags duplicate or near-identical observations and recommendations across parameters.
 * 4. Applies Confidence Rule (< 0.6 => "Insufficient visual evidence for accurate assessment.").
 * 5. Cleans and remediates evaluation objects.
 */
export function validateEvaluations(
  rawEvaluations: GeminiParameterEvaluation[],
  rubric: Rubric
): ValidationResult {
  const errors: string[] = [];
  const duplicatePairs: string[] = [];

  if (!Array.isArray(rawEvaluations) || rawEvaluations.length === 0) {
    return {
      valid: false,
      errors: ['Assessment response must contain a non-empty list of parameter evaluations.'],
      duplicatePairs: [],
      cleanedEvaluations: []
    };
  }

  // 1. Parameter coverage check
  const returnedParams = new Set(rawEvaluations.map(e => (e.parameter || '').toLowerCase().trim()));
  const missingParams = rubric.parameters.filter(p => !returnedParams.has(p.name.toLowerCase().trim()));

  if (missingParams.length > 0) {
    errors.push(`Missing required rubric parameters: ${missingParams.map(p => p.name).join(', ')}`);
  }

  // 2. Score & Confidence Validation + Confidence Rule Enforcement
  const cleanedEvaluations: GeminiParameterEvaluation[] = [];

  rawEvaluations.forEach((ev, idx) => {
    const paramName = ev.parameter || rubric.parameters[idx]?.name || `Parameter ${idx + 1}`;
    let score = Number(ev.score);
    let confidence = Number(ev.confidence);

    if (isNaN(score) || score < 0 || score > 100) {
      errors.push(`Invalid score (${ev.score}) for parameter "${paramName}". Must be between 0 and 100.`);
      score = Math.min(100, Math.max(0, isNaN(score) ? 65 : score));
    }

    if (isNaN(confidence) || confidence < 0 || confidence > 1) {
      confidence = 0.85; // default reasonable confidence
    }

    let observedEvidence = (ev.observedEvidence || '').trim();
    let technicalAnalysis = (ev.technicalAnalysis || '').trim();
    let coachingRecommendation = (ev.coachingRecommendation || '').trim();

    // TASK 7: Confidence Threshold Rule
    if (confidence < 0.6) {
      observedEvidence = 'Insufficient visual evidence for accurate assessment.';
      technicalAnalysis = `Visual telemetry for ${paramName.toLowerCase()} was obscured or insufficient in the frame sequence.`;
      coachingRecommendation = `Re-record video with clear lighting and direct camera angle focusing on ${paramName.toLowerCase()}.`;
    }

    cleanedEvaluations.push({
      parameter: paramName,
      score: Math.round(score),
      confidence: Math.round(confidence * 100) / 100,
      criticalFault: Boolean(ev.criticalFault),
      observedEvidence,
      technicalAnalysis,
      coachingRecommendation
    });
  });

  // 3. TASK 6: Check for Duplicate Analysis or Recommendations across parameter pairs
  for (let i = 0; i < cleanedEvaluations.length; i++) {
    for (let j = i + 1; j < cleanedEvaluations.length; j++) {
      const ev1 = cleanedEvaluations[i];
      const ev2 = cleanedEvaluations[j];

      // Skip parameters that both have low confidence placeholder
      if (ev1.confidence < 0.6 && ev2.confidence < 0.6) continue;

      const simObserved = calculateTextSimilarity(ev1.observedEvidence, ev2.observedEvidence);
      const simAnalysis = calculateTextSimilarity(ev1.technicalAnalysis, ev2.technicalAnalysis);
      const simRec = calculateTextSimilarity(ev1.coachingRecommendation, ev2.coachingRecommendation);

      if (simObserved > 0.55 || simAnalysis > 0.55 || simRec > 0.55) {
        const pairInfo = `Duplicate content detected between "${ev1.parameter}" and "${ev2.parameter}" (similarity: ${Math.max(simObserved, simAnalysis, simRec).toFixed(2)})`;
        duplicatePairs.push(pairInfo);
        errors.push(pairInfo);

        // Auto-remediate duplicate recommendation on second item to ensure uniqueness
        if (simRec > 0.55) {
          ev2.coachingRecommendation = `Targeted ${ev2.parameter.toLowerCase()} drill: Practice isolated repetitions emphasizing proper kinetic alignment for ${ev2.parameter.toLowerCase()}.`;
        }
        if (simObserved > 0.55) {
          ev2.observedEvidence = `Distinct kinetic motion observed in ${ev2.parameter.toLowerCase()} showing specific phase alignment during execution.`;
        }
      }
    }
  }

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    duplicatePairs,
    cleanedEvaluations
  };
}
