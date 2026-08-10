import { Rubric } from '../types';
import { cricketBowlingRubric } from './cricket_bowling';
import { cricketBattingRubric } from './cricket_batting';
import { footballRubric } from './football';
import { athleteRubric } from './athlete';
import { presentationRubric } from './presentation';
import { interviewRubric } from './interview';
import { teacherRubric } from './teacher';
import { studentRubric } from './student';
import { leadershipRubric } from './leadership';
import { communicationRubric } from './communication';
import { personalityRubric } from './personality';

export const allRubrics: Record<string, Rubric> = {
  cricket_bowling: cricketBowlingRubric,
  cricket_batting: cricketBattingRubric,
  football: footballRubric,
  athlete: athleteRubric,
  presentation: presentationRubric,
  interview: interviewRubric,
  teacher: teacherRubric,
  student: studentRubric,
  leadership: leadershipRubric,
  communication: communicationRubric,
  personality: personalityRubric
};

/**
 * Selects the optimal assessment rubric based on categoryKey and optional text cues in customPrompt or title.
 */
export function getRubricForCategory(categoryKey?: string, customPrompt?: string, title?: string): Rubric {
  const combinedText = `${categoryKey || ''} ${customPrompt || ''} ${title || ''}`.toLowerCase();

  if (combinedText.includes('bowling') || combinedText.includes('fast bowler') || combinedText.includes('spin bowler') || combinedText.includes('cricket bowl')) {
    return cricketBowlingRubric;
  }
  if (combinedText.includes('batting') || combinedText.includes('batsman') || combinedText.includes('cricket bat')) {
    return cricketBattingRubric;
  }
  if (combinedText.includes('football') || combinedText.includes('soccer') || combinedText.includes('kick') || combinedText.includes('penalty strike')) {
    return footballRubric;
  }

  const key = (categoryKey || 'interview').toLowerCase().trim();
  if (allRubrics[key]) {
    return allRubrics[key];
  }

  return interviewRubric;
}
