# ClipTrix AI - Comprehensive Code Explanation & Architecture Guide

This document provides a line-by-line and section-by-section breakdown of how the ClipTrix AI codebase operates, structured from application startup to individual view components, state management, translation services, and utility engines.

---

## Table of Contents
1. [Application Entry Point (`src/main.tsx`)](#1-application-entry-point-srcmaintsx)
2. [Global Styles & Animations (`src/index.css`)](#2-global-styles--animations-srcindexcss)
3. [Type Definitions (`src/types.ts`)](#3-type-definitions-srctypests)
4. [Main Application Shell (`src/App.tsx`)](#4-main-application-shell-srcapptsx)
5. [Navigation & Header (`src/components/Header.tsx`)](#5-navigation--header-srccomponentsheader-tsx)
6. [Hero & Landing Page (`src/components/LandingView.tsx`)](#6-hero--landing-page-srccomponentslandingviewtsx)
7. [Contact Us View (`src/components/ContactView.tsx`)](#7-contact-us-view-srccomponentscontactviewtsx)
8. [Assessment Workflow (`src/components/NewAssessmentView.tsx` & `AiProcessingScreen.tsx`)](#8-assessment-workflow)
9. [Report & HUD Visualization (`src/components/ReportView.tsx` & `HudRing.tsx`)](#9-report--hud-visualization)
10. [Authentication & Supabase Storage (`src/components/AuthView.tsx` & `src/lib/supabase.ts`)](#10-authentication--supabase-storage)
11. [Footer & Legal Views (`src/components/Footer.tsx`, `TermsView.tsx`, etc.)](#11-footer--legal-views)

---

## 1. Application Entry Point (`src/main.tsx`)

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Line-by-Line Breakdown:
- **Line 1 (`import { StrictMode } from 'react'`):** Imports React's `StrictMode` wrapper, which checks for potential side effects and deprecated patterns during development.
- **Line 2 (`import { createRoot } from 'react-dom/client'`):** Imports React 18's concurrent rendering root API.
- **Line 3 (`import App from './App.tsx'`):** Loads the root application component that contains view routing, state hooks, and layout shells.
- **Line 4 (`import './index.css'`):** Injects global Tailwind CSS, custom design tokens (`:root` CSS variables), theme properties, and keyframe animations.
- **Lines 6–10 (`createRoot(...).render(...)`):** Finds the HTML element `<div id="root"></div>` inside `index.html`, instantiates the React fiber root, and renders the `<App />` component.

---

## 2. Global Styles & Animations (`src/index.css`)

### CSS Variables & Design System:
- **`:root` Theme Variables:** Defines `--bg-main` (dark canvas background), `--accent-1` (cyan), `--accent-2` (indigo), `--accent-3` (purple), `--text` (high-contrast white/light gray), and `--border-glass` (subtle border opacity).
- **Glassmorphism Utility (`.glass-panel`):** Combines `backdrop-blur-md`, subtle background opacity, and a 1px border (`border-white/10`) to create a floating HUD aesthetic.
- **Keyframe Animations:**
  - `@keyframes marquee-scroll`: Animates scrolling elements smoothly.
  - Custom scrollbar styling for webkit browsers (`::-webkit-scrollbar`).

---

## 3. Type Definitions (`src/types.ts`)

Defines the core data contracts shared across the application:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AssessmentReport {
  id: string;
  userId: string;
  title: string;
  category: string;
  overallScore: number;
  scoreBand: 'good' | 'needs-work' | 'excellent';
  summary: string;
  attributes: { name: string; score: number; feedback: string }[];
  criticalFaults: string[];
  growthDrills: { title: string; description: string; duration: string }[];
  createdAt: string;
}
```

---

## 4. Main Application Shell (`src/App.tsx`)

### Architecture & State Hooks:
1. **Lazy Loading React Suspense:** Views like `LandingView`, `DashboardView`, `NewAssessmentView`, `ContactView`, `PrivacyView`, `TermsView`, and `SecurityView` are code-split using `React.lazy()` for optimal cold-start loading times.
2. **Current View Navigation State (`currentView`):** Controls active route views: `'landing' | 'auth' | 'dashboard' | 'new-assessment' | 'contact' | 'privacy' | 'terms' | 'security' | 'admin'`.
3. **Session Management (`user`, `reports`):** Interacts with Supabase Auth or LocalStorage fallback to track authenticated user profiles and generated assessment reports.

```tsx
// Key snippet in App.tsx: View Renderer Switch
<Suspense fallback={<LoadingFallback />}>
  {currentView === 'landing' && <LandingView onStartAssessment={handleStartAssessment} onNavigateAuth={() => setCurrentView('auth')} />}
  {currentView === 'contact' && <ContactView onNavigate={(v) => setCurrentView(v)} showToast={showToast} />}
  {currentView === 'new-assessment' && <NewAssessmentView onComplete={handleAssessmentComplete} />}
  {currentView === 'report' && selectedReport && <ReportView report={selectedReport} onBack={() => setCurrentView('dashboard')} />}
</Suspense>
```

---

## 5. Navigation & Header (`src/components/Header.tsx`)

### Line-by-Line Highlights:
- **Logo Click (`onNavigate('landing')`):** Resets view to hero landing.
- **Theme Switcher:** Toggles light/dark modes by setting `document.documentElement.classList.toggle('dark')`.
- **Contact Us Button:** Navigates directly to `'contact'` view.
- **User Dropdown & Sign Out:** Displays active user profile badge and handles session invalidation upon logout.

---

## 6. Hero & Landing Page (`src/components/LandingView.tsx`)

### Automated Feature Showcase Carousel:
```tsx
const SHOWCASE_FEATURES = [
  { icon: Video, title: 'AI Video Analysis', description: 'Frame-by-frame Gemini vision scoring', tag: 'VISION AI' },
  { icon: Target, title: 'Objective Scoring Engine', description: 'Weighted evaluation rubrics & critical fault detection', tag: 'PRECISION' },
  { icon: Globe, title: 'Multi-Language Reports', description: 'Instant auto-translation into 20+ languages', tag: 'GLOBAL' },
  { icon: FileText, title: 'Instant PDF/DOCX Export', description: 'Publication-grade executive reports', tag: 'EXPORT' },
  { icon: Layers, title: 'Category-Specific Rubrics', description: 'Metrics for sports, interviews, & presentations', tag: 'RUBRICS' }
];
```

### Auto-Rotation Logic:
```tsx
useEffect(() => {
  if (isFeatureHovered) return; // Pauses on user hover
  const timer = setInterval(() => {
    setActiveFeature((prev) => (prev + 1) % SHOWCASE_FEATURES.length);
  }, 3000); // Cycles every 3 seconds
  return () => clearInterval(timer);
}, [isFeatureHovered]);
```
- **`AnimatePresence` & `motion.div`:** Executes smooth fade and vertical slide transitions (`y: 15 -> y: 0 -> y: -15`).
- **Interactive Dots:** Allows manual jumping to features with active dot indicator highlights.

---

## 7. Contact Us View (`src/components/ContactView.tsx`)

Provides direct contact methods, updated official email (`contacta@cliptrixai.com`), physical location (`Chandausi, Sambhal, India`), and a functional contact query form with full input placeholder guidance (`enter your full name`, `write your email`).

---

## 8. Assessment Workflow (`NewAssessmentView.tsx` & `AiProcessingScreen.tsx`)

1. **Video Upload / Input:** Accepts MP4/WebM video uploads or webcam video capture.
2. **Category Selection:** Users select from domains (e.g. Sports Biomechanics, Public Speaking, Job Interview, Sales Pitch).
3. **AI Vision Processing (`AiProcessingScreen.tsx`):**
   - Displays real-time telemetry processing step sequence:
     1. Decoding video frames
     2. Running Pose & Keypoint Extraction
     3. Evaluating Rubric Criteria via Gemini API / Engine
     4. Generating Growth Drills & Critical Fault Warnings
4. **Report Generation:** Produces a comprehensive `AssessmentReport` object stored to Supabase / LocalStorage.

---

## 9. Report & HUD Visualization (`ReportView.tsx` & `HudRing.tsx`)

- **`HudRing.tsx`:** Renders a futuristic SVG circular gauge calculating stroke-dashoffset dynamically based on overall score:
  ```tsx
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;
  ```
- **PDF Export (`generatePdfReport`):** Exports clean printable executive summaries.
- **Multi-Language Translation (`ReportLanguageSelector.tsx`):** Calls Gemini / Translation API to translate the report summary, attributes, and growth drills into 20+ languages on demand.

---

## 10. Authentication & Supabase Storage (`AuthView.tsx` & `supabase.ts`)

- **`AuthView.tsx`:** Manages user login, registration, password validation strength meters, and guest demo mode.
- **`src/lib/supabase.ts`:**
  - Initializes Supabase client with environment keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
  - Implements fallback mock storage if remote database credentials are omitted, ensuring 100% offline uptime.

---

## 11. Footer & Legal Views (`Footer.tsx`, `TermsView.tsx`, etc.)

- **Footer Navigation:** Links to Company info, Privacy Policy, Terms of Service, Security Disclosures, and direct Contact Us routes.
- **Legal Views:** Fully styled responsive legal compliance documentation rendered cleanly inside the application container.

---

## Summary of Architectural Best Practices
- **Strict Scope Alignment:** Zero unnecessary external dependencies; clean React 18 + Tailwind CSS + Framer Motion architecture.
- **Robust Fallbacks:** Graceful handling when external APIs or database persistence keys are unconfigured.
- **Accessibility & Motion Safety:** Respects `prefers-reduced-motion` preferences.
