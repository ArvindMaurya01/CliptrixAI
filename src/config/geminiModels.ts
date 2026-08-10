/**
 * Central Configuration for Gemini Models in ClipTrix AI
 * Ensures single source of truth for GA, video-capable models across the application.
 */

export interface GeminiModelInfo {
  id: string;
  name: string;
  description: string;
  isRecommended?: boolean;
}

/**
 * GA, video-capable candidate models in order of priority.
 * All models listed here are active, supported, and video/multimodal capable.
 */
export const GEMINI_CANDIDATE_MODELS: GeminiModelInfo[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    description: 'Gemini 3.6 Flash (High-Speed Multimodal Recommended)',
    isRecommended: true,
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash (Latest)',
    description: 'Gemini Flash (Latest GA Alias)',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    description: 'Gemini 3.1 Flash Lite (Low-Latency Multimodal)',
  },
];

export const GEMINI_MODEL_IDS: string[] = GEMINI_CANDIDATE_MODELS.map(m => m.id);

/**
 * Helper to detect model deprecation / invalid model ID errors from API responses.
 */
export function isModelNotFoundError(errMessage: string): boolean {
  const msg = errMessage.toLowerCase();
  return (
    msg.includes('404') ||
    msg.includes('not_found') ||
    msg.includes('not found') ||
    msg.includes('not supported') ||
    msg.includes('invalid model') ||
    msg.includes('deprecated') ||
    msg.includes('retired') ||
    msg.includes('model is not available') ||
    msg.includes('does not exist') ||
    msg.includes('unsupported model') ||
    (msg.includes('quota') && msg.includes('limit: 0'))
  );
}

/**
 * Log deprecation guard alert if all candidate models failed due to model deprecation/unavailability.
 */
export function checkAndLogDeprecationGuard(engineName: string, modelErrors: string[]): void {
  const isAllDeprecationOrUnavailable = modelErrors.length > 0 && modelErrors.every(err => isModelNotFoundError(err));

  if (isAllDeprecationOrUnavailable) {
    console.error(
      `\n================================================================================\n` +
      `[${engineName}] CRITICAL DEPRECATION GUARD WARNING:\n` +
      `All configured Gemini models are unavailable. This usually means a model ID has been deprecated — check https://ai.google.dev/gemini-api/docs/models and update candidate models list in src/config/geminiModels.ts.\n` +
      `Encountered Errors:\n  - ${modelErrors.join('\n  - ')}\n` +
      `================================================================================\n`
    );
  }
}
