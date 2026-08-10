import { Rubric } from '../types';

export const athleteRubric: Rubric = {
  key: 'athlete',
  title: 'Athletic Motion & Kinematic Performance Biomechanics',
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
      name: 'Athletic Stance & Base Alignment',
      description: 'Balanced athletic posture, neutral spine alignment, and feet positioning.',
      weight: 0.15,
      technicalCriteria: 'Hips loaded, chest up, neutral lumbar curve with weight distributed on balls of feet.',
      exampleEvidence: 'Stable athletic base with 15-degree forward torso incline and hips loaded.'
    },
    {
      name: 'Kinetic Chain Energy Transfer',
      description: 'Sequential force generation from ground contact through hips, core, and limbs.',
      weight: 0.20,
      technicalCriteria: 'Smooth proximal-to-distal energy transfer without kinetic leakage at waist/knees.',
      exampleEvidence: 'Core bracing allows efficient energy transfer from foot strike up into shoulders.'
    },
    {
      name: 'Motion Mechanics & Joint Efficiency',
      description: 'Flexion/extension angles of hips, knees, and ankles during movement cycle.',
      weight: 0.18,
      technicalCriteria: 'Triple extension (ankle, knee, hip) achieves maximum propulsive force.',
      exampleEvidence: 'Full extension achieved at hip and ankle joints during push-off phase.'
    },
    {
      name: 'Dynamic Balance & Core Stability',
      description: 'Maintaining center of mass over base of support during rapid direction changes.',
      weight: 0.17,
      technicalCriteria: 'Minimal trunk sway or lateral compensation when applying directional force.',
      exampleEvidence: 'Trunk maintains upright vertical axis during sharp lateral change of direction.'
    },
    {
      name: 'Explosive Acceleration & Cadence',
      description: 'Rate of force development and ground contact time efficiency.',
      weight: 0.15,
      technicalCriteria: 'Short ground contact time coupled with high stride frequency generates high drive power.',
      exampleEvidence: 'Short ground contact time under 0.15s with rapid ground impulse drive.'
    },
    {
      name: 'Spatial Coordination & Deceleration',
      description: 'Body control during absorption of deceleration forces and landing mechanics.',
      weight: 0.15,
      technicalCriteria: 'Symmetric absorption through soft knee flexion avoiding knee valgus collapse.',
      exampleEvidence: 'Smooth multi-step deceleration with knees tracking over toes without collapse.'
    }
  ]
};
