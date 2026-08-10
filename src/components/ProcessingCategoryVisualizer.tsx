import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, GraduationCap, Award, Activity, Zap, Eye, 
  Target, Shield, Smile, MessageSquare, Video, Cpu, Sparkles, 
  Flame, Radio, Users, Presentation, Layers, Mic, Volume2
} from 'lucide-react';

export type CategoryType = 
  | 'student' 
  | 'athlete' 
  | 'interview' 
  | 'leadership' 
  | 'presentation' 
  | 'teacher' 
  | 'personality' 
  | 'communication';

interface ProcessingCategoryVisualizerProps {
  categoryKey?: string;
  categoryTitle?: string;
  fps: number;
  progress: number;
}

// Map any input category string or title to normalized CategoryType
export function getCategoryType(categoryKey?: string, categoryTitle?: string): CategoryType {
  const combined = `${categoryKey || ''} ${categoryTitle || ''}`.toLowerCase();
  
  if (combined.includes('student') || combined.includes('viva') || combined.includes('learn')) {
    return 'student';
  }
  if (combined.includes('athlete') || combined.includes('sport') || combined.includes('biomechanic') || combined.includes('coach')) {
    return 'athlete';
  }
  if (combined.includes('interview') || combined.includes('career') || combined.includes('job')) {
    return 'interview';
  }
  if (combined.includes('leadership') || combined.includes('executive') || combined.includes('management')) {
    return 'leadership';
  }
  if (combined.includes('pitch') || combined.includes('presentation') || combined.includes('public speaking')) {
    return 'presentation';
  }
  if (combined.includes('teacher') || combined.includes('educator') || combined.includes('lecturer')) {
    return 'teacher';
  }
  if (combined.includes('personality') || combined.includes('media') || combined.includes('anchor') || combined.includes('broadcasting')) {
    return 'personality';
  }
  if (combined.includes('communication') || combined.includes('interpersonal') || combined.includes('social') || combined.includes('soft skills')) {
    return 'communication';
  }
  return 'interview'; // default
}

export const CategoryOverlays: Record<CategoryType, string[]> = {
  student: [
    'Analyzing Learning Behaviour',
    'Tracking Focus',
    'Evaluating Student Engagement'
  ],
  athlete: [
    'Analyzing Athletic Motion',
    'Tracking Joint Angles',
    'Evaluating Balance',
    'Measuring Speed',
    'Processing Biomechanics'
  ],
  interview: [
    'Analyzing Communication',
    'Evaluating Confidence',
    'Tracking Eye Contact',
    'Measuring Body Language'
  ],
  leadership: [
    'Leadership Analysis',
    'Influence Detection',
    'Executive Presence'
  ],
  presentation: [
    'Presentation Skills Analysis',
    'Audience Engagement',
    'Speech Delivery'
  ],
  teacher: [
    'Teaching Effectiveness',
    'Student Engagement',
    'Communication Quality'
  ],
  personality: [
    'Media Presence',
    'Communication Analysis',
    'On-camera Confidence'
  ],
  communication: [
    'Interaction Analysis',
    'Emotion Recognition',
    'Social Communication'
  ]
};

