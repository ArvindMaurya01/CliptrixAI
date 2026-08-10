import { AssessmentReport } from '../types';

export class TranslationCache {
  private static inMemoryCache: Map<string, AssessmentReport> = new Map();

  private static getCacheKey(reportId: string, languageCode: string): string {
    return `cliptrix_report_cache_${reportId}_${languageCode.toLowerCase()}`;
  }

  static get(reportId: string, languageCode: string): AssessmentReport | null {
    const key = this.getCacheKey(reportId, languageCode);
    
    // Check in-memory first
    if (this.inMemoryCache.has(key)) {
      return this.inMemoryCache.get(key)!;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as AssessmentReport;
        this.inMemoryCache.set(key, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read translation cache from localStorage', e);
    }

    return null;
  }

  static set(reportId: string, languageCode: string, report: AssessmentReport): void {
    const key = this.getCacheKey(reportId, languageCode);
    
    this.inMemoryCache.set(key, report);

    try {
      localStorage.setItem(key, JSON.stringify(report));
    } catch (e) {
      console.warn('Failed to save translation to localStorage', e);
    }
  }

  static has(reportId: string, languageCode: string): boolean {
    return this.get(reportId, languageCode) !== null;
  }
}
