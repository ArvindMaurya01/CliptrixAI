import { AssessmentReport } from '../types';

export function generateTxtReport(report: AssessmentReport, languageName: string = 'English') {
  const lineSeparator = "========================================================================\n";
  const sectionSeparator = "------------------------------------------------------------------------\n";

  let txtContent = "";

  txtContent += lineSeparator;
  txtContent += `CLIPTRIX AI // ASSESSMENT REPORT\n`;
  txtContent += `Language: ${languageName}\n`;
  txtContent += lineSeparator + "\n";

  txtContent += `REPORT TITLE: ${report.title}\n`;
  txtContent += `REPORT ID: ${report.id}\n`;
  txtContent += `CATEGORY: ${report.categoryName}\n`;
  txtContent += `DATE: ${report.date} | DURATION: ${report.duration}\n`;
  txtContent += `OVERALL PERFORMANCE SCORE: ${report.overallScore} / 100 (${String(report.scoreBand).toUpperCase()})\n\n`;

  txtContent += sectionSeparator;
  txtContent += `EXECUTIVE SUMMARY (${languageName.toUpperCase()})\n`;
  txtContent += sectionSeparator;
  txtContent += `${report.summary}\n\n`;

  txtContent += sectionSeparator;
  txtContent += `QUANTITATIVE ATTRIBUTE MATRIX\n`;
  txtContent += sectionSeparator;
  report.attributes.forEach((attr, idx) => {
    txtContent += `${idx + 1}. ${attr.name}\n`;
    txtContent += `   Score: ${attr.score}/100 | Status: ${String(attr.status).toUpperCase()}\n`;
    txtContent += `   Observed Value: ${attr.observedEvidence || attr.observedValue}\n`;
    txtContent += `   Expert Analysis: ${attr.technicalAnalysis || attr.expertAnalysis}\n`;
    if (attr.coachingRecommendation) {
      txtContent += `   Coaching Recommendation: ${attr.coachingRecommendation}\n`;
    }
    txtContent += `\n`;
  });

  if (report.timelineEvents && report.timelineEvents.length > 0) {
    txtContent += sectionSeparator;
    txtContent += `ASSESSMENT TIMELINE & KEY MOMENTS\n`;
    txtContent += sectionSeparator;
    report.timelineEvents.forEach(evt => {
      txtContent += `[${evt.timestamp}] ${evt.title}\n`;
      txtContent += `  ${evt.description}\n\n`;
    });
  }

  txtContent += sectionSeparator;
  txtContent += `KEY STRENGTHS\n`;
  txtContent += sectionSeparator;
  report.strengths.forEach(strength => {
    txtContent += `• ${strength}\n`;
  });
  txtContent += `\n`;

  txtContent += sectionSeparator;
  txtContent += `TARGETED ACTION PLAN\n`;
  txtContent += sectionSeparator;
  report.actionPlan.forEach((action, idx) => {
    txtContent += `${idx + 1}. ${action}\n`;
  });
  txtContent += `\n`;

  if (report.aiInsight) {
    txtContent += sectionSeparator;
    txtContent += `AI EXPERT PERFORMANCE INSIGHT\n`;
    txtContent += sectionSeparator;
    txtContent += `${report.aiInsight}\n\n`;
  }

  txtContent += lineSeparator;
  txtContent += `END OF REPORT - CLIPTRIX AI PERFORMANCE HUD\n`;
  txtContent += lineSeparator;

  // Add UTF-8 BOM (\uFEFF) so text editors automatically render UTF-8 Unicode characters (Hindi, Bengali, Arabic, etc.) correctly
  const blob = new Blob(['\uFEFF' + txtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ClipTrix_Report_${report.id}_${languageName.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