export const CategoryMetrics: Record<CategoryType, { label: string; value: string; color: string }[]> = {
  student: [
    { label: 'FOCUS INDEX', value: '98.4%', color: 'text-[#00D9C8]' },
    { label: 'DESK POSTURE', value: 'Optimal', color: 'text-emerald-400' },
    { label: 'NOTE SYNC', value: 'Active', color: 'text-[#6E7BFF]' }
  ],
  athlete: [
    { label: 'KNEE FLEXION', value: '112°', color: 'text-[#00D9C8]' },
    { label: 'VELOCITY', value: '4.8 m/s', color: 'text-emerald-400' },
    { label: 'SYMMETRY', value: '99.1%', color: 'text-[#6E7BFF]' }
  ],
  interview: [
    { label: 'EYE CONTACT', value: '96.2%', color: 'text-[#00D9C8]' },
    { label: 'SPEAKING PACE', value: '135 wpm', color: 'text-emerald-400' },
    { label: 'COMPOSURE', value: 'High', color: 'text-[#6E7BFF]' }
  ],
  leadership: [
    { label: 'EXECUTIVE AURA', value: '97.5%', color: 'text-[#FF5FA2]' },
    { label: 'AUTHORITY', value: '+1.8', color: 'text-emerald-400' },
    { label: 'VOCAL POWER', value: '88 dB', color: 'text-[#6E7BFF]' }
  ],
  presentation: [
    { label: 'SLIDE SYNC', value: '100%', color: 'text-[#00D9C8]' },
    { label: 'STAGE COVERAGE', value: '84%', color: 'text-emerald-400' },
    { label: 'ENGAGEMENT', value: '95.8%', color: 'text-[#6E7BFF]' }
  ],
  teacher: [
    { label: 'PACING', value: '120 wpm', color: 'text-[#35E6A4]' },
    { label: 'BOARD SYNC', value: '91%', color: 'text-[#00D9C8]' },
    { label: 'CLARITY', value: '98%', color: 'text-[#6E7BFF]' }
  ],
  personality: [
    { label: 'CAMERA SYNC', value: '99.4%', color: 'text-[#FF5FA2]' },
    { label: 'CHARISMA', value: '96.8%', color: 'text-[#FFB454]' },
    { label: 'AUDIO LEVEL', value: '-12 dB', color: 'text-[#00D9C8]' }
  ],
  communication: [
    { label: 'RAPPORT', value: '98.1%', color: 'text-[#FFB454]' },
    { label: 'LISTENING', value: '94.0%', color: 'text-emerald-400' },
    { label: 'EMOTION SYNC', value: '97.2%', color: 'text-[#6E7BFF]' }
  ]
};

// ==================== 1. STUDENT VISUALIZER ====================
const StudentVisualizer: React.FC<{ progress: number }> = () => {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full max-h-[320px] drop-shadow-[0_0_15px_rgba(0,217,200,0.4)]">
      <defs>
        <linearGradient id="studentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D9C8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6E7BFF" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Desk Surface */}
      <line x1="30" y1="260" x2="250" y2="260" stroke="#00D9C8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
      <polygon points="20,290 260,290 240,260 40,260" fill="rgba(0, 217, 200, 0.05)" stroke="rgba(0, 217, 200, 0.3)" strokeWidth="1" />

      {/* Notebook on desk */}
      <rect x="110" y="262" width="60" height="22" rx="3" fill="rgba(110, 123, 255, 0.15)" stroke="#6E7BFF" strokeWidth="1.5" />
      <line x1="120" y1="268" x2="160" y2="268" stroke="#00D9C8" strokeWidth="1" />
      <line x1="120" y1="273" x2="155" y2="273" stroke="#00D9C8" strokeWidth="1" opacity="0.7" />
      <line x1="120" y1="278" x2="148" y2="278" stroke="#00D9C8" strokeWidth="1" opacity="0.5" />

      {/* Books Stack */}
      <rect x="45" y="242" width="40" height="8" rx="2" fill="rgba(255, 180, 84, 0.2)" stroke="#FFB454" strokeWidth="1.2" />
      <rect x="42" y="250" width="46" height="10" rx="2" fill="rgba(0, 217, 200, 0.2)" stroke="#00D9C8" strokeWidth="1.2" />

      {/* Animated Pen Writing Movement */}
      <motion.g
        animate={{ x: [0, 15, 0], y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="150" y1="245" x2="135" y2="265" stroke="#FF5FA2" strokeWidth="2" strokeLinecap="round" />
        <circle cx="135" cy="265" r="2" fill="#FF5FA2" className="animate-ping" />
      </motion.g>

      {/* Seated Student Skeleton */}
      {/* Head */}
      <motion.circle 
        cx="140" cy="80" r="18" 
        fill="rgba(0,217,200,0.1)" stroke="url(#studentGlow)" strokeWidth="2.5"
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Eye Tracking Vector */}
      <motion.line 
        x1="140" y1="80" x2="140" y2="260" 
        stroke="#00D9C8" strokeWidth="1" strokeDasharray="3 3"
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Focus Scanning Ring around head */}
      <motion.circle
        cx="140" cy="80" r="28"
        fill="none" stroke="#00D9C8" strokeWidth="1" strokeDasharray="4 6"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Neck & Spine */}
      <line x1="140" y1="98" x2="140" y2="120" stroke="url(#studentGlow)" strokeWidth="2.5" />
      <line x1="140" y1="120" x2="140" y2="200" stroke="url(#studentGlow)" strokeWidth="2.5" />

      {/* Shoulders */}
      <line x1="105" y1="130" x2="175" y2="130" stroke="url(#studentGlow)" strokeWidth="2.5" />

      {/* Left Arm (holding notebook) */}
      <line x1="105" y1="130" x2="90" y2="190" stroke="url(#studentGlow)" strokeWidth="2" />
      <line x1="90" y1="190" x2="115" y2="260" stroke="url(#studentGlow)" strokeWidth="2" />

      {/* Right Arm (Writing) */}
      <line x1="175" y1="130" x2="185" y2="190" stroke="url(#studentGlow)" strokeWidth="2" />
      <motion.line 
        x1="185" y1="190" x2="150" y2="245" 
        stroke="url(#studentGlow)" strokeWidth="2" 
        animate={{ x2: [148, 153, 148] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Chair Backrest */}
      <rect x="85" y="140" width="8" height="90" rx="3" fill="rgba(110,123,255,0.2)" stroke="#6E7BFF" strokeWidth="1.5" />

      {/* Joint Nodes */}
      {[{x: 140, y: 80}, {x: 140, y: 120}, {x: 105, y: 130}, {x: 175, y: 130}, {x: 90, y: 190}, {x: 185, y: 190}, {x: 115, y: 260}, {x: 150, y: 245}].map((pt, i) => (
        <g key={i}>
          <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#00D9C8" strokeWidth="1.5" />
          <circle cx={pt.x} cy={pt.y} r="8" fill="rgba(0, 217, 200, 0.2)" className="animate-pulse" />
        </g>
      ))}

      {/* Floating Education Particles */}
      <motion.g animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <text x="35" y="60" fill="#00D9C8" fontSize="14" fontFamily="monospace">🎓 FOCUS_SCAN</text>
        <text x="195" y="90" fill="#6E7BFF" fontSize="12" fontFamily="monospace">98.4%</text>
      </motion.g>
    </svg>
  );
};

