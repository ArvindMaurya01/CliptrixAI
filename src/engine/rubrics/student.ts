import { Rubric } from '../types';

export const studentRubric: Rubric = {
  key: 'student',
  title: 'Student Presentation & Viva Assessment',
  category: 'Academic & Education',
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
      name: 'Presentation Posture',
      description: 'Upright stance, avoiding leaning on podium or wall, open shoulders.',
      weight: 0.12,
      technicalCriteria: 'Self-supported upright stance without slouching or shifting feet nervously.',
      exampleEvidence: 'Maintained independent erect posture without leaning on podium.'
    },
    {
      name: 'Eye Contact',
      description: 'Engaging evaluators directly rather than reading off slides or cue cards.',
      weight: 0.12,
      technicalCriteria: '80% gaze directed at panel evaluators.',
      exampleEvidence: 'Looked at evaluator panel 80% of time, referencing notes only briefly.'
    },
    {
      name: 'Confidence',
      description: 'Poise, steady hands, calm breathing, and composure under questioning.',
      weight: 0.12,
      technicalCriteria: 'Controlled physical presence without nervous hand shaking.',
      exampleEvidence: 'Showed steady posture and calm hand position throughout presentation.'
    },
    {
      name: 'Facial Expressions',
      description: 'Engaged, pleasant, attentive, and responsive facial micro-movements.',
      weight: 0.10,
      technicalCriteria: 'Expressive facial engagement aligned with topic interest.',
      exampleEvidence: 'Positive facial engagement showing enthusiasm for project results.'
    },
    {
      name: 'Hand Gestures',
      description: 'Natural illustrative gestures replacing stiff or pocketed arms.',
      weight: 0.10,
      technicalCriteria: 'Hands unclasped and gesturing above belt line.',
      exampleEvidence: 'Used open hand gestures to explain chart data trends.'
    },
    {
      name: 'Response Quality',
      description: 'Direct answer structure, logical sequencing, and technical depth.',
      weight: 0.12,
      technicalCriteria: 'Addresses question directly before providing supporting methodology.',
      exampleEvidence: 'Answered question directly before detailing supporting evidence.'
    },
    {
      name: 'Speaking Clarity',
      description: 'Volume, enunciation, and clear pronunciation of academic terms.',
      weight: 0.11,
      technicalCriteria: 'Clear vocal articulation accessible across room.',
      exampleEvidence: 'Clear vocal tone with distinct pronunciation of technical terminology.'
    },
    {
      name: 'Question Handling',
      description: 'Attentive listening stance, nodding, and calm composure during Q&A.',
      weight: 0.11,
      technicalCriteria: 'Listens to full question without interrupting, nodding to signal understanding.',
      exampleEvidence: 'Nodded attentively through question before initiating response.'
    },
    {
      name: 'Professional Presentation',
      description: 'Overall academic rigor, attire, slide coordination, and composure.',
      weight: 0.10,
      technicalCriteria: 'Polished academic presentation standards.',
      exampleEvidence: 'Polished academic delivery with seamless slide coordination.'
    }
  ]
};
