import { Rubric } from '../types';

export const footballRubric: Rubric = {
  key: 'football',
  title: 'Football / Soccer Kicking & Ball Control Mechanics',
  category: 'Sports & Athletics',
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
      name: 'Approach Run & Angle',
      description: 'Controlled curved approach steps leading into plant foot setup.',
      weight: 0.15,
      technicalCriteria: '30 to 45 degree angle approach allows full hip rotation for power delivery.',
      exampleEvidence: 'Approached ball at 35-degree curved angle with accelerated final steps.'
    },
    {
      name: 'Plant Foot Position & Ground Stability',
      description: 'Distance of non-striking foot alongside ball, toe pointing toward target.',
      weight: 0.20,
      technicalCriteria: 'Plant foot 10-15cm beside ball. Plant foot too far behind causes backward lean.',
      exampleEvidence: 'Plant foot lands 25cm behind ball causing body weight to lean backward.'
    },
    {
      name: 'Striking Leg Motion & Hip Drive',
      description: 'Backswing knee flexion and explosive hip rotation into impact.',
      weight: 0.18,
      technicalCriteria: 'Deep knee bend on backswing provides mechanical whip when striking.',
      exampleEvidence: 'Knee flexed to 90 degrees during backswing before rapid forward snap.'
    },
    {
      name: 'Impact Point & Ankle Lock',
      description: 'Locked firm ankle at strike point, striking ball center with instep/laces.',
      weight: 0.18,
      technicalCriteria: 'Unlocked ankle absorbs strike force and reduces velocity and accuracy.',
      exampleEvidence: 'Ankle remains rigidly locked through sweet-spot contact on ball equator.'
    },
    {
      name: 'Body Orientation & Upper Body Lean',
      description: 'Torso positioning over ball to control shot height and direction.',
      weight: 0.15,
      technicalCriteria: 'Chest over ball keeps trajectory low; leaning back lifts trajectory over bar.',
      exampleEvidence: 'Upper chest positioned directly over ball at impact frame.'
    },
    {
      name: 'Follow Through & Landing Balance',
      description: 'Striking foot follow-through arc and landing on striking foot post-shot.',
      weight: 0.14,
      technicalCriteria: 'Striking leg follows through toward target, landing naturally on striking foot.',
      exampleEvidence: 'Follow through drives forward with natural hop landing on striking leg.'
    }
  ]
};
