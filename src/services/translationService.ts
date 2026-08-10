import { AssessmentReport } from '../types';
import { TranslationCache } from './translationCache';
import { translateReportFallback } from '../engine/fallbackTranslator';

export interface TranslationProgressCallback {
  (progressPercent: number, statusMessage: string): void;
}

export class TranslationService {
  /**
   * Translates an AssessmentReport into the target language.
   * Utilizes TranslationCache to immediately return cached results.
   */
  static async translateReport(
    report: AssessmentReport,
    targetLanguage: string,
    targetLanguageCode: string,
    onProgress?: TranslationProgressCallback
  ): Promise<AssessmentReport> {
    console.log(`[TranslationService] Received request for report ID "${report.id}" -> Target: "${targetLanguage}" (${targetLanguageCode})`);

    // If target language is English, return master report directly
    if (targetLanguageCode.toLowerCase() === 'en' || targetLanguage.toLowerCase() === 'english') {
      console.log('[TranslationService] Target language is English. Returning original report.');
      return report;
    }

    // 1. Check Cache
    const cached = TranslationCache.get(report.id, targetLanguageCode);
    if (cached) {
      console.log(`[TranslationService] Found cached report for language code "${targetLanguageCode}".`);
      if (onProgress) onProgress(100, `Loaded cached ${targetLanguage} translation.`);
      return cached;
    }

    // 2. Initiate Translation Pipeline
    if (onProgress) onProgress(20, `Connecting to Gemini AI Engine (${targetLanguage})...`);

    try {
      if (onProgress) onProgress(50, `Translating executive summary & behavioral matrix into ${targetLanguage}...`);

      console.log(`[TranslationService] Sending POST /api/translate-report...`);
      const response = await fetch('/api/translate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report,
          targetLanguage,
          targetLanguageCode,
        }),
      });

      console.log(`[TranslationService] Server response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const detailedError = errorData.error || `Server HTTP Error ${response.status}: ${response.statusText}`;
        console.warn(`[TranslationService] API non-200 response (${response.status}). Using fallback translator:`, detailedError);
        const fallback = translateReportFallback(report, targetLanguage);
        TranslationCache.set(report.id, targetLanguageCode, fallback);
        return fallback;
      }

      if (onProgress) onProgress(85, `Finalizing ${targetLanguage} terminology & coaching tone...`);

      const translatedReport: AssessmentReport = await response.json();
      console.log(`[TranslationService] Received translated report object from server:`, translatedReport.title);

      // Ensure critical non-textual fields are strictly preserved from original
      const sanitizedReport: AssessmentReport = {
        ...translatedReport,
        id: report.id,
        categoryKey: report.categoryKey,
        categoryName: report.categoryName,
        date: report.date,
        duration: report.duration,
        overallScore: report.overallScore,
        scoreBand: report.scoreBand,
        videoFileName: report.videoFileName,
        attributes: report.attributes.map((origAttr, idx) => {
          const transAttr = translatedReport.attributes?.[idx];
          return {
            ...origAttr,
            name: transAttr?.name || origAttr.name,
            observedValue: transAttr?.observedValue || origAttr.observedValue,
            expertAnalysis: transAttr?.expertAnalysis || origAttr.expertAnalysis,
            observedEvidence: transAttr?.observedEvidence || origAttr.observedEvidence,
            technicalAnalysis: transAttr?.technicalAnalysis || origAttr.technicalAnalysis,
            coachingRecommendation: transAttr?.coachingRecommendation || origAttr.coachingRecommendation,
            // Keep numerical values & statuses strictly identical
            score: origAttr.score,
            status: origAttr.status,
            confidence: origAttr.confidence,
            criticalFault: origAttr.criticalFault,
          };
        }),
        timelineEvents: (report.timelineEvents || []).map((origEvt, idx) => {
          const transEvt = translatedReport.timelineEvents?.[idx];
          return {
            ...origEvt,
            title: transEvt?.title || origEvt.title,
            description: transEvt?.description || origEvt.description,
            timestamp: origEvt.timestamp,
            type: origEvt.type,
          };
        }),
      };

      if (onProgress) onProgress(100, `Translation to ${targetLanguage} complete!`);

      // 3. Cache Result
      TranslationCache.set(report.id, targetLanguageCode, sanitizedReport);

      return sanitizedReport;
    } catch (error: any) {
      console.warn('[TranslationService] Pipeline Error. Executing fallback translation engine:', error);
      const fallback = translateReportFallback(report, targetLanguage);
      TranslationCache.set(report.id, targetLanguageCode, fallback);
      return fallback;
    }
  }
}
