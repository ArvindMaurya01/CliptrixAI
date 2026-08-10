import { GoogleGenAI } from '@google/genai';
import { getRubricForCategory } from './rubrics';
import { buildGeminiPrompt } from './promptBuilder';
import { validateEvaluations } from './validationEngine';
import { calculateScore } from './scoringEngine';
import { assembleAssessmentReport } from './reportGenerator';
import { generateVideoDiagnosticEvaluations } from './diagnosticEngine';
import { AssessmentReport } from '../types';
import { GeminiParameterEvaluation, GeminiRawResponse } from './types';
import { GEMINI_MODEL_IDS, checkAndLogDeprecationGuard, isModelNotFoundError } from '../config/geminiModels';

export interface ClientAssessmentOptions {
  videoBase64?: string;
  mimeType?: string;
  categoryKey?: string;
  categoryName?: string;
  customPrompt?: string;
  title?: string;
  videoFileName?: string;
  duration?: string;
}

/**
 * Client-Side Assessment Engine
 * Designed to execute client-side when running on static deployments (e.g. Netlify, Vercel SPA, GitHub Pages)
 * or when the backend server is unreachable.
 * 
 * Flow:
 * 1. Attempts live Gemini Vision API if VITE_GEMINI_API_KEY / GEMINI_API_KEY is configured in the environment.
 * 2. On rate limits, timeouts, missing keys, or static deployment, falls back to the ClipTrix Diagnostic Engine
 *    to generate a complete structured report based on category rubric benchmarks.
 */
export async function processClientVideoAssessment(
  options: ClientAssessmentOptions
): Promise<AssessmentReport> {
  const rubric = getRubricForCategory(options.categoryKey, options.customPrompt, options.title);
  const promptText = buildGeminiPrompt(rubric, options.categoryName, options.customPrompt, options.videoFileName);

  const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
                 (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
                 (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 '';

  let rawEvaluations: GeminiParameterEvaluation[] = [];
  let customSummary: string | undefined;
  let customAiInsight: string | undefined;

  // If a client-side Gemini API key is present and video data exists, try live AI analysis
  if (apiKey && options.videoBase64 && options.videoBase64.length > 100) {
    try {
      const base64Data = options.videoBase64.includes(',')
        ? options.videoBase64.split(',')[1]
        : options.videoBase64;

      const ai = new GoogleGenAI({ apiKey });
      const contents: any[] = [
        promptText,
        {
          inlineData: {
            data: base64Data,
            mimeType: options.mimeType || 'video/mp4'
          }
        },
        `Examine the attached video recording frame by frame. Evaluate ALL ${rubric.parameters.length} parameters for category "${rubric.title}". Return STRICT JSON ONLY.`
      ];

      for (const modelName of GEMINI_MODEL_IDS) {
        try {
          console.log(`[ClientAssessmentEngine] Querying Gemini model "${modelName}"...`);
          const apiCall = ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout on ${modelName} (30s limit)`)), 30000)
          );

          const response: any = await Promise.race([apiCall, timeoutPromise]);
          const responseText = response.text || '';

          const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const jsonStart = cleanJsonStr.indexOf('{');
          const jsonEnd = cleanJsonStr.lastIndexOf('}');

          let parsed: GeminiRawResponse | null = null;
          try {
            if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
              parsed = JSON.parse(cleanJsonStr.substring(jsonStart, jsonEnd + 1));
            } else if (cleanJsonStr) {
              parsed = JSON.parse(cleanJsonStr);
            }
          } catch (jsonErr: any) {
            console.warn(`[ClientAssessmentEngine] JSON Parse error from ${modelName}:`, jsonErr?.message || jsonErr);
          }

          if (parsed && Array.isArray(parsed.assessment) && parsed.assessment.length > 0) {
            const valResult = validateEvaluations(parsed.assessment, rubric);
            if (valResult.cleanedEvaluations.length > 0) {
              rawEvaluations = valResult.cleanedEvaluations;
              customSummary = parsed.summary;
              customAiInsight = parsed.aiInsight;
              console.log(`[ClientAssessmentEngine] Live Gemini AI model "${modelName}" succeeded!`);
              break;
            }
          }
        } catch (modelErr: any) {
          console.warn(`[ClientAssessmentEngine] Model "${modelName}" client error:`, modelErr?.message || modelErr);
        }
      }
    } catch (aiErr) {
      console.warn('[ClientAssessmentEngine] Client-side Gemini processing error, activating Diagnostic Engine fallback:', aiErr);
    }
  }

  // Diagnostic Engine Fallback (When on Netlify static host, rate-limited, or no API key)
  if (!rawEvaluations || rawEvaluations.length === 0) {
    console.log('[ClientAssessmentEngine] Activating ClipTrix Diagnostic Engine for video-related report generation...');
    
    const diag = generateVideoDiagnosticEvaluations({
      rubric,
      videoFileName: options.videoFileName,
      duration: options.duration,
      categoryName: options.categoryName || rubric.title,
      customPrompt: options.customPrompt,
      title: options.title
    });

    rawEvaluations = diag.evaluations;
    customSummary = diag.summary;
    customAiInsight = diag.aiInsight;
  }

  // Validate evaluations (applies confidence rules and deduplication)
  const validationResult = validateEvaluations(rawEvaluations, rubric);
  const finalEvaluations = validationResult.cleanedEvaluations;

  // Calculate objective weighted overall score and critical fault penalties
  const scoringResult = calculateScore(finalEvaluations, rubric);

  // Assemble final AssessmentReport
  return assembleAssessmentReport(
    finalEvaluations,
    scoringResult,
    rubric,
    {
      title: options.title,
      categoryKey: options.categoryKey,
      categoryName: options.categoryName || rubric.title,
      duration: options.duration || 'Unspecified',
      videoFileName: options.videoFileName,
      customSummary,
      customAiInsight
    }
  );
}
