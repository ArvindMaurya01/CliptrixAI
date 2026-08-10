import { Rubric } from './types';

export function buildGeminiPrompt(rubric: Rubric, categoryName?: string, customPrompt?: string, videoFileName?: string): string {
  const parametersList = rubric.parameters.map(p => 
    `• PARAMETER: "${p.name}"\n  - Focus/Criteria: ${p.description}\n  - Biomechanical Standard: ${p.technicalCriteria || 'Assess technical execution and alignment.'}\n  - Example Evidence: "${p.exampleEvidence || 'Specific visible motion.'}"`
  ).join('\n\n');

  return `You are an elite Sports Performance Analyst, Biomechanical Auditor, and Master Performance Coach.
Your task is to conduct a rigorous, objective, evidence-based video frame assessment for category "${categoryName || rubric.title}".
Custom Focus Request / Context: "${customPrompt || 'Perform an exhaustive biomechanical and technical analysis of all parameters.'}"
Video File Name: "${videoFileName || 'video_stream.mp4'}"

CRITICAL REALTIME ANALYSIS MANDATE - ABSOLUTE OBJECTIVITY & STRICT EVALUATION:
- Inspect every video frame critically for technical defects, poor posture, slouching, improper foot/body alignment, lack of eye contact, vocal hesitation, or flawed execution.
- DENSITY & QUALITY BASED ACCURATE SCORING:
  * IF THE PERFORMANCE IS BAD / FLAWED (e.g. poor posture, slouched back, improper mechanics, hesitation, fidgeting, bad alignment, low confidence, mistakes):
    -> ASSIGN LOW SCORES (15 to 45) to affected parameters.
    -> Set "criticalFault": true on failed/flawed parameters.
    -> The overall score MUST be low (under 50).
  * IF THE PERFORMANCE IS AVERAGE / MODERATE (satisfactory execution with minor errors):
    -> ASSIGN MEDIUM SCORES (50 to 68) to parameters.
  * IF THE PERFORMANCE IS GOOD / EXCELLENT (clean posture, strong confidence, flawless mechanics, crisp alignment):
    -> ASSIGN HIGH SCORES (75 to 95) to parameters.
- NEVER give high scores (70-90) out of politeness or fluff. High scores MUST be earned by visible good performance in the video frames.
- DO NOT calculate or return an overall score. The backend scoring engine calculates the overall score mathematically based on parameter scores and critical faults.

CRITICAL INSTRUCTION - STRICT PARAMETERS:
You MUST evaluate EXACTLY the following ${rubric.parameters.length} parameters defined in the assessment rubric. Do NOT omit any parameters, change parameter names, or add external parameters:

${parametersList}

EVIDENCE & ANALYSIS RULES:
1. "observedEvidence": State ONLY what is physically visible in the video frames (e.g., "Front foot lands 15cm across body line at plant frame", "Head drops 18 degrees off-side", "Slouched back with hands fidgeting", "Eye contact lost for 8 consecutive seconds").
   - NEVER use generic fluff like "Good posture", "Stable alignment", or "Executed well".
   - Every single observation must be distinct, unique, and grounded in visible movement.
   - NEVER repeat phrases or wording across parameters.
   - If a parameter cannot be clearly seen in the video frame due to camera angle or occlusion, set "observedEvidence": "Insufficient visual evidence for accurate assessment." and set "confidence": 0.3.

2. "technicalAnalysis": Explain WHY the observed movement is technically or biomechanically correct or incorrect. Reference body joints, angles, kinetic energy transfer, or communication principles.

3. "coachingRecommendation": Provide ONE specific, practical drill or corrective cue to fix the issue or optimize mechanics. Every single recommendation MUST be unique and actionable.

4. "criticalFault": Set to true IF AND ONLY IF the subject exhibits a major technical defect, poor execution, illegal action, dangerous posture, or severe mechanics breakdown for that parameter. Otherwise set to false.

5. "confidence": A floating point number between 0.0 and 1.0 representing your visual confidence in evaluating this specific frame sequence (e.g., 0.95 for clear view, 0.4 for blurry or partially obscured).

RETURN FORMAT:
Return STRICT JSON ONLY conforming exactly to this structure (no markdown formatting, no code blocks):

{
  "assessment": [
    {
      "parameter": "<Exact parameter name from list>",
      "score": <integer 0-100>,
      "confidence": <float 0.0-1.0>,
      "criticalFault": <boolean true/false>,
      "observedEvidence": "<Specific visible evidence>",
      "technicalAnalysis": "<Biomechanical / domain technical explanation>",
      "coachingRecommendation": "<Unique practical drill or cue>"
    }
  ],
  "summary": "<2-sentence objective summary of key biomechanical findings>",
  "aiInsight": "<Deep diagnostic summary of primary kinetic/performance leverage points>"
}`;
}
