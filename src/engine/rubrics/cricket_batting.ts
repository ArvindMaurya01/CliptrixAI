import { Rubric } from '../types';

export const cricketBattingRubric: Rubric = {
  key: 'cricket_batting',
  title: 'Cricket Batting Stance & Stroke Play Biomechanics',
  category: 'Sports & Athletics',
  penaltyConfig: {
    faultDeductionPerItem: 12,
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
      name: 'Stance & Base Balance',
      description: 'Feet shoulder-width apart, comfortable knee flex, and center of gravity balance.',
      weight: 0.14,
      technicalCriteria: 'Weight evenly balanced on balls of feet, head still over stance line.',
      exampleEvidence: 'Base stance width equals 1.2x shoulder width with balanced weight distribution.'
    },
    {
      name: 'Backlift & Bat Path Direction',
      description: 'Bat lift trajectory relative to second slip and down-swing path toward bowler.',
      weight: 0.15,
      technicalCriteria: 'Straight bat lift toward second slip allows straight downswing into ball line.',
      exampleEvidence: 'Batlift angled towards fine leg creating a loop in downswing arc.'
    },
    {
      name: 'Footwork & Trigger Movement',
      description: 'Initial weight transfer, step length towards ball pitch, and back-and-across motion.',
      weight: 0.18,
      technicalCriteria: 'Decisive foot movement directly toward ball pitch line without over-striding.',
      exampleEvidence: 'Front foot steps across towards off-stump leaving leg-stump exposed.'
    },
    {
      name: 'Impact Point & Contact Zone',
      description: 'Meeting ball directly under eyes with high front elbow and firm grip control.',
      weight: 0.18,
      technicalCriteria: 'Impact under eyes ensures controlled ground shots and minimizes top edges.',
      exampleEvidence: 'Contact made 20cm ahead of pad line with high leading elbow.'
    },
    {
      name: 'Head Position over Ball',
      description: 'Head remaining stationary and lead ear positioned over ball contact zone.',
      weight: 0.15,
      technicalCriteria: 'Head position directs body weight into the stroke. Tipping head causes falling over.',
      exampleEvidence: 'Head stays steady directly over contact point at moment of impact.'
    },
    {
      name: 'Wrist & Bat Face Control',
      description: 'Rotation of bat face through impact, presenting full face or controlled wrist roll.',
      weight: 0.10,
      technicalCriteria: 'Firm top wrist and relaxed bottom hand present full bat face.',
      exampleEvidence: 'Bat face opens slightly prematurely exposing outer edge.'
    },
    {
      name: 'Follow Through & Acceleration Finish',
      description: 'High elbow extension finish and body balance after stroke completion.',
      weight: 0.10,
      technicalCriteria: 'Smooth extension of arms finishing over non-dominant shoulder.',
      exampleEvidence: 'Complete high elbow finish holding pose with full balance.'
    }
  ]
};
