import { Rubric } from '../types';

export const interviewRubric: Rubric = {
  key: 'interview',
  title: 'Professional Interview & Executive Assessment',
  category: 'Business & Career',
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
      name: 'Professional Appearance',
      description: 'Attire, grooming, framing, and clean presentation environment.',
      weight: 0.10,
      technicalCriteria: 'Well-framed upper torso, clean attire, and uncluttered background.',
      exampleEvidence: 'Professional attire with well-centered upper torso camera framing.'
    },
    {
      name: 'Sitting/Standing Posture',
      description: 'Upright spinal posture, open shoulders, and leaning slightly forward.',
      weight: 0.10,
      technicalCriteria: 'Slight 5-degree forward incline demonstrates active listening without slouching.',
      exampleEvidence: 'Maintained erect seating posture with subtle forward incline.'
    },
    {
      name: 'Eye Contact',
      description: 'Direct lens gaze maintaining connection without erratic eye darting.',
      weight: 0.12,
      technicalCriteria: '70-80% eye contact with camera lens during response delivery.',
      exampleEvidence: 'Held steady gaze directly at lens for 85% of response duration.'
    },
    {
      name: 'Facial Expressions',
      description: 'Micro-expressions, nodding, and warm receptive facial tone.',
      weight: 0.10,
      technicalCriteria: 'Receptive micro-smiles and subtle agreement nods during questions.',
      exampleEvidence: 'Engaged smile and nodding during question transition.'
    },
    {
      name: 'Hand Gestures',
      description: 'Controlled supportive gestures without defensive crossing or fidgeting.',
      weight: 0.10,
      technicalCriteria: 'Hands visible in camera frame articulating key points calmly.',
      exampleEvidence: 'Hands articulated in lower chest zone to emphasize structured points.'
    },
    {
      name: 'Voice Clarity',
      description: 'Enunciation, diction, and crisp pronunciation of technical terms.',
      weight: 0.10,
      technicalCriteria: 'Crisp consonant enunciation without slurring or filler words.',
      exampleEvidence: 'Clear vocal articulation without filler words.'
    },
    {
      name: 'Speaking Pace',
      description: 'Measured 130-150 words per minute cadence with tactical pauses.',
      weight: 0.10,
      technicalCriteria: 'Balanced pace allowing structured thought expression without rushing.',
      exampleEvidence: 'Measured delivery pace at ~140 wpm with natural breathing pauses.'
    },
    {
      name: 'Confidence Level',
      description: 'Composed posture, decisive tone, and calm physical stillness.',
      weight: 0.10,
      technicalCriteria: 'Absence of self-soothing behaviors like neck touching or chair rocking.',
      exampleEvidence: 'Calm torso stability without fidgeting or swivel movements.'
    },
    {
      name: 'Nervous Movements',
      description: 'Absence of leg shaking, hair touching, face touching, or lip biting.',
      weight: 0.08,
      technicalCriteria: 'Minimal involuntary motor ticks or nervous fidgeting.',
      exampleEvidence: 'Zero hair or face touching observed during 2-minute response.'
    },
    {
      name: 'Professional Communication',
      description: 'STAR methodology structure, concise narrative, and executive brevity.',
      weight: 0.10,
      technicalCriteria: 'Structured response delivery with clear opening context, action, and result.',
      exampleEvidence: 'Structured response logically with clear situation, action, and outcome.'
    }
  ]
};
