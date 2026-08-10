import { Rubric, GeminiParameterEvaluation, ScoringResult } from './types';
import { AssessmentReport, AttributeScore, AssessmentCategoryKey } from '../types';

export function assembleAssessmentReport(
  evaluations: GeminiParameterEvaluation[],
  scoring: ScoringResult,
  rubric: Rubric,
  options: {
    title?: string;
    categoryKey?: string;
    categoryName?: string;
    duration?: string;
    videoFileName?: string;
    customSummary?: string;
    customAiInsight?: string;
  }
): AssessmentReport {
  const dateStr = new Date().toISOString().split('T')[0];
  const reportId = `REP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Map each evaluation to an AttributeScore object
  const attributes: AttributeScore[] = evaluations.map(ev => {
    let status: 'optimal' | 'good' | 'review' | 'critical' = 'good';
    
    if (ev.criticalFault || ev.score < 50) {
      status = 'critical';
    } else if (ev.score >= 85) {
      status = 'optimal';
    } else if (ev.score >= 70) {
      status = 'good';
    } else {
      status = 'review';
    }

    const expertAnalysisCombined = ev.technicalAnalysis 
      ? `${ev.technicalAnalysis} Coaching Recommendation: ${ev.coachingRecommendation}`
      : ev.coachingRecommendation;

    return {
      name: ev.parameter,
      score: ev.score,
      status,
      observedValue: ev.observedEvidence || 'Observed during execution frame sequence.',
      expertAnalysis: expertAnalysisCombined,
      confidence: ev.confidence,
      criticalFault: ev.criticalFault,
      observedEvidence: ev.observedEvidence,
      technicalAnalysis: ev.technicalAnalysis,
      coachingRecommendation: ev.coachingRecommendation
    };
  });

  // Extract Strengths (parameters with highest scores >= 75)
  const sortedByScore = [...evaluations].sort((a, b) => b.score - a.score);
  const topStrengths = sortedByScore
    .filter(ev => ev.score >= 70 && !ev.criticalFault)
    .slice(0, 3)
    .map(ev => `${ev.parameter}: ${ev.observedEvidence}`);

  if (topStrengths.length === 0) {
    topStrengths.push(
      `Baseline engagement maintained across evaluated parameters.`,
      `Completed motion cycle without total stoppage.`
    );
  }

  // Extract Improvements (parameters with critical faults or lowest scores)
  const sortedByLowest = [...evaluations].sort((a, b) => a.score - b.score);
  const topImprovements = sortedByLowest
    .filter(ev => ev.score < 75 || ev.criticalFault)
    .slice(0, 3)
    .map(ev => `${ev.parameter} (${ev.score}/100): ${ev.coachingRecommendation}`);

  if (topImprovements.length === 0) {
    topImprovements.push(
      `Maintain consistency during high-speed competitive repetitions.`,
      `Fine-tune microscopic momentum transitions.`
    );
  }

  // Action Plan
  const actionPlan: string[] = sortedByLowest
    .slice(0, 3)
    .map((ev, idx) => `Phase ${idx + 1} (${ev.parameter}): ${ev.coachingRecommendation}`);

  // Build Timeline Events from key parameter observations
  const timelineEvents = evaluations.slice(0, 4).map((ev, idx) => {
    const timestamp = `00:${15 + idx * 30}`;
    const type: 'positive' | 'neutral' | 'improvement' = ev.criticalFault 
      ? 'improvement' 
      : ev.score >= 80 
      ? 'positive' 
      : 'neutral';

    return {
      timestamp,
      title: `${ev.parameter} Phase`,
      description: ev.observedEvidence,
      type
    };
  });

  // Executive Summary
  const faultText = scoring.faultCount > 0 
    ? `Identified ${scoring.faultCount} critical fault(s) [${scoring.criticalFaultsList.join(', ')}] deducting ${scoring.faultDeductions} points.`
    : 'No severe critical faults observed during the trial.';

  const summary = options.customSummary || 
    `Subject scored an overall calculated score of ${scoring.finalScore}/100 in ${options.categoryName || rubric.title}. ${faultText} Performance demonstrates primary strength in ${sortedByScore[0]?.parameter || 'execution'} with key development required in ${sortedByLowest[0]?.parameter || 'mechanics'}.`;

  const aiInsight = options.customAiInsight ||
    `Biomechanical telemetry confirms overall kinetic efficiency at ${scoring.finalScore}%. To unlock higher performance bands, focus immediately on fixing ${sortedByLowest[0]?.parameter || 'primary breakdown point'} using targeted isolated drill repetitions.`;

  return {
    id: reportId,
    title: options.title || `${options.categoryName || rubric.title} Assessment Report`,
    categoryKey: (options.categoryKey || rubric.key) as AssessmentCategoryKey,
    categoryName: options.categoryName || rubric.title,
    date: dateStr,
    duration: options.duration || '02:30',
    overallScore: scoring.finalScore,
    scoreBand: scoring.scoreBand,
    summary,
    attributes,
    timelineEvents,
    strengths: topStrengths,
    improvements: topImprovements,
    actionPlan,
    aiInsight,
    videoFileName: options.videoFileName || 'uploaded_video.mp4'
  };
}
