import { Rubric } from '../types';

export const teacherRubric: Rubric = {
  key: 'teacher',
  title: 'Pedagogical Teaching & Classroom Delivery Analysis',
  category: 'Education & Pedagogy',
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
      name: 'Teaching Posture',
      description: 'Open posture, energetic stance, and welcoming physical presence.',
      weight: 0.11,
      technicalCriteria: 'Upright and mobile stance conveying enthusiasm for the lesson material.',
      exampleEvidence: 'Welcoming open chest posture with energetic weight shifts.'
    },
    {
      name: 'Eye Contact',
      description: 'Distributing eye contact across all student quadrants in classroom or camera.',
      weight: 0.12,
      technicalCriteria: 'Sweeping gaze pattern ensuring no student sector is neglected.',
      exampleEvidence: 'Scanned systematically across left, center, and right student sections.'
    },
    {
      name: 'Hand Gestures',
      description: 'Explanatory gestures breaking down complex concepts into visual parts.',
      weight: 0.11,
      technicalCriteria: 'Illustrative gestures framing sizes, sequences, and relationships.',
      exampleEvidence: 'Used step-counting hand gestures to illustrate 3-stage chemical process.'
    },
    {
      name: 'Board/Screen Interaction',
      description: 'Writing or pointing while maintaining partial face orientation to students.',
      weight: 0.11,
      technicalCriteria: 'Uses 45-degree side posture while pointing to board, preserving line of sight.',
      exampleEvidence: 'Turned 45 degrees to board while keeping face angled to class.'
    },
    {
      name: 'Voice Clarity',
      description: 'Projection, room resonance, and articulation of key technical terms.',
      weight: 0.12,
      technicalCriteria: 'Sufficient volume and acoustic resonance reaching back row without strain.',
      exampleEvidence: 'Crisp vocal projection with clear emphasis on core terminology.'
    },
    {
      name: 'Speaking Pace',
      description: 'Modulating speed to allow note-taking and cognitive assimilation.',
      weight: 0.11,
      technicalCriteria: 'Slows down and pauses after introducing new core definitions.',
      exampleEvidence: 'Slowing cadence noticeably when dictating primary formula definition.'
    },
    {
      name: 'Student Engagement',
      description: 'Inquisitive facial expressions, open pauses, and encouraging nods.',
      weight: 0.11,
      technicalCriteria: 'Invites participation through expectant pauses and raised eyebrow cues.',
      exampleEvidence: 'Paused 3 seconds with open palm gesture encouraging class input.'
    },
    {
      name: 'Visual Explanation',
      description: 'Effective use of diagrams, spatial layout, and visual props.',
      weight: 0.11,
      technicalCriteria: 'Coordinates spoken explanation with clear physical visual pointers.',
      exampleEvidence: 'Pointed directly to diagram key while explaining data flow.'
    },
    {
      name: 'Teaching Confidence',
      description: 'Poise, seamless topic transitions, and authoritative subject mastery.',
      weight: 0.10,
      technicalCriteria: 'Smooth lesson flow without hesitation or loss of classroom control.',
      exampleEvidence: 'Seamless transition between slide deck and practical board example.'
    }
  ]
};
