import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AssessmentReport } from '../types';

/**
 * Creates a clean, standalone off-screen HTML element formatted specifically for high-resolution PDF rendering.
 * This guarantees 100% perfect rendering for non-Latin Unicode scripts (Hindi, Tamil, Arabic, Chinese, Cyrillic, etc.)
 * by using the browser's native text engine + html2canvas without relying on jsPDF's ASCII-only Helvetica font.
 */
function createPrintableReportContainer(report: AssessmentReport, languageName: string): HTMLElement {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '1000px';
  container.style.backgroundColor = '#0b0f19';
  container.style.color = '#f8fafc';
  container.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';

  const categoryLabel = report.categoryName ? report.categoryName.toUpperCase() : 'ASSESSMENT';
  const overallScore = report.overallScore ?? 0;
  const dateStr = report.date || new Date().toLocaleDateString();
  const durationStr = report.duration || '00:00';

  let html = `
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 32px; margin-bottom: 28px;">
      <!-- Header HUD Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="background: rgba(6, 182, 212, 0.15); color: #06b6d4; border: 1px solid rgba(6, 182, 212, 0.3); font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
              ${categoryLabel}
            </span>
            <span style="background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); font-family: monospace; font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 999px;">
              ID: ${report.id}
            </span>
            <span style="color: #06b6d4; font-weight: 700; font-size: 11px; background: rgba(6, 182, 212, 0.1); padding: 4px 12px; border-radius: 999px;">
              🌐 ${languageName}
            </span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; margin: 8px 0; line-height: 1.2;">
            ${report.title}
          </h1>
          <p style="font-size: 13px; color: #94a3b8; margin: 0;">
            DATE: ${dateStr} &bull; DURATION: ${durationStr}
          </p>
        </div>
        <div style="text-align: center; background: #0b0f19; padding: 16px 28px; border-radius: 16px; border: 1px solid rgba(6, 182, 212, 0.3);">
          <div style="font-size: 36px; font-weight: 900; color: #06b6d4;">${overallScore}</div>
          <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; tracking: 1px;">OVERALL SCORE</div>
        </div>
      </div>

      <!-- Executive Summary -->
      <div style="margin-bottom: 28px;">
        <h2 style="font-size: 14px; font-weight: 800; color: #06b6d4; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
          EXECUTIVE SUMMARY
        </h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0;">
          ${report.summary}
        </p>
      </div>
    </div>

    <!-- Quantitative Metrics Matrix -->
    <div style="background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 28px; margin-bottom: 28px;">
      <h2 style="font-size: 14px; font-weight: 800; color: #06b6d4; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
        PERFORMANCE METRICS BREAKDOWN (${languageName.toUpperCase()})
      </h2>
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
        <thead>
          <tr style="background: #0f172a; color: #06b6d4; border-bottom: 2px solid rgba(6, 182, 212, 0.4);">
            <th style="padding: 12px; font-weight: 800;">Attribute</th>
            <th style="padding: 12px; font-weight: 800; text-align: center;">Score</th>
            <th style="padding: 12px; font-weight: 800; text-align: center;">Status</th>
            <th style="padding: 12px; font-weight: 800;">Observed Value</th>
            <th style="padding: 12px; font-weight: 800;">Expert Insight</th>
          </tr>
        </thead>
        <tbody>
  `;

  report.attributes.forEach((attr, idx) => {
    const isEven = idx % 2 === 0;
    const bg = isEven ? 'rgba(15, 23, 42, 0.4)' : 'transparent';
    const statusColor = attr.status.toLowerCase() === 'optimal' ? '#10b981' : attr.status.toLowerCase() === 'good' ? '#3b82f6' : '#f59e0b';

    html += `
      <tr style="background-color: ${bg}; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <td style="padding: 12px; font-weight: 700; color: #ffffff;">${attr.name}</td>
        <td style="padding: 12px; text-align: center; font-weight: 800; color: #38bdf8;">${attr.score}/100</td>
        <td style="padding: 12px; text-align: center;">
          <span style="color: ${statusColor}; font-weight: 800; font-size: 11px; text-transform: uppercase; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 6px;">
            ${attr.status}
          </span>
        </td>
        <td style="padding: 12px; color: #cbd5e1; line-height: 1.4;">${attr.observedEvidence || attr.observedValue}</td>
        <td style="padding: 12px; color: #cbd5e1; line-height: 1.4;">${attr.technicalAnalysis || attr.expertAnalysis}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  // Key Strengths & Action Plan
  html += `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
      <!-- Strengths -->
      <div style="background: #1e293b; border-radius: 16px; border: 1px solid rgba(16, 185, 129, 0.2); padding: 24px;">
        <h3 style="font-size: 14px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 14px;">
          KEY STRENGTHS
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 13px; line-height: 1.8;">
  `;

  report.strengths.forEach(str => {
    html += `<li style="margin-bottom: 6px;">${str}</li>`;
  });

  html += `
        </ul>
      </div>

      <!-- Action Plan -->
      <div style="background: #1e293b; border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.2); padding: 24px;">
        <h3 style="font-size: 14px; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 14px;">
          TARGETED ACTION PLAN
        </h3>
        <ol style="margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 13px; line-height: 1.8;">
  `;

  report.actionPlan.forEach(act => {
    html += `<li style="margin-bottom: 6px;">${act}</li>`;
  });

  html += `
        </ol>
      </div>
    </div>
  `;

  // AI Performance Insight
  if (report.aiInsight) {
    html += `
      <div style="background: rgba(6, 182, 212, 0.08); border-radius: 16px; border: 1px solid rgba(6, 182, 212, 0.3); padding: 24px; margin-bottom: 20px;">
        <h3 style="font-size: 13px; font-weight: 800; color: #06b6d4; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 8px;">
          AI PERFORMANCE INSIGHT
        </h3>
        <p style="font-size: 13px; color: #e2e8f0; line-height: 1.6; margin: 0;">
          ${report.aiInsight}
        </p>
      </div>
    `;
  }

  // Footer Watermark
  html += `
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); pt: 16px; font-size: 11px; color: #64748b; font-family: monospace;">
      <div>CLIPTRIX AI HUD &bull; PERFORMANCE REPORT</div>
      <div>LANGUAGE: ${languageName.toUpperCase()} &bull; ID: ${report.id}</div>
    </div>
  `;

  container.innerHTML = html;
  return container;
}

export async function generatePdfReport(
  report: AssessmentReport, 
  languageName: string = 'English', 
  reportElement?: HTMLElement | null
) {
  let targetElement = reportElement;
  let createdTempContainer = false;

  // If live element is missing, or to ensure pristine rendering, create printable container
  if (!targetElement) {
    targetElement = createPrintableReportContainer(report, languageName);
    document.body.appendChild(targetElement);
    createdTempContainer = true;
  }

  try {
    const canvas = await html2canvas(targetElement, {
      scale: 2, // High resolution crisp bitmap
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#0b0f19',
    });

    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save(`ClipTrix_Report_${report.id}_${languageName.replace(/\s+/g, '_')}.pdf`);
  } catch (e) {
    console.warn('Primary html2canvas rendering failed. Attempting fallback printable container...', e);
    
    if (!createdTempContainer) {
      const fallbackContainer = createPrintableReportContainer(report, languageName);
      document.body.appendChild(fallbackContainer);

      try {
        const canvas = await html2canvas(fallbackContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#0b0f19',
        });

        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        doc.save(`ClipTrix_Report_${report.id}_${languageName.replace(/\s+/g, '_')}.pdf`);
      } finally {
        if (document.body.contains(fallbackContainer)) {
          document.body.removeChild(fallbackContainer);
        }
      }
    }
  } finally {
    if (createdTempContainer && targetElement && document.body.contains(targetElement)) {
      document.body.removeChild(targetElement);
    }
  }
}
