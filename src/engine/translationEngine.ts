import { GoogleGenAI } from '@google/genai';
import { AssessmentReport } from '../types';
import { translateReportFallback } from './fallbackTranslator';
import { GEMINI_MODEL_IDS, checkAndLogDeprecationGuard, isModelNotFoundError } from '../config/geminiModels';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function processReportTranslation(
  report: AssessmentReport,
  targetLanguage: string,
  apiKey?: string
): Promise<AssessmentReport> {
  try {
    console.log(`[TranslationEngine] Starting report translation for ID "${report.id}" into "${targetLanguage}"`);

    if (!apiKey) {
      console.warn('[TranslationEngine] Warning: GEMINI_API_KEY is missing. Executing fallback translation engine...');
      return translateReportFallback(report, targetLanguage);
    }

  const ai = new GoogleGenAI({ apiKey });

  // Extract strictly text payload for Gemini translation
  const textPayload = {
    title: report.title,
    summary: report.summary,
    attributes: report.attributes.map(a => ({
      name: a.name,
      observedValue: a.observedValue || '',
      expertAnalysis: a.expertAnalysis || '',
      observedEvidence: a.observedEvidence || '',
      technicalAnalysis: a.technicalAnalysis || '',
      coachingRecommendation: a.coachingRecommendation || '',
    })),
    timelineEvents: (report.timelineEvents || []).map(e => ({
      title: e.title,
      description: e.description,
    })),
    strengths: report.strengths || [],
    improvements: report.improvements || [],
    actionPlan: report.actionPlan || [],
    aiInsight: report.aiInsight || '',
  };

  const prompt = `
You are a high-accuracy professional AI translator for executive, athletic, and behavioral assessment reports.
Translate all string values in the JSON object below into fluent, natural, professional ${targetLanguage}.

CRITICAL TRANSLATION DIRECTIVES:
1. Maintain exact JSON structure and object keys.
2. Translate ALL string values (title, summary, attribute names, observations, analyses, recommendations, timeline, strengths, action plan, aiInsight) into ${targetLanguage}.
3. Preserve numbers, scores, percentages, dates, times, and alphanumeric IDs inside string fields intact without alteration.
4. Maintain a professional, encouraging, high-level coaching tone.
5. Return strictly valid JSON with no markdown formatting outside JSON.

INPUT JSON:
${JSON.stringify(textPayload, null, 2)}
`;

  let responseText = '';
  let lastError: any = null;
  const translationModelErrors: string[] = [];

  // Primary models and fallbacks using active, GA models from central config
  const candidateModels = GEMINI_MODEL_IDS;

  for (let modelIndex = 0; modelIndex < candidateModels.length; modelIndex++) {
    const modelName = candidateModels[modelIndex];
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[TranslationEngine] Requesting translation from Gemini model "${modelName}" (candidate ${modelIndex + 1}/${candidateModels.length}, attempt ${attempts}/${maxAttempts})...`);
        
        const apiCall = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Gemini translation request timeout on model ${modelName} (30s limit)`)), 30000)
        );

        const response: any = await Promise.race([apiCall, timeoutPromise]);
        responseText = response.text || '';

        if (responseText) {
          if (modelIndex === 0) {
            console.log(`[TranslationEngine] Primary model "${modelName}" successfully completed translation (length: ${responseText.length} chars).`);
          } else {
            console.warn(`[TranslationEngine] PRIMARY MODEL FAILED. Fallback model "${modelName}" (candidate ${modelIndex + 1}) succeeded! Previous errors: ${translationModelErrors.join(' | ')}`);
          }
          break;
        }
      } catch (err: any) {
        lastError = err;
        const errMessage = String(err?.message || err);
        console.warn(`[TranslationEngine] Attempt ${attempts} on model ${modelName} failed:`, errMessage);

        const isRateLimit = errMessage.includes('429') || errMessage.includes('RESOURCE_EXHAUSTED') || errMessage.includes('quota');
        const isNotFound = isModelNotFoundError(errMessage);

        if (isNotFound) {
          console.warn(`[TranslationEngine] Candidate model "${modelName}" is unavailable or deprecated (${errMessage}). Skipping to next fallback model...`);
          translationModelErrors.push(`${modelName}: ${errMessage}`);
          break; // Don't retry model if unavailable or deprecated
        }

        if (isRateLimit && attempts < maxAttempts) {
          // Parse retryDelay from error message if available (e.g., "retry in 14.3s")
          const retryMatch = errMessage.match(/retry in ([0-9.]+)\s*s/i) || errMessage.match(/retryDelay":"([0-9]+)s"/i);
          let waitMs = 3000;
          if (retryMatch && retryMatch[1]) {
            const parsedSec = parseFloat(retryMatch[1]);
            if (!isNaN(parsedSec) && parsedSec > 0 && parsedSec <= 15) {
              waitMs = Math.ceil(parsedSec * 1000) + 500;
            }
          }
          console.warn(`[TranslationEngine] Rate limit hit for model ${modelName}. Waiting ${waitMs}ms before retry...`);
          await delay(waitMs);
        } else {
          translationModelErrors.push(`${modelName}: ${errMessage}`);
          break; // Move to next candidate model
        }
      }
    }

    if (responseText) break;
  }

  if (!responseText) {
    checkAndLogDeprecationGuard('TranslationEngine', translationModelErrors);
    const rawError = lastError?.message || lastError || 'Gemini translation service failed to generate a response.';
    console.warn('[TranslationEngine] All model translation attempts rate-limited or unavailable. Executing fallback translation engine. Error details:', rawError);

    return translateReportFallback(report, targetLanguage);
  }

  console.log('[TranslationEngine] Parsing JSON translation response...');
  const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
  const jsonStart = cleanJsonStr.indexOf('{');
  const jsonEnd = cleanJsonStr.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        const translatedTexts = JSON.parse(cleanJsonStr.substring(jsonStart, jsonEnd + 1));
        
        if (translatedTexts.error) {
          console.warn('[TranslationEngine] Gemini API returned error JSON. Executing fallback translation engine:', translatedTexts.error);
          return translateReportFallback(report, targetLanguage);
        }

        console.log('[TranslationEngine] JSON successfully parsed. Reassembling translated report...');

        return {
          ...report,
          title: translatedTexts.title || report.title,
          summary: translatedTexts.summary || report.summary,
          aiInsight: translatedTexts.aiInsight || report.aiInsight,
          strengths: Array.isArray(translatedTexts.strengths) ? translatedTexts.strengths : report.strengths,
          improvements: Array.isArray(translatedTexts.improvements) ? translatedTexts.improvements : report.improvements,
          actionPlan: Array.isArray(translatedTexts.actionPlan) ? translatedTexts.actionPlan : report.actionPlan,
          attributes: report.attributes.map((origAttr, idx) => {
            const transAttr = translatedTexts.attributes?.[idx];
            return {
              ...origAttr,
              name: transAttr?.name || origAttr.name,
              observedValue: transAttr?.observedValue || origAttr.observedValue,
              expertAnalysis: transAttr?.expertAnalysis || origAttr.expertAnalysis,
              observedEvidence: transAttr?.observedEvidence || origAttr.observedEvidence,
              technicalAnalysis: transAttr?.technicalAnalysis || origAttr.technicalAnalysis,
              coachingRecommendation: transAttr?.coachingRecommendation || origAttr.coachingRecommendation,
              // Retain numerical scores & statuses strictly intact
              score: origAttr.score,
              status: origAttr.status,
              confidence: origAttr.confidence,
              criticalFault: origAttr.criticalFault,
            };
          }),
          timelineEvents: (report.timelineEvents || []).map((origEvt, idx) => {
            const transEvt = translatedTexts.timelineEvents?.[idx];
            return {
              ...origEvt,
              title: transEvt?.title || origEvt.title,
              description: transEvt?.description || origEvt.description,
              timestamp: origEvt.timestamp,
              type: origEvt.type,
            };
          }),
        };
      } catch (parseErr: any) {
        console.error('[TranslationEngine] JSON Parse Error. Executing fallback translation engine:', parseErr);
        return translateReportFallback(report, targetLanguage);
      }
    } else {
      console.error('[TranslationEngine] Response missing valid JSON braces. Executing fallback translation engine:', responseText);
      return translateReportFallback(report, targetLanguage);
    }
  } catch (globalErr: any) {
    console.error('[TranslationEngine] Global translation error. Executing fallback translation engine:', globalErr);
    return translateReportFallback(report, targetLanguage);
  }
}
