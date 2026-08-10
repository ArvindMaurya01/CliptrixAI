import React, { useState, useRef, useEffect } from 'react';
import { AssessmentCategoryKey, AssessmentReport } from '../types';
import { CATEGORIES, getCategoryAttributes } from '../data/mockData';
import { Upload, Video, Sparkles, CheckCircle2, ChevronDown, Lock, AlertTriangle, StopCircle, RefreshCw, X } from 'lucide-react';
import { AiProcessingScreen } from './AiProcessingScreen';
import { processClientVideoAssessment } from '../engine/clientAssessmentEngine';

interface NewAssessmentViewProps {
  initialCategory?: AssessmentCategoryKey;
  onComplete: (report: AssessmentReport) => void;
  onCancel: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const ACTIVE_CATEGORY_KEYS: AssessmentCategoryKey[] = ['interview', 'student', 'athlete'];

const ORDERED_CATEGORY_KEYS: AssessmentCategoryKey[] = [
  'interview',
  'student',
  'athlete',
  'presentation',
  'leadership',
  'communication',
  'teacher',
  'personality'
];

export const NewAssessmentView: React.FC<NewAssessmentViewProps> = ({
  initialCategory,
  onComplete,
  onCancel,
  onShowToast
}) => {
  const initialValidCategory = (initialCategory && ACTIVE_CATEGORY_KEYS.includes(initialCategory)) ? initialCategory : '';
  const [selectedCategory, setSelectedCategory] = useState<AssessmentCategoryKey | ''>(initialValidCategory);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<string>('Unspecified');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (errorMessage && (errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('quota'))) {
      const match = errorMessage.match(/(\d+)(?:\.\d+)?s/i);
      const seconds = match ? Math.ceil(parseFloat(match[1])) : 35;
      setRetryCountdown(seconds);

      const interval = setInterval(() => {
        setRetryCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setRetryCountdown(0);
    }
  }, [errorMessage]);

  // Webcam modal & state
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [webcamBlob, setWebcamBlob] = useState<Blob | null>(null);

  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup webcam stream when modal closes
  useEffect(() => {
    return () => {
      stopWebcamStream();
    };
  }, []);

  const stopWebcamStream = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleSelectVideoFile = (file: File) => {
    setVideoFile(file);
    setErrorMessage(null);

    // Extract actual duration
    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      const durSec = Math.round(tempVideo.duration || 0);
      const mins = String(Math.floor(durSec / 60)).padStart(2, '0');
      const secs = String(durSec % 60).padStart(2, '0');
      setVideoDuration(`${mins}:${secs}`);
      URL.revokeObjectURL(url);
    };
    tempVideo.onerror = () => {
      setVideoDuration('Unspecified');
      URL.revokeObjectURL(url);
    };
  };

