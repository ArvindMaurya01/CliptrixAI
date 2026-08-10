import { Rubric } from '../types';

export const personalityRubric: Rubric = {
  key: 'personality',
  title: 'Media Camera Presence & Charisma Assessment',
  category: 'Media & Personal Brand',
  penaltyConfig: {
    faultDeductionPerItem: 10,
    maxFaultsBeforeCap: 3,
    maxScoreCap: 30
  },
  scoreBands: {
    optimalMin: 85,
    goodMin: 70,
    reviewMin: 50
  },
  parameters: [
    {
      name: 'Camera Presence',
      description: 'Framing, head position, eye-level lens alignment, and energy projection.',
      weight: 0.15,
      technicalCriteria: 'Subject centered in upper third grid, engaging directly with lens height.',
      exampleEvidence: 'Camera eye-level positioning with strong energy projection.'
    },
    {
      name: 'Facial Expressions',
      description: 'Dynamic micro-expressions, raised brow emphasis, and lively facial movement.',
      weight: 0.14,
      technicalCriteria: 'Animated facial expressions matching spoken message points.',
      exampleEvidence: 'Dynamic brow movement highlighting narrative climax.'
    },
    {
      name: 'Smile',
      description: 'Radiant smile timing at intro, transitions, and sign-off.',
      weight: 0.12,
      technicalCriteria: 'Punctual smile delivery reinforcing engagement.',
      exampleEvidence: 'Engaging smile at opening and closing frames.'
    },
    {
      name: 'Eye Contact with Camera',
      description: 'Unbroken connection with camera lens acting as surrogate viewer.',
      weight: 0.14,
      technicalCriteria: 'Direct lens connection simulating 1-on-1 personal dialogue.',
      exampleEvidence: 'Unbroken direct gaze into camera lens throughout video.'
    },
    {
      name: 'Body Language',
      description: 'Expressive upper body, energetic shoulder movement, and fluid stance.',
      weight: 0.12,
      technicalCriteria: 'Fluid upper body movement conveying vitality.',
      exampleEvidence: 'Fluid shoulder and torso movement conveying high vitality.'
    },
    {
      name: 'Voice Variation',
      description: 'Dynamic pitch sweeps, volume emphasis, and enthusiastic inflection.',
      weight: 0.11,
      technicalCriteria: 'Wide vocal pitch range creating high narrative interest.',
      exampleEvidence: 'Dynamic vocal pitch variation emphasizing key highlights.'
    },
    {
      name: 'Natural Communication',
      description: 'Conversational authenticity, unscripted flow, and organic transitions.',
      weight: 0.11,
      technicalCriteria: 'Unrehearsed natural flow free from stiff reading patterns.',
      exampleEvidence: 'Conversational organic delivery without robotic pauses.'
    },
    {
      name: 'Charisma & Audience Connection',
      description: 'Magnetic appeal, infectious enthusiasm, and memorable camera presence.',
      weight: 0.11,
      technicalCriteria: 'High energy density and personal warmth capturing viewer attention.',
      exampleEvidence: 'Magnetic screen presence projecting authentic charisma.'
    }
  ]
};
