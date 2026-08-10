import { Rubric } from '../types';

export const cricketBowlingRubric: Rubric = {
  key: 'cricket_bowling',
  title: 'Cricket Fast & Spin Bowling Biomechanics',
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
      name: 'Run-up & Momentum Build',
      description: 'Smooth accelerated rhythm into crease, posture angle, and stride length consistency.',
      weight: 0.12,
      technicalCriteria: 'Look for progressive acceleration, steady head position, and linear stride alignment without stuttering steps before gather.',
      exampleEvidence: 'Stuttering stride noted 3 steps prior to crease boundary causing velocity drop.'
    },
    {
      name: 'Back Foot Landing & Stance Alignment',
      description: 'Angle of back foot contact, heel plant stability, and weight distribution at crease entry.',
      weight: 0.14,
      technicalCriteria: 'Check if back foot lands parallel to crease (side-on) or pointed at batsman (front-on/semi-open) without collapsing at the ankle.',
      exampleEvidence: 'Back foot lands at 90-degree angle with firm ankle brace supporting weight transfer.'
    },
    {
      name: 'Front Foot Alignment & Plant',
      description: 'Front foot direction at landing, stride length relative to height, and knee brace stability.',
      weight: 0.18,
      technicalCriteria: 'Verify front toe points toward target. Stepping across the body restricts hip rotation and increases lumbar strain.',
      exampleEvidence: 'Front foot lands 12cm across the body line restricting hip rotation.'
    },
    {
      name: 'Arm Path & High Elbow Alignment',
      description: 'Bowler arm angle during gather and delivery swing, checking for legal delivery arc.',
      weight: 0.18,
      technicalCriteria: 'Assess elbow extension arc. Ensure non-bowling arm pulls down strongly to accelerate bowling shoulder.',
      exampleEvidence: 'Bowling arm reaches full vertical extension at 180 degrees with high non-bowling arm pull.'
    },
    {
      name: 'Release Point & Wrist Position',
      description: 'Wrist cock behind seam, release height, and finger snap at point of ball departure.',
      weight: 0.14,
      technicalCriteria: 'Behind-seam wrist alignment produces seam presentation. Early release causes short length; late release results in full toss.',
      exampleEvidence: 'Wrist locked directly behind seam at top of release arc.'
    },
    {
      name: 'Head Stability & Focal Line',
      description: 'Head orientation and gaze fixed on batsman/target without lateral tipping during delivery.',
      weight: 0.12,
      technicalCriteria: 'Head weighs 5kg; tipping sideways at release disrupts shoulder plane and accuracy.',
      exampleEvidence: 'Head drops 15 degrees to the off-side during final delivery stride.'
    },
    {
      name: 'Follow Through & Lateral Deceleration',
      description: 'Unimpeded deceleration path after ball release, driving through crease target line.',
      weight: 0.12,
      technicalCriteria: 'Follow through must continue 3-4 steps towards batsman without abrupt stopping or dangerous pitch running.',
      exampleEvidence: 'Complete follow-through over 4 forward strides decelerating smoothly.'
    }
  ]
};
