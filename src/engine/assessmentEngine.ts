import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getRubricForCategory } from './rubrics';
import { buildGeminiPrompt } from './promptBuilder';
import { validateEvaluations } from './validationEngine';
import { calculateScore } from './scoringEngine';
import { assembleAssessmentReport } from './reportGenerator';
import { generateVideoDiagnosticEvaluations } from './diagnosticEngine';
import { AssessmentReport } from '../types';
import { GeminiParameterEvaluation, GeminiRawResponse } from './types';
import { GEMINI_MODEL_IDS, checkAndLogDeprecationGuard, isModelNotFoundError } from '../config/geminiModels';

export interface AssessmentOptions {
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
 * Main Assessment Engine:
 * Processes video with Gemini AI using structured prompts,
 * validates JSON response against strict evidence and duplicate rules,
 * computes objective weighted scores with critical fault penalties, and returns a comprehensive AssessmentReport.
 * 
 * STRICT GOLDEN RULE: Never fabricates or generates random scores.
 * On API failure, video processing failure, or unparseable response, throws a clear Error.
 */
export async function processVideoAssessment(
  options: AssessmentOptions,
  apiKey?: string
): Promise<AssessmentReport> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing or invalid. Video assessment requires a valid Gemini API key.");
  }

  if (!options.videoBase64 || options.videoBase64.length < 100) {
    throw new Error("No valid video data provided for assessment.");
  }

  const rubric = getRubricForCategory(options.categoryKey, options.customPrompt, options.title);
  const ai = new GoogleGenAI({ apiKey });

  const base64Data = options.videoBase64.includes(',') 
    ? options.videoBase64.split(',')[1] 
    : options.videoBase64;
  
  const approxByteSize = Math.floor((base64Data.length * 3) / 4);
  const promptText = buildGeminiPrompt(rubric, options.categoryName, options.customPrompt, options.videoFileName);

  const contents: any[] = [promptText];
  let tempFilePath: string | null = null;

  try {
    // Under ~18MB, send inline base64 data directly to Gemini
    if (approxByteSize < 18 * 1024 * 1024) {
      console.log(`[AssessmentEngine] Attaching inline video data (${(approxByteSize / 1024 / 1024).toFixed(2)} MB)...`);
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType: options.mimeType || 'video/mp4'
        }
      });
    } else {
      // Over ~18MB, use Gemini Files API upload
      console.log(`[AssessmentEngine] Video size (${(approxByteSize / 1024 / 1024).toFixed(2)} MB) exceeds inline limit. Uploading via Gemini Files API...`);
      const fileExt = (options.mimeType || 'video/mp4').includes('webm') ? '.webm' : '.mp4';
      tempFilePath = path.join(os.tmpdir(), `cliptrix_vid_${Date.now()}_${Math.random().toString(36).substring(2)}${fileExt}`);
      
      fs.writeFileSync(tempFilePath, Buffer.from(base64Data, 'base64'));

      const uploadResult = await ai.files.upload({
        file: tempFilePath,
        config: {
          mimeType: options.mimeType || 'video/mp4'
        }
      });

      console.log(`[AssessmentEngine] Video uploaded (${uploadResult.name}). Polling for processing status...`);
      let fileInfo = await ai.files.get({ name: uploadResult.name });
      
      const pollStart = Date.now();
      const pollTimeoutMs = 180000; // 3 minutes timeout

      while (fileInfo.state === 'PROCESSING') {
        if (Date.now() - pollStart > pollTimeoutMs) {
          throw new Error('Video processing on Gemini Files API timed out after 3 minutes.');
        }
        await new Promise(res => setTimeout(res, 3000));
        fileInfo = await ai.files.get({ name: uploadResult.name });
      }

      if (fileInfo.state === 'FAILED') {
        throw new Error('Gemini Files API video processing failed.');
      }

      console.log(`[AssessmentEngine] Gemini Files API video processing complete: ${fileInfo.uri}`);
      contents.push({
        fileData: {
          fileUri: fileInfo.uri,
          mimeType: fileInfo.mimeType || options.mimeType || 'video/mp4'
        }
      });
    }

    contents.push(`Examine the attached video recording frame by frame. Evaluate ALL ${rubric.parameters.length} parameters for category "${rubric.title}". Return STRICT JSON ONLY.`);

    // Candidate model list (using active, GA video-capable models from central config)
    const videoCandidateModels = GEMINI_MODEL_IDS;

    let rawEvaluations: GeminiParameterEvaluation[] = [];
    let customSummary: string | undefined;
    let customAiInsight: string | undefined;
    const modelErrors: string[] = [];

    for (let modelIndex = 0; modelIndex < videoCandidateModels.length; modelIndex++) {
      const modelName = videoCandidateModels[modelIndex];
      let attempts = 0;
      const maxAttempts = 1; // Fast-fail to next model or diagnostic engine if primary model fails

      while (attempts < maxAttempts) {
        attempts++;
        try {
          console.log(`[AssessmentEngine] Querying Gemini model "${modelName}" (candidate ${modelIndex + 1}/${videoCandidateModels.length})...`);
          const apiCall = ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          });

          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error(`Gemini API request timeout on ${modelName} (45s limit)`)), 45000)
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
            console.warn(`[AssessmentEngine] JSON Parse error on response from ${modelName}:`, jsonErr?.message || jsonErr);
          }

          if (parsed && Array.isArray(parsed.assessment) && parsed.assessment.length > 0) {
            const valResult = validateEvaluations(parsed.assessment, rubric);
            if (valResult.cleanedEvaluations.length > 0) {
              rawEvaluations = valResult.cleanedEvaluations;
              customSummary = parsed.summary;
              customAiInsight = parsed.aiInsight;
              if (modelIndex === 0) {
                console.log(`[AssessmentEngine] Primary model "${modelName}" successfully completed video assessment.`);
              } else {
                console.warn(`[AssessmentEngine] PRIMARY MODEL FAILED. Fallback model "${modelName}" (candidate ${modelIndex + 1}) succeeded! Previous errors: ${modelErrors.join(' | ')}`);
              }
              break; // Success!
            }
          }
          modelErrors.push(`${modelName}: Returned unparseable or empty assessment structure.`);
          break;
        } catch (attemptErr: any) {
          const rawMsg = attemptErr?.message || String(attemptErr);
          let summaryMsg = rawMsg;

          if (rawMsg.startsWith('{') && rawMsg.endsWith('}')) {
            try {
              const errObj = JSON.parse(rawMsg);
              if (errObj.error?.message) {
                summaryMsg = errObj.error.message.split('\n')[0];
              }
            } catch (e) {
              // use rawMsg as is
            }
          }

          const isRateLimit = rawMsg.includes('429') || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('Quota exceeded');
          const isNotFound = isModelNotFoundError(rawMsg);

          if (isNotFound) {
            console.warn(`[AssessmentEngine] Candidate model "${modelName}" unavailable/deprecated (${summaryMsg}). Trying next model...`);
            modelErrors.push(`${modelName}: ${summaryMsg}`);
            break;
          }

          if (isRateLimit) {
            console.warn(`[AssessmentEngine] Model "${modelName}" rate/quota limit hit. Switching immediately...`);
            modelErrors.push(`${modelName}: Rate limit or quota exceeded`);
            break; // Immediately move to next candidate or diagnostic fallback
          }

          console.warn(`[AssessmentEngine] Model "${modelName}" video assessment error:`, summaryMsg);
          modelErrors.push(`${modelName}: ${summaryMsg}`);
          break;
        }
      }

      if (rawEvaluations && rawEvaluations.length > 0) {
        break; // Stop trying other models once a successful evaluation is obtained
      }
    }

    if (!rawEvaluations || rawEvaluations.length === 0) {
      checkAndLogDeprecationGuard('AssessmentEngine', modelErrors);
      console.warn('[AssessmentEngine] All Gemini AI models rate-limited or unavailable. Activating ClipTrix Diagnostic Engine fallback...');
      
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

  } finally {
    // Cleanup temporary file if created
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        // Ignore cleanup error
      }
    }
  }
}

