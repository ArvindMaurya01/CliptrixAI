import { Rubric } from '../types';

export const presentationRubric: Rubric = {
  key: 'presentation',
  title: 'Executive Presentation & Public Speaking Analysis',
  category: 'Business & Executive',
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
      name: 'Presentation Opening & Hook',
      description: 'Immediate visual engagement, opening posture, and audience hook delivery.',
      weight: 0.12,
      technicalCriteria: 'Establishes commanding presence within first 15 seconds with erect posture and direct eye contact.',
      exampleEvidence: 'Opened with strong upright stance and immediate focal connection with audience.'
    },
    {
      name: 'Presenter Posture & Physical Alignment',
      description: 'Shoulder open alignment, spinal erectness, and avoidance of slouching.',
      weight: 0.12,
      technicalCriteria: 'Open chest, relaxed shoulders, feet grounded shoulder-width apart without swaying.',
      exampleEvidence: 'Maintained open posture with weight balanced across both feet.'
    },
    {
      name: 'Stage Movement & Purposeful Pacing',
      description: 'Controlled movement across presentation space without aimless pacing.',
      weight: 0.10,
      technicalCriteria: 'Moves purposefully to mark key transition points; pauses still during key message points.',
      exampleEvidence: 'Paced 3 steps to stage left during key topic transition and anchored stance.'
    },
    {
      name: 'Hand Gestures & Visual Illustration',
      description: 'Open hand gestures above waist level reinforcing key quantitative points.',
      weight: 0.12,
      technicalCriteria: 'Gestures held above waistline in "power zone" without fidgeting or pocketing hands.',
      exampleEvidence: 'Used open palms above waist to emphasize three key strategic pillars.'
    },
    {
      name: 'Eye Contact & Audience Focal Coverage',
      description: 'Systematic visual scanning across left, center, and right audience zones.',
      weight: 0.12,
      technicalCriteria: 'Holds gaze 3-5 seconds per sector rather than rapid scanning or reading notes.',
      exampleEvidence: 'Maintained direct eye contact across all camera/audience field zones.'
    },
    {
      name: 'Voice Modulation & Dynamic Vocal Range',
      description: 'Pitch variation, vocal resonance, and cadence modulation for emphasis.',
      weight: 0.12,
      technicalCriteria: 'Varies pitch and tempo to highlight key metrics, avoiding monotone delivery.',
      exampleEvidence: 'Modulated pitch downward at sentence endings to project authority.'
    },
    {
      name: 'Slide Synchronization & Body Orientation',
      description: 'Glancing at visuals without turning back completely away from audience.',
      weight: 0.10,
      technicalCriteria: 'Glances at slide screen briefly then turns torso back 45 degrees to audience.',
      exampleEvidence: 'Maintained 80% forward torso alignment while referencing visual slide cues.'
    },
    {
      name: 'Audience Engagement & Retaphor Delivery',
      description: 'Interactive pauses, rhetorical questions, and energetic delivery.',
      weight: 0.10,
      technicalCriteria: 'Uses tactical pauses after key questions to allow audience processing.',
      exampleEvidence: 'Paused 2 seconds after strategic question to build expectation.'
    },
    {
      name: 'Presentation Confidence & Closure Stance',
      description: 'Composed closing statement, decisive final eye contact, and poise.',
      weight: 0.10,
      technicalCriteria: 'Ends with clear summary stance without trailing off or rushing closure.',
      exampleEvidence: 'Concluded presentation with upright posture and steady gaze.'
    }
  ]
};
