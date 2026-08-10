import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Loader2, Circle, Cpu, Eye, Activity, 
  Layers, Shield, Zap, Sparkles, Radio, Check, Award
} from 'lucide-react';
import { 
  ProcessingCategoryVisualizer, 
  getCategoryType, 
  CategoryOverlays, 
  CategoryMetrics 
} from './ProcessingCategoryVisualizer';

interface AiProcessingScreenProps {
  progress: number;
  categoryKey?: string;
  categoryTitle?: string;
}

// Exact 8-Step Pipeline
const PIPELINE_STEPS = [
  { id: 1, label: 'Preparing Video', minProgress: 0, detail: 'Decoding video container & normalizing framerate' },
  { id: 2, label: 'Extracting Frames', minProgress: 13, detail: 'Sampling high-precision keyframes at 60 FPS' },
  { id: 3, label: 'Detecting Human Body', minProgress: 26, detail: 'Locating subject bounding area & spatial depth' },
  { id: 4, label: 'Building 3D Skeleton', minProgress: 39, detail: 'Mapping 33 spatial keypoint joint vectors' },
  { id: 5, label: 'Tracking Motion', minProgress: 51, detail: 'Calculating posture alignment, gaze & cadence' },
  { id: 6, label: 'Analyzing Category Metrics', minProgress: 66, detail: 'Evaluating category-specific rubric parameters' },
  { id: 7, label: 'Generating AI Insights', minProgress: 81, detail: 'Synthesizing Gemini vision & multimodal coaching' },
  { id: 8, label: 'Creating Professional Report', minProgress: 93, detail: 'Formatting executive dashboard & export files' }
];

