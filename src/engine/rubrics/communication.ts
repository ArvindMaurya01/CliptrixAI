import { Rubric } from '../types';

export const communicationRubric: Rubric = {
  key: 'communication',
  title: 'Interpersonal Communication & Empathy Assessment',
  category: 'Communication',
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
      name: 'Smile & Warmth',
      description: 'Authentic Duchenne smile involvement (eye micro-wrinkling) and approachable facial tone.',
      weight: 0.15,
      technicalCriteria: 'Authentic smile engaging zygomatic major and orbicularis oculi muscles.',
      exampleEvidence: 'Warm smile with eye engagement during greeting segment.'
    },
    {
      name: 'Eye Contact',
      description: 'Soft, attentive gaze maintaining connection without aggressive staring.',
      weight: 0.15,
      technicalCriteria: 'Warm attentive gaze creating comfortable interpersonal rapport.',
      exampleEvidence: 'Consistent soft gaze encouraging open dialogue.'
    },
    {
      name: 'Listening Behaviour',
      description: 'Head tilting, agreement nods, and stillness during partner dialogue.',
      weight: 0.15,
      technicalCriteria: 'Tilt of head (10 degrees) signals empathetic listening.',
      exampleEvidence: 'Slight head tilt and nodding indicating active listening posture.'
    },
    {
      name: 'Communication Clarity',
      description: 'Structured articulation, simple phrasing, and accessible cadence.',
      weight: 0.15,
      technicalCriteria: 'Clear phrase boundaries and accessible terminology.',
      exampleEvidence: 'Clear phrasing with natural pauses between thoughts.'
    },
    {
      name: 'Body Language Alignment',
      description: 'Open posture, torso angled toward partner, uncrossed arms.',
      weight: 0.15,
      technicalCriteria: 'Uncrossed arms and torso aligned toward listener.',
      exampleEvidence: 'Open arm posture angled directly toward camera.'
    },
    {
      name: 'Friendliness & Approachability',
      description: 'Relaxed facial micro-expressions, open palm gestures, and soft eyes.',
      weight: 0.12,
      technicalCriteria: 'Frequent open-palm gestures below shoulder level.',
      exampleEvidence: 'Open palm gestures inviting rapport.'
    },
    {
      name: 'Emotional Connection',
      description: 'Voice warmth variation, empathetic tone, and expressive facial resonance.',
      weight: 0.13,
      technicalCriteria: 'Warm vocal tone matching the emotional tenor of subject matter.',
      exampleEvidence: 'Expressive vocal warmth reflecting sincere interest.'
    }
  ]
};
