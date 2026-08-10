import { Rubric } from '../types';

export const leadershipRubric: Rubric = {
  key: 'leadership',
  title: 'Executive Leadership & Strategic Gravitas Assessment',
  category: 'Executive Leadership',
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
      name: 'Executive Presence',
      description: 'Commanding physical stature, calm authority, and room-anchoring posture.',
      weight: 0.14,
      technicalCriteria: 'Grounded physical anchoring, relaxed broad shoulders, and high vertical stance.',
      exampleEvidence: 'Commanding posture anchoring room center with broad shoulder baseline.'
    },
    {
      name: 'Leadership Posture',
      description: 'Open posture, chest expansion, and head stability.',
      weight: 0.12,
      technicalCriteria: 'Undefensive open stance with head aligned vertically over shoulders.',
      exampleEvidence: 'Erect spinal alignment with shoulders set back in power stance.'
    },
    {
      name: 'Authority',
      description: 'Decisive body language, firm gestures, and grounded physical weight.',
      weight: 0.12,
      technicalCriteria: 'Deliberate movements without fidgeting or rushed gestures.',
      exampleEvidence: 'Decisive downward palm gesture establishing strong boundary.'
    },
    {
      name: 'Calmness',
      description: 'Low blink rate, still torso, controlled diaphragmatic breathing under pressure.',
      weight: 0.12,
      technicalCriteria: 'Minimal involuntary movement, steady breathing cadence.',
      exampleEvidence: 'Low blink frequency and quiet physical composure.'
    },
    {
      name: 'Eye Contact',
      description: 'Unflinching direct gaze communicating conviction and transparency.',
      weight: 0.10,
      technicalCriteria: 'Holds eye contact through challenging key statements.',
      exampleEvidence: 'Direct, unwavering lens gaze during strategic vision delivery.'
    },
    {
      name: 'Voice Authority',
      description: 'Deep chest resonance, steady pace, and authoritative downward inflections.',
      weight: 0.10,
      technicalCriteria: 'Downward vocal inflection at sentence closure indicating certainty.',
      exampleEvidence: 'Resonant vocal projection ending with firm downward tone.'
    },
    {
      name: 'Hand Gestures',
      description: 'Steeple hand gestures, open palm framing, and broad spatial usage.',
      weight: 0.10,
      technicalCriteria: 'Uses steeple or broad framing gestures above table level.',
      exampleEvidence: 'Formed executive hand steeple to anchor strategic decision.'
    },
    {
      name: 'Decision-Making Presence',
      description: 'Clarity in non-verbal delivery, lack of trailing off, and firm pauses.',
      weight: 0.10,
      technicalCriteria: 'Employs 1-2 second silent pauses after declaring strategic goals.',
      exampleEvidence: 'Delivered strategic choice followed by deliberate silent pause.'
    },
    {
      name: 'Confidence',
      description: 'Unshakable self-possession, open expressions, and poised stillness.',
      weight: 0.10,
      technicalCriteria: 'Absence of defensive posturing or rapid self-corrections.',
      exampleEvidence: 'Unshakable physical composure through full executive address.'
    }
  ]
};