export const AiProcessingScreen: React.FC<AiProcessingScreenProps> = ({
  progress,
  categoryKey,
  categoryTitle = 'Assessment'
}) => {
  const [fps, setFps] = useState(59.8);
  const [overlayIdx, setOverlayIdx] = useState(0);

  const categoryType = getCategoryType(categoryKey, categoryTitle);
  const overlays = CategoryOverlays[categoryType];
  const metrics = CategoryMetrics[categoryType];

  // Rotate category specific overlay banners every 2.4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setOverlayIdx((prev) => (prev + 1) % overlays.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [overlays]);

  // Fluctuating realistic FPS & Telemetry
  useEffect(() => {
    const fpsInterval = setInterval(() => {
      setFps(+(59.2 + Math.random() * 0.7).toFixed(1));
    }, 500);
    return () => clearInterval(fpsInterval);
  }, []);

  // Calculate current active pipeline step
  const getCurrentStepIndex = () => {
    let index = 0;
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      if (progress >= PIPELINE_STEPS[i].minProgress) {
        index = i;
      }
    }
    return index;
  };

  const currentStepIdx = getCurrentStepIndex();
  const framesProcessed = Math.min(600, Math.floor((progress / 100) * 600));
  const isComplete = progress >= 100;

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-2 sm:px-4 view-enter">
      {/* Outer Holographic AI Laboratory Container */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#0B0F19]/95 border-2 border-[var(--accent-1)]/40 shadow-[0_0_80px_rgba(110,123,255,0.2)] backdrop-blur-2xl overflow-hidden">
        
        {/* Futuristic Grid & Radial Particle Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--accent-1)]/25 via-purple-900/10 to-transparent blur-3xl animate-pulse" />
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 217, 200, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(110, 123, 255, 0.08) 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        {/* TOP HEADER: Status Badge & Category Title */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[var(--border-glass)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[var(--accent-1)]/15 border border-[var(--accent-1)]/40 flex items-center justify-center text-[var(--accent-1)] shadow-[0_0_15px_rgba(0,217,200,0.3)]">
              <Cpu className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'}`} />
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>ClipTrix AI Vision Engine</span>
                  {isComplete && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      SUCCESS
                    </span>
                  )}
                </h2>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Dynamic 3D Skeleton • <span className="text-[var(--accent-1)] font-bold">{categoryTitle}</span>
              </p>
            </div>
          </div>

          {/* Futuristic Circular Progress Ring */}
          <div className="flex items-center gap-4 bg-[#111827]/80 px-4 py-2.5 rounded-2xl border border-[var(--border-glass)] shadow-inner">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-gray-800"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-[var(--accent-1)] transition-all duration-300"
                  fill="transparent"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-extrabold text-white">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-1)]">
                TELEMETRY STATUS
              </div>
              <div className="text-xs font-extrabold text-white">
                {isComplete ? 'Analysis Complete!' : PIPELINE_STEPS[currentStepIdx].label}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID CONTENT */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6">

          {/* LEFT SIDE: Category-Specific Animated 3D Skeleton Visualization (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between rounded-2xl bg-[#111827]/90 border border-[var(--border-glass)] p-4 sm:p-5 shadow-2xl relative overflow-hidden min-h-[420px]">
            
            {/* Top Badge Overlay */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono border-b border-[var(--border-glass)] pb-3 mb-2">
              <div className="flex items-center gap-1.5 text-[var(--accent-1)] font-bold">
                <Eye className="w-3.5 h-3.5 animate-pulse" />
                <span className="uppercase tracking-wider">{categoryTitle} Model</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-1)]/10 text-[var(--accent-1)] font-extrabold text-[10px] border border-[var(--accent-1)]/30">
                33 KEYPOINTS
              </span>
            </div>

            {/* Dynamic Category Overlay Banner */}
            <div className="w-full h-8 flex items-center justify-center my-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={overlayIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="px-3 py-1 rounded-full bg-[var(--accent-1)]/15 border border-[var(--accent-1)]/30 text-[11px] font-mono font-extrabold text-[var(--accent-1)] text-center flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3 h-3 text-[var(--accent-1)] animate-spin" style={{ animationDuration: '4s' }} />
                  <span>{overlays[overlayIdx]}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Skeleton Canvas Viewport */}
            <div className="relative w-full max-w-[280px] h-[280px] flex items-center justify-center py-2 my-auto">
              
              {/* Background Crosshair & Grid */}
              <div className="absolute inset-0 rounded-2xl border border-[var(--accent-1)]/20 bg-gradient-to-b from-[var(--accent-1)]/5 via-purple-900/5 to-transparent pointer-events-none" />

              {/* Laser Scanning Beam Line */}
              <motion.div
                className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#00D9C8] to-transparent shadow-[0_0_12px_#00D9C8] z-20 pointer-events-none"
                animate={{ y: [-130, 130, -130] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* SVG Visualizer for Active Category */}
              <ProcessingCategoryVisualizer 
                categoryKey={categoryKey} 
                categoryTitle={categoryTitle} 
                fps={fps} 
                progress={progress} 
              />

              {/* HUD Crosshair Markers */}
              <div className="absolute top-3 left-3 text-[9px] font-mono text-[var(--accent-1)]/70 font-bold">
                + CAM_01 [AI_MESH]
              </div>
              <div className="absolute top-3 right-3 text-[9px] font-mono text-emerald-400/80 font-bold">
                60 FPS
              </div>
            </div>

            {/* Bottom Category Metrics Live Display */}
            <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border-glass)] text-center text-[10px] font-mono">
              {metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-[#0B0F19] border border-[var(--border-glass)]">
                  <div className="text-gray-400 text-[9px] font-bold">{m.label}</div>
                  <div className={`font-extrabold text-xs mt-0.5 ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT SIDE: 8-Step Pipeline & Telemetry Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Live Metrics Header Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[#111827]/90 border border-[var(--border-glass)] shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                  <Activity className="w-3.5 h-3.5 text-[var(--accent-1)]" />
                  <span>FRAME RATE</span>
                </div>
                <div className="text-sm font-extrabold text-white font-mono mt-1">
                  {fps} <span className="text-[10px] text-emerald-400 font-normal">FPS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#111827]/90 border border-[var(--border-glass)] shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                  <Layers className="w-3.5 h-3.5 text-[#6E7BFF]" />
                  <span>FRAMES PROCESSED</span>
                </div>
                <div className="text-sm font-extrabold text-white font-mono mt-1">
                  {framesProcessed} <span className="text-[10px] text-gray-400">/ 600</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#111827]/90 border border-[var(--border-glass)] shadow-sm col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MODEL ACCURACY</span>
                </div>
                <div className="text-sm font-extrabold text-emerald-400 font-mono mt-1">
                  99.2% <span className="text-[10px] text-gray-400">Verified</span>
                </div>
              </div>
            </div>

            {/* 8-STEP PIPELINE LIST */}
            <div className="rounded-2xl bg-[#111827]/90 border border-[var(--border-glass)] p-4 sm:p-5 space-y-2 shadow-inner max-h-[310px] overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] font-mono border-b border-[var(--border-glass)] pb-2 mb-3">
                <span className="font-extrabold uppercase tracking-wider text-[var(--accent-1)] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[var(--accent-1)]" />
                  AI Processing Pipeline
                </span>
                <span className="text-gray-400 font-bold">{currentStepIdx + 1} / {PIPELINE_STEPS.length} Steps</span>
              </div>

              <div className="space-y-2">
                {PIPELINE_STEPS.map((step, idx) => {
                  const stepCompleted = progress >= step.minProgress || idx < currentStepIdx || isComplete;
                  const stepCurrent = idx === currentStepIdx && !isComplete;
                  const stepPending = idx > currentStepIdx && !stepCompleted;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        stepCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                          : stepCurrent
                          ? 'bg-[var(--accent-1)]/15 text-white font-bold border border-[var(--accent-1)]/40 shadow-sm animate-pulse'
                          : 'bg-[#0B0F19]/40 text-gray-500 border border-[var(--border-glass)]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {stepCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : stepCurrent ? (
                          <Loader2 className="w-4 h-4 text-[var(--accent-1)] animate-spin shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-600 shrink-0" />
                        )}
                        <div>
                          <div className={`font-bold ${stepCurrent ? 'text-[var(--accent-1)]' : stepCompleted ? 'text-white' : 'text-gray-400'}`}>
                            {step.label}
                          </div>
                          <div className="text-[10px] text-gray-400 font-normal hidden sm:block">
                            {step.detail}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold shrink-0">
                        {stepCompleted && <span className="text-emerald-400">DONE</span>}
                        {stepCurrent && <span className="text-[var(--accent-1)] animate-pulse">PROCESSING</span>}
                        {stepPending && <span className="text-gray-600">PENDING</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Dynamic Task Progress Message Bar */}
            <div className="p-3.5 rounded-xl bg-[var(--accent-1)]/10 border border-[var(--accent-1)]/30 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-[var(--accent-1)] animate-pulse shrink-0" />
                <span className="text-xs font-mono font-bold text-white">
                  {isComplete
                    ? '✨ All steps complete! Synthesizing final report...'
                    : `Active Stage: ${PIPELINE_STEPS[currentStepIdx].label}`}
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-[#6E7BFF] shrink-0" />
            </div>

          </div>
        </div>

        {/* BOTTOM GLOBAL PROGRESS BAR */}
        <div className="w-full mt-6 pt-4 border-t border-[var(--border-glass)]">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
            <span>Overall Computer Vision Pipeline Progress</span>
            <span className="font-extrabold text-[var(--accent-1)]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-gray-800 overflow-hidden p-0.5 border border-[var(--border-glass)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent-1)] via-[#6E7BFF] to-emerald-400 shadow-[0_0_15px_rgba(0,217,200,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