// ==================== 2. ATHLETE VISUALIZER ====================
const AthleteVisualizer: React.FC<{ progress: number }> = () => {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full max-h-[320px] drop-shadow-[0_0_15px_rgba(110,123,255,0.5)]">
      <defs>
        <linearGradient id="athleteGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6E7BFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#00D9C8" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Biomechanics Perspective Floor Grid */}
      <g stroke="rgba(110, 123, 255, 0.2)" strokeWidth="1">
        <line x1="20" y1="300" x2="260" y2="300" />
        <line x1="40" y1="270" x2="240" y2="270" />
        <line x1="60" y1="240" x2="220" y2="240" />
        <line x1="20" y1="300" x2="60" y2="240" />
        <line x1="140" y1="300" x2="140" y2="240" />
        <line x1="260" y1="300" x2="220" y2="240" />
      </g>

      {/* Velocity Vector Arrows */}
      <motion.g animate={{ x: [0, 10, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
        <line x1="190" y1="120" x2="240" y2="120" stroke="#00D9C8" strokeWidth="2.5" markerEnd="url(#arrow)" />
        <text x="190" y="112" fill="#00D9C8" fontSize="10" fontFamily="monospace" fontWeight="bold">v = 4.8 m/s</text>
      </motion.g>

      {/* Running / Athletic Stance Skeleton */}
      <g>
        {/* Head */}
        <circle cx="170" cy="65" r="15" fill="rgba(110,123,255,0.15)" stroke="url(#athleteGlow)" strokeWidth="2.5" />
        
        {/* Spine */}
        <line x1="165" y1="80" x2="135" y2="150" stroke="url(#athleteGlow)" strokeWidth="3" />

        {/* Shoulders */}
        <line x1="150" y1="95" x2="180" y2="105" stroke="url(#athleteGlow)" strokeWidth="3" />

        {/* Lead Arm (Bent Forward) */}
        <line x1="180" y1="105" x2="210" y2="130" stroke="url(#athleteGlow)" strokeWidth="2.5" />
        <line x1="210" y1="130" x2="195" y2="160" stroke="url(#athleteGlow)" strokeWidth="2.5" />

        {/* Rear Arm (Bent Back) */}
        <line x1="150" y1="95" x2="120" y2="115" stroke="url(#athleteGlow)" strokeWidth="2.5" />
        <line x1="120" y1="115" x2="95" y2="135" stroke="url(#athleteGlow)" strokeWidth="2.5" />

        {/* Hips */}
        <circle cx="135" cy="150" r="6" fill="#6E7BFF" />

        {/* Lead Leg (Bent Forward in Stride) */}
        <line x1="135" y1="150" x2="175" y2="200" stroke="url(#athleteGlow)" strokeWidth="3" />
        <line x1="175" y1="200" x2="195" y2="270" stroke="url(#athleteGlow)" strokeWidth="3" />

        {/* Rear Leg (Extending Back) */}
        <line x1="135" y1="150" x2="85" y2="195" stroke="url(#athleteGlow)" strokeWidth="3" />
        <line x1="85" y1="195" x2="55" y2="255" stroke="url(#athleteGlow)" strokeWidth="3" />

        {/* Knee Joint Angle Arc (112°) */}
        <path d="M 160 180 A 20 20 0 0 1 185 215" fill="none" stroke="#FF5FA2" strokeWidth="2" strokeDasharray="3 3" />
        <text x="190" y="195" fill="#FF5FA2" fontSize="11" fontFamily="monospace" fontWeight="bold">112°</text>

        {/* Foot Pressure Ground Impact Ring */}
        <ellipse cx="195" cy="272" rx="18" ry="6" fill="rgba(0,217,200,0.2)" stroke="#00D9C8" strokeWidth="1.5" className="animate-ping" />
        <text x="170" y="292" fill="#00D9C8" fontSize="9" fontFamily="monospace">FORCE: 420N</text>

        {/* Muscle Activation Glow Points */}
        {[{x: 175, y: 200}, {x: 135, y: 150}, {x: 85, y: 195}, {x: 165, y: 65}, {x: 210, y: 130}].map((pt, idx) => (
          <g key={idx}>
            <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#00D9C8" strokeWidth="2" />
            <circle cx={pt.x} cy={pt.y} r="10" fill="rgba(110,123,255,0.3)" className="animate-pulse" />
          </g>
        ))}
      </g>
    </svg>
  );
};

// ==================== 3. INTERVIEW VISUALIZER ====================
const InterviewVisualizer: React.FC<{ progress: number }> = () => {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full max-h-[320px] drop-shadow-[0_0_15px_rgba(0,217,200,0.5)]">
      <defs>
        <linearGradient id="interviewGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D9C8" stopOpacity="1" />
          <stop offset="100%" stopColor="#6E7BFF" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Office Environment Lines */}
      <rect x="20" y="20" width="240" height="290" rx="12" fill="rgba(110,123,255,0.03)" stroke="rgba(110,123,255,0.15)" strokeWidth="1" />

      {/* Facial Landmark Keypoint Grid (Dense Mesh on Head) */}
      <g transform="translate(140, 90)">
        <circle cx="0" cy="0" r="30" fill="rgba(0,217,200,0.08)" stroke="url(#interviewGlow)" strokeWidth="2" />
        
        {/* Face Landmark Mesh Grid */}
        <path d="M -20 -10 Q 0 -25 20 -10 Q 0 35 -20 -10 Z" fill="none" stroke="#00D9C8" strokeWidth="1" opacity="0.6" />
        <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#00D9C8" strokeWidth="1" opacity="0.7" />
        <line x1="-10" y1="10" x2="10" y2="10" stroke="#00D9C8" strokeWidth="1" opacity="0.7" />
        <circle cx="-10" cy="-8" r="2.5" fill="#00D9C8" />
        <circle cx="10" cy="-8" r="2.5" fill="#00D9C8" />

        {/* Eye Contact Vector Line to Camera */}
        <motion.line 
          x1="0" y1="-8" x2="0" y2="-70" 
          stroke="#00D9C8" strokeWidth="1.5" strokeDasharray="4 4"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <text x="12" y="-50" fill="#00D9C8" fontSize="9" fontFamily="monospace">EYE_GAZE: 98.2%</text>
      </g>

      {/* Body Posture & Shoulder Axis */}
      <line x1="140" y1="120" x2="140" y2="230" stroke="url(#interviewGlow)" strokeWidth="3" />
      <line x1="90" y1="140" x2="190" y2="140" stroke="url(#interviewGlow)" strokeWidth="3" />

      {/* Shoulder Balance Horizontal Alignment Guide */}
      <line x1="70" y1="140" x2="210" y2="140" stroke="#FF5FA2" strokeWidth="1" strokeDasharray="2 2" />
      <text x="215" y="143" fill="#FF5FA2" fontSize="9" fontFamily="monospace">BALANCED</text>

      {/* Expressive Hand Gestures (Open Palms) */}
      <line x1="90" y1="140" x2="70" y2="195" stroke="url(#interviewGlow)" strokeWidth="2.5" />
      <line x1="70" y1="195" x2="100" y2="215" stroke="url(#interviewGlow)" strokeWidth="2.5" />

      <line x1="190" y1="140" x2="210" y2="195" stroke="url(#interviewGlow)" strokeWidth="2.5" />
      <motion.line 
        x1="210" y1="195" x2="180" y2="215" 
        stroke="url(#interviewGlow)" strokeWidth="2.5" 
        animate={{ x2: [175, 185, 175] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Voice Waveform Sound Bar Display */}
      <g transform="translate(60, 270)">
        <text x="0" y="-8" fill="#6E7BFF" fontSize="10" fontFamily="monospace" fontWeight="bold">VOICE SPECTRUM</text>
        {[8, 18, 28, 14, 32, 22, 12, 26, 16, 24, 30, 10].map((h, i) => (
          <motion.rect
            key={i}
            x={i * 13}
            y={35 - h}
            width="8"
            height={h}
            rx="2"
            fill="#00D9C8"
            animate={{ height: [h, Math.max(6, h * 0.4), h] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
          />
        ))}
      </g>
    </svg>
  );
};

// ==================== 4. LEADERSHIP VISUALIZER ====================
const LeadershipVisualizer: React.FC<{ progress: number }> = () => {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full max-h-[320px] drop-shadow-[0_0_20px_rgba(255,95,162,0.5)]">
      <defs>
        <linearGradient id="leadershipGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5FA2" stopOpacity="1" />
          <stop offset="100%" stopColor="#6E7BFF" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Executive Confidence Radiating Aura Rings */}
      {[50, 80, 110].map((r, i) => (
        <motion.circle
          key={i}
          cx="140"
          cy="130"
          r={r}
          fill="none"
          stroke="#FF5FA2"
          strokeWidth="1.5"
          opacity="0.3"
          animate={{ r: [r, r + 15, r], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Standing Executive Pose */}
      {/* Head */}
      <circle cx="140" cy="70" r="18" fill="rgba(255,95,162,0.15)" stroke="url(#leadershipGlow)" strokeWidth="3" />
      
      {/* Spine & Broad Stance */}
      <line x1="140" y1="88" x2="140" y2="200" stroke="url(#leadershipGlow)" strokeWidth="3.5" />
      <line x1="80" y1="110" x2="200" y2="110" stroke="url(#leadershipGlow)" strokeWidth="3.5" />

      {/* Open Authoritative Arms */}
      <line x1="80" y1="110" x2="50" y2="160" stroke="url(#leadershipGlow)" strokeWidth="3" />
      <line x1="50" y1="160" x2="75" y2="185" stroke="url(#leadershipGlow)" strokeWidth="3" />

      <line x1="200" y1="110" x2="230" y2="160" stroke="url(#leadershipGlow)" strokeWidth="3" />
      <line x1="230" y1="160" x2="205" y2="185" stroke="url(#leadershipGlow)" strokeWidth="3" />

      {/* Legs (Anchored Power Stance) */}
      <line x1="140" y1="200" x2="105" y2="280" stroke="url(#leadershipGlow)" strokeWidth="3.5" />
      <line x1="140" y1="200" x2="175" y2="280" stroke="url(#leadershipGlow)" strokeWidth="3.5" />

      {/* Executive Presence Badge overlay */}
      <g transform="translate(140, 20)">
        <rect x="-60" y="0" width="120" height="24" rx="12" fill="rgba(255, 95, 162, 0.2)" stroke="#FF5FA2" strokeWidth="1.5" />
        <text x="0" y="16" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          👑 EXECUTIVE AURA
        </text>
      </g>
    </svg>
  );
};

// ==================== 5. PRESENTATION VISUALIZER ====================
const PresentationVisualizer: React.FC<{ progress: number }> = () => {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full max-h-[320px] drop-shadow-[0_0_15px_rgba(0,217,200,0.5)]">
      {/* Floating Presentation Slide Wireframe Screen */}
      <rect x="20" y="25" width="170" height="110" rx="8" fill="rgba(110,123,255,0.1)" stroke="#6E7BFF" strokeWidth="2" />
      <rect x="30" y="38" width="80" height="10" rx="2" fill="#00D9C8" opacity="0.8" />
      <rect x="30" y="55" width="140" height="6" rx="1" fill="#6E7BFF" opacity="0.5" />
      <rect x="30" y="66" width="120" height="6" rx="1" fill="#6E7BFF" opacity="0.5" />
      <circle cx="150" cy="95" r="18" fill="rgba(0,217,200,0.2)" stroke="#00D9C8" strokeWidth="1.5" />

      {/* Presenter Skeleton pointing laser to screen */}
      <circle cx="215" cy="140" r="14" fill="rgba(0,217,200,0.15)" stroke="#00D9C8" strokeWidth="2.5" />
      <line x1="215" y1="154" x2="215" y2="240" stroke="#00D9C8" strokeWidth="3" />
      <line x1="185" y1="170" x2="245" y2="170" stroke="#00D9C8" strokeWidth="3" />

      {/* Extended Laser Pointer Arm */}
      <line x1="185" y1="170" x2="140" y2="110" stroke="#00D9C8" strokeWidth="2.5" />
      
      {/* Laser Pointer Red Beam */}
      <motion.line 
        x1="140" y1="110" x2="90" y2="70" 
        stroke="#FF5FA2" strokeWidth="2" strokeDasharray="3 3"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <circle cx="90" cy="70" r="3" fill="#FF5FA2" className="animate-ping" />

      {/* Audience Engagement Radar Arc at bottom */}
      <path d="M 40 290 Q 140 230 240 290" fill="none" stroke="#6E7BFF" strokeWidth="2" strokeDasharray="4 4" />
      <text x="140" y="305" fill="#6E7BFF" fontSize="10" fontFamily="monospace" textAnchor="middle">
        AUDIENCE GAZE SECTOR (95.8%)
      </text>
    </svg>
  );
};

// ==================== 6. EDUCATOR VISUALIZER ====================
const EducatorVisualizer: React.FC<{ progress: number }> = () => {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full max-h-[320px] drop-shadow-[0_0_15px_rgba(53,230,164,0.5)]">
      {/* Interactive Board Background */}
      <rect x="25" y="25" width="230" height="150" rx="10" fill="rgba(53, 230, 164, 0.05)" stroke="#35E6A4" strokeWidth="2" />
      <text x="40" y="55" fill="#35E6A4" fontSize="12" fontFamily="monospace" fontWeight="bold">E = mc²</text>
      <path d="M 40 75 Q 80 120 130 80 T 200 110" fill="none" stroke="#00D9C8" strokeWidth="2" strokeDasharray="3 3" />
      
      {/* Teacher Skeleton Standing at Board */}
      <circle cx="210" cy="180" r="16" fill="rgba(53,230,164,0.15)" stroke="#35E6A4" strokeWidth="2.5" />
      <line x1="210" y1="196" x2="210" y2="280" stroke="#35E6A4" strokeWidth="3" />
      <line x1="180" y1="215" x2="240" y2="215" stroke="#35E6A4" strokeWidth="3" />

      {/* Explaining Arm pointing to formula */}
      <line x1="180" y1="215" x2="130" y2="100" stroke="#35E6A4" strokeWidth="2.5" />
      <circle cx="130" cy="100" r="4" fill="#FFFFFF" stroke="#35E6A4" strokeWidth="2" />

      <text x="40" y="200" fill="#35E6A4" fontSize="10" fontFamily="monospace">TEACHING EFFECTIVENESS</text>
    </svg>
  );
};

// ==================== 7. MEDIA VISUALIZER ====================
const MediaVisualizer: React.FC<{ progress: number }> = () => {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full max-h-[320px] drop-shadow-[0_0_15px_rgba(255,95,162,0.5)]">
      {/* Broadcast Camera Frame Overlay */}
      <rect x="15" y="15" width="250" height="310" rx="12" fill="none" stroke="#FF5FA2" strokeWidth="1.5" strokeDasharray="8 8" />
      <text x="30" y="40" fill="#FF5FA2" fontSize="11" fontFamily="monospace" fontWeight="bold">
        🔴 REC [4K 60FPS]
      </text>
      <text x="180" y="40" fill="#00D9C8" fontSize="10" fontFamily="monospace">
        ISO 400
      </text>

      {/* Broadcast Anchor Skeleton */}
      <circle cx="140" cy="110" r="22" fill="rgba(255,95,162,0.15)" stroke="#FF5FA2" strokeWidth="3" />
      <line x1="140" y1="132" x2="140" y2="240" stroke="#FF5FA2" strokeWidth="3.5" />
      <line x1="85" y1="155" x2="195" y2="155" stroke="#FF5FA2" strokeWidth="3.5" />

      {/* Studio Desk Microphone Graphic */}
      <rect x="132" y="210" width="16" height="30" rx="8" fill="#6E7BFF" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="140" y1="240" x2="140" y2="280" stroke="#6E7BFF" strokeWidth="3" />
      <line x1="120" y1="280" x2="160" y2="280" stroke="#6E7BFF" strokeWidth="3" />

      {/* Charisma Index Dial */}
      <circle cx="215" cy="270" r="25" fill="rgba(110,123,255,0.2)" stroke="#6E7BFF" strokeWidth="2" />
      <text x="215" y="274" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">96%</text>
    </svg>
  );
};

// ==================== 8. INTERPERSONAL VISUALIZER ====================
const InterpersonalVisualizer: React.FC<{ progress: number }> = () => {
  return (
    <svg viewBox="0 0 280 340" className="w-full h-full max-h-[320px] drop-shadow-[0_0_15px_rgba(255,180,84,0.5)]">
      {/* Dual Skeletons in Active Conversation */}
      {/* Person 1 (Left) */}
      <g transform="translate(80, 0)">
        <circle cx="0" cy="100" r="15" fill="rgba(255,180,84,0.2)" stroke="#FFB454" strokeWidth="2.5" />
        <line x1="0" y1="115" x2="0" y2="220" stroke="#FFB454" strokeWidth="3" />
        <line x1="-25" y1="135" x2="25" y2="135" stroke="#FFB454" strokeWidth="3" />
        <line x1="25" y1="135" x2="40" y2="175" stroke="#FFB454" strokeWidth="2.5" />
      </g>

      {/* Person 2 (Right) */}
      <g transform="translate(200, 0)">
        <circle cx="0" cy="100" r="15" fill="rgba(0,217,200,0.2)" stroke="#00D9C8" strokeWidth="2.5" />
        <line x1="0" y1="115" x2="0" y2="220" stroke="#00D9C8" strokeWidth="3" />
        <line x1="-25" y1="135" x2="25" y2="135" stroke="#00D9C8" strokeWidth="3" />
        <line x1="-25" y1="135" x2="-40" y2="175" stroke="#00D9C8" strokeWidth="2.5" />
      </g>

      {/* Rapport Resonance Wave between them */}
      <motion.path 
        d="M 120 120 Q 140 90 160 120 T 160 160" 
        fill="none" stroke="#FFB454" strokeWidth="2" strokeDasharray="4 4"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      <text x="140" y="270" fill="#FFB454" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        🤝 EMOTIONAL RESONANCE: 98.1%
      </text>
    </svg>
  );
};

export const ProcessingCategoryVisualizer: React.FC<ProcessingCategoryVisualizerProps> = ({
  categoryKey,
  categoryTitle,
  fps,
  progress
}) => {
  const categoryType = getCategoryType(categoryKey, categoryTitle);

  const renderVisualizer = () => {
    switch (categoryType) {
      case 'student': return <StudentVisualizer progress={progress} />;
      case 'athlete': return <AthleteVisualizer progress={progress} />;
      case 'interview': return <InterviewVisualizer progress={progress} />;
      case 'leadership': return <LeadershipVisualizer progress={progress} />;
      case 'presentation': return <PresentationVisualizer progress={progress} />;
      case 'teacher': return <EducatorVisualizer progress={progress} />;
      case 'personality': return <MediaVisualizer progress={progress} />;
      case 'communication': return <InterpersonalVisualizer progress={progress} />;
      default: return <InterviewVisualizer progress={progress} />;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between">
      {renderVisualizer()}
    </div>
  );
};