  const openWebcamModal = async () => {
    setIsWebcamOpen(true);
    setWebcamError(null);
    setRecordedChunks([]);
    setWebcamBlob(null);
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
        webcamVideoRef.current.play();
      }
    } catch (err: any) {
      setWebcamError("Camera access denied or unavailable: " + (err.message || String(err)));
    }
  };

  const startWebcamRecording = () => {
    if (!mediaStreamRef.current) return;
    setRecordedChunks([]);
    setRecordingSeconds(0);

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        setWebcamBlob(blob);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (e: any) {
      setWebcamError("Failed to start MediaRecorder: " + e.message);
    }
  };

  const stopWebcamRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleUseWebcamVideo = () => {
    if (!webcamBlob) return;
    const ext = webcamBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const recordedFile = new File([webcamBlob], `webcam_session_${Date.now()}.${ext}`, { type: webcamBlob.type });
    
    stopWebcamStream();
    setIsWebcamOpen(false);

    handleSelectVideoFile(recordedFile);
    if (onShowToast) onShowToast("Recorded webcam session attached!", "success");
  };

  const closeWebcamModal = () => {
    stopWebcamStream();
    setIsWebcamOpen(false);
  };

  const orderedCategories = ORDERED_CATEGORY_KEYS.map(key => CATEGORIES.find(c => c.key === key)).filter(Boolean) as typeof CATEGORIES;

  const getCategoryEmoji = (key: AssessmentCategoryKey) => {
    switch (key) {
      case 'interview': return '💼';
      case 'presentation': return '🎤';
      case 'leadership': return '👔';
      case 'communication': return '🤝';
      case 'teacher': return '📚';
      case 'athlete': return '🏃';
      case 'student': return '🎓';
      case 'personality': return '🎥';
      default: return '💡';
    }
  };

  const activeCatInfo = CATEGORIES.find(c => c.key === selectedCategory);
  const categoryMetrics = selectedCategory ? getCategoryAttributes(selectedCategory) : [];

  const handleStartAnalysis = async () => {
    if (!videoFile || !selectedCategory) {
      const msg = 'Please upload a video and select an assessment category before generating the report.';
      setErrorMessage(msg);
      if (onShowToast) onShowToast(msg, 'error');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => (prev < 90 ? prev + 8 : prev));
    }, 150);

    try {
      const videoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read video file.'));
        reader.readAsDataURL(videoFile);
      });

      let newReport: AssessmentReport | null = null;

      try {
        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => controller.abort(), 90000);

        const response = await fetch('/api/assess-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            videoBase64,
            mimeType: videoFile.type || 'video/mp4',
            categoryKey: selectedCategory,
            categoryName: activeCatInfo?.title || 'Assessment',
            customPrompt: `Evaluate performance exclusively using metrics for ${activeCatInfo?.title}.`,
            title: `${activeCatInfo?.title || 'Video'} Assessment Report`,
            videoFileName: videoFile.name,
            duration: videoDuration
          }),
        });
        clearTimeout(fetchTimeout);

        if (response.ok) {
          newReport = await response.json();
        } else {
          console.warn(`[NewAssessmentView] Server API returned HTTP ${response.status}. Switching to Client Assessment Engine...`);
        }
      } catch (fetchErr) {
        console.warn('[NewAssessmentView] Server backend endpoint unreachable or timed out (90s). Switching to Client Assessment Engine...', fetchErr);
      }

      // If server API was not available or timed out, generate report immediately using Client Assessment Engine
      if (!newReport) {
        newReport = await processClientVideoAssessment({
          videoBase64,
          mimeType: videoFile.type || 'video/mp4',
          categoryKey: selectedCategory,
          categoryName: activeCatInfo?.title || 'Assessment',
          customPrompt: `Evaluate performance exclusively using metrics for ${activeCatInfo?.title}.`,
          title: `${activeCatInfo?.title || 'Video'} Assessment Report`,
          videoFileName: videoFile.name,
          duration: videoDuration
        });
      }

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      setTimeout(() => {
        if (newReport) {
          onComplete(newReport);
        }
      }, 300);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      const msg = err.message || 'Failed to complete video assessment.';
      setErrorMessage(msg);
      if (onShowToast) onShowToast(msg, 'error');
    }
  };

  if (isAnalyzing) {
    return (
      <AiProcessingScreen 
        progress={analysisProgress} 
        categoryKey={selectedCategory}
        categoryTitle={activeCatInfo?.title} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 view-enter">
      {/* Top Header & Cancel */}
      <div className="flex justify-between items-center border-b border-[var(--border-glass)] pb-4">
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          &larr; Back to Dashboard
        </button>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20">
          Gemini Multimodal AI Studio
        </span>
      </div>

      {/* Main Error Banner if API error occurs */}
      {errorMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-[var(--text)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-bold text-red-400 uppercase tracking-wide">
                Video Assessment Failed
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-mono">
                {errorMessage}
              </p>
              {(errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('quota')) && (
                <p className="text-[11px] text-amber-400 font-medium pt-1 border-t border-red-500/20 mt-2">
                  💡 <strong>How to resolve:</strong> Wait 30–60 seconds for the Gemini rate quota to reset, then click <strong>Retry Now</strong>. If you have a paid or Pro API key, add or update your <code>GEMINI_API_KEY</code> variable in the <strong>AI Studio Settings menu</strong> (top right).
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {videoFile && selectedCategory && (
              <button
                onClick={handleStartAnalysis}
                disabled={retryCountdown > 0}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  retryCountdown > 0 
                    ? 'bg-slate-700 opacity-80 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${retryCountdown > 0 ? 'animate-spin' : ''}`} />
                <span>{retryCountdown > 0 ? `Retry in ${retryCountdown}s` : 'Retry Now'}</span>
              </button>
            )}
            <button 
              onClick={() => setErrorMessage(null)} 
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] text-xs font-bold rounded-lg hover:bg-[var(--border-glass)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Video & Category Selection Card */}
      <div className="glass-panel p-8 space-y-6 relative z-40">
        <div className="flex items-center gap-3 border-b border-[var(--border-glass)] pb-4">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-1)]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Video Upload & Assessment Setup</h2>
            <p className="text-xs text-[var(--text-muted)]">Upload your video file or record via webcam, then select your evaluation category.</p>
          </div>
        </div>

        {/* Video Upload Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
            <Video className="w-4 h-4 text-[var(--accent-1)]" />
            <span>Upload Video File (MP4, MOV, WebM) <span className="text-red-400">*</span></span>
          </label>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-dashed border-[var(--border-glass)] hover:border-[var(--accent-1)]/50 transition-all">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-[var(--text)]">
                {videoFile ? videoFile.name : 'Choose video file or record live webcam session'}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {videoFile ? `Measured Duration: ${videoDuration}` : 'Supported formats: MP4, MOV, WebM'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] cursor-pointer hover:opacity-95 active:scale-95 transition-all shadow-md flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                <span>Browse File</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSelectVideoFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={openWebcamModal}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--text)] glass-panel hover:bg-[var(--border-glass)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-[var(--accent-2)]" />
                <span>Webcam Record</span>
              </button>
            </div>
          </div>

          {videoFile && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
              <span className="font-mono font-medium text-[var(--text)]">Attached: {videoFile.name} ({videoDuration})</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready
              </span>
            </div>
          )}
        </div>

        {/* Category Dropdown (Required) */}
        <div className="space-y-2 pt-2 relative z-50">
          <label className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5 uppercase tracking-wide">
            <span className="font-mono text-[var(--accent-1)]">#</span> Select Assessment Category <span className="text-red-400">*</span>
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              className="w-full px-4 py-3.5 rounded-xl text-xs font-semibold text-[var(--text)] bg-[var(--bg-elevated-solid)] border-2 border-[var(--border-glass)] hover:border-[var(--accent-1)] focus:outline-none focus:border-[var(--accent-1)] focus:ring-2 focus:ring-[var(--accent-1)]/20 transition-all flex items-center justify-between shadow-lg cursor-pointer"
            >
              {selectedCategory && activeCatInfo ? (
                <span className="flex items-center gap-2.5 text-sm font-bold text-[var(--text)]">
                  <span className="text-base">{getCategoryEmoji(selectedCategory as AssessmentCategoryKey)}</span>
                  <span>{activeCatInfo.title}</span>
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Active
                  </span>
                </span>
              ) : (
                <span className="text-[var(--text-muted)] font-normal">
                  -- Choose an Assessment Category --
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-[var(--accent-1)] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div
                role="listbox"
                aria-label="Assessment Category"
                className="absolute left-0 right-0 top-full mt-2 z-[9999] rounded-2xl bg-[var(--bg-elevated-solid)] border-2 border-[var(--accent-1)]/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden divide-y divide-[var(--border-glass)] max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
                style={{ backgroundColor: 'var(--bg-elevated-solid)' }}
              >
                {orderedCategories.map((cat) => {
                  const isActive = ACTIVE_CATEGORY_KEYS.includes(cat.key);
                  const isSelected = selectedCategory === cat.key;

                  return (
                    <button
                      type="button"
                      key={cat.key}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={!isActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isActive) {
                          setSelectedCategory(cat.key);
                          setErrorMessage(null);
                          setIsDropdownOpen(false);
                          if (onShowToast) {
                            onShowToast(`Selected category: ${cat.title}`, 'success');
                          }
                        } else {
                          const msg = "This assessment category is under development and will be available soon.";
                          if (onShowToast) {
                            onShowToast(msg, "info");
                          }
                        }
                      }}
                      className={`w-full px-4 py-3.5 flex items-center justify-between text-xs text-left transition-all ${
                        isActive
                          ? isSelected
                            ? 'bg-[var(--accent-1)]/20 text-[var(--accent-1)] font-bold cursor-pointer'
                            : 'text-[var(--text)] hover:bg-[var(--accent-1)]/10 active:bg-[var(--accent-1)]/20 font-semibold cursor-pointer'
                          : 'text-[var(--text-muted)] opacity-60 bg-[var(--bg)]/40 cursor-not-allowed hover:bg-amber-500/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {!isActive ? (
                          <span className="text-amber-500 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                          </span>
                        ) : (
                          <span className="text-base">{getCategoryEmoji(cat.key)}</span>
                        )}
                        <span className={isActive ? 'font-bold text-[var(--text)]' : 'font-normal text-[var(--text-muted)]'}>
                          {cat.title} {!isActive && '(Coming Soon)'}
                        </span>
                      </div>

                      {isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                          Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Coming Soon</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Validation Alert */}
        {videoFile && !selectedCategory && (
          <div className="w-full mt-4 mb-2 p-4 sm:p-5 rounded-xl glass-panel bg-amber-500/10 border border-amber-500/30 text-[var(--text)] flex items-start gap-3.5 shadow-md">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <span>⚠️ Please select an assessment category</span>
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Both video upload and category selection are required before AI report generation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Metrics Description Card */}
      {selectedCategory && activeCatInfo && (
        <div className="rounded-2xl p-6 sm:p-8 space-y-6 border-2 border-[var(--accent-1)]/40 bg-[var(--bg-elevated-solid)] shadow-2xl animate-fade-in relative z-10 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)]" />

          <div className="space-y-2 border-b border-[var(--border-glass)] pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-1)] flex items-center gap-1.5">
                <span># Selected Category</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                ✅ Ready for Assessment
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-[var(--text)] flex items-center gap-3 pt-1">
              <span className="p-2 rounded-xl bg-[var(--bg)] border border-[var(--border-glass)] text-2xl shadow-sm">
                {getCategoryEmoji(selectedCategory as AssessmentCategoryKey)}
              </span>
              <span>{activeCatInfo.title}</span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] pt-1 leading-relaxed">
              {activeCatInfo.description}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[var(--text-muted)] font-mono uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-1)]"></span>
              <span>Metrics to be Evaluated ({categoryMetrics.length})</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {categoryMetrics.map((metric, idx) => (
                <li
                  key={idx}
                  className="py-2.5 px-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border-glass)] font-semibold text-[var(--text)] flex items-center gap-2.5 shadow-sm hover:border-[var(--accent-1)]/40 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-2)] shrink-0"></span>
                  <span>{metric.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Generate AI Report Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-6">
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold text-[var(--text)]">
            {!videoFile && !selectedCategory
              ? '⚠️ Please upload a video and select an assessment category.'
              : !videoFile
              ? '⚠️ Please upload a video file.'
              : !selectedCategory
              ? '⚠️ Please select an assessment category.'
              : '✨ Ready to generate real-time AI report using Gemini Multimodal AI!'}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Both video upload and category selection are required to enable report generation.
          </p>
        </div>

        <button
          onClick={handleStartAnalysis}
          disabled={!videoFile || !selectedCategory}
          className={`w-full sm:w-auto px-10 py-4 rounded-full text-sm font-extrabold text-white transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer ${
            videoFile && selectedCategory
              ? 'bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:scale-[1.02] active:scale-[0.98] shadow-[var(--accent-1)]/30'
              : 'bg-slate-600/30 text-slate-400 cursor-not-allowed opacity-60 shadow-none'
          }`}
        >
          <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          <span className="uppercase tracking-wider">Generate AI Report</span>
        </button>
      </div>

      {/* Real Webcam Modal */}
      {isWebcamOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[var(--bg-elevated-solid)] border-2 border-[var(--accent-1)]/50 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
                <Video className="w-5 h-5 text-[var(--accent-1)]" />
                <span>Live Webcam Recording</span>
              </div>
              <button 
                onClick={closeWebcamModal} 
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {webcamError ? (
              <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 font-mono">
                {webcamError}
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-[var(--border-glass)]">
                <video 
                  ref={webcamVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    <span>REC {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:{String(recordingSeconds % 60).padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-2">
              {!isRecording ? (
                <button
                  onClick={startWebcamRecording}
                  disabled={!!webcamError}
                  className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                  <span>Start Recording</span>
                </button>
              ) : (
                <button
                  onClick={stopWebcamRecording}
                  className="px-6 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <StopCircle className="w-4 h-4 text-red-400" />
                  <span>Stop Recording</span>
                </button>
              )}

              {webcamBlob && !isRecording && (
                <button
                  onClick={handleUseWebcamVideo}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Attach Recorded Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

