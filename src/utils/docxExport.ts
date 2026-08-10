import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle,
  ShadingType
} from 'docx';
import { AssessmentReport } from '../types';

export async function generateDocxReport(report: AssessmentReport, languageName: string = 'English') {
  const universalFont = "Arial";

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Document Header Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "CLIPTRIX AI // ASSESSMENT REPORT",
                bold: true,
                size: 28,
                color: "6E7BFF",
                font: universalFont
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `Multilingual Report Generation • Language: ${languageName}`,
                size: 18,
                italics: true,
                color: "64748B",
                font: universalFont
              }),
            ],
          }),

          // Metadata Table / Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    margins: { top: 160, bottom: 160, left: 200, right: 200 },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.SINGLE, size: 24, color: "6E7BFF" },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${report.title}\n`, bold: true, size: 24, color: "FFFFFF", font: universalFont }),
                          new TextRun({ text: `Category: ${report.categoryName}  |  Report ID: ${report.id}\n`, size: 18, color: "00D9C8", font: universalFont }),
                          new TextRun({ text: `Date: ${report.date}  |  Duration: ${report.duration}\n`, size: 18, color: "94A3B8", font: universalFont }),
                          new TextRun({ text: `OVERALL PERFORMANCE SCORE: ${report.overallScore} / 100`, bold: true, size: 22, color: "38BDF8", font: universalFont }),
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 240, after: 120 }, children: [] }),

          // Executive Summary Section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({ text: `EXECUTIVE SUMMARY (${languageName.toUpperCase()})`, bold: true, size: 22, color: "0F172A", font: universalFont }),
            ]
          }),

          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({ text: report.summary, size: 20, color: "334155", font: universalFont }),
            ]
          }),

          // Quantitative Attribute Matrix Table
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({ text: "QUANTITATIVE ATTRIBUTE MATRIX", bold: true, size: 22, color: "0F172A", font: universalFont }),
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Attribute", bold: true, color: "38BDF8", size: 18, font: universalFont })] })]
                  }),
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Score", bold: true, color: "38BDF8", size: 18, font: universalFont })] })]
                  }),
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: "38BDF8", size: 18, font: universalFont })] })]
                  }),
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Observed Value", bold: true, color: "38BDF8", size: 18, font: universalFont })] })]
                  }),
                  new TableCell({
                    shading: { fill: "0F172A", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Expert Insight", bold: true, color: "38BDF8", size: 18, font: universalFont })] })]
                  }),
                ]
              }),
              // Data Rows
              ...report.attributes.map(attr => new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: attr.name, bold: true, size: 18, font: universalFont })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: `${attr.score}/100`, bold: true, size: 18, color: "2563EB", font: universalFont })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: String(attr.status).toUpperCase(), bold: true, size: 16, color: "10B981", font: universalFont })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: attr.observedEvidence || attr.observedValue, size: 17, font: universalFont })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: attr.technicalAnalysis || attr.expertAnalysis, size: 17, font: universalFont })] })]
                  }),
                ]
              }))
            ]
          }),

          new Paragraph({ spacing: { before: 240, after: 120 }, children: [] }),

          // Key Strengths
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({ text: "KEY STRENGTHS", bold: true, size: 22, color: "0F172A", font: universalFont }),
            ]
          }),

          ...report.strengths.map(str => new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "• ", bold: true, color: "10B981", size: 20, font: universalFont }),
              new TextRun({ text: str, size: 20, color: "1E293B", font: universalFont }),
            ]
          })),

          new Paragraph({ spacing: { before: 180 }, children: [] }),

          // Action Plan
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({ text: "TARGETED ACTION PLAN", bold: true, size: 22, color: "0F172A", font: universalFont }),
            ]
          }),

          ...report.actionPlan.map((act, idx) => new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: `${idx + 1}. `, bold: true, color: "6E7BFF", size: 20, font: universalFont }),
              new TextRun({ text: act, size: 20, color: "1E293B", font: universalFont }),
            ]
          })),

          new Paragraph({ spacing: { before: 200 }, children: [] }),

          // AI Expert Insight Callout Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F0F9FF", type: ShadingType.CLEAR },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 12, color: "38BDF8" },
                      bottom: { style: BorderStyle.SINGLE, size: 12, color: "38BDF8" },
                      left: { style: BorderStyle.SINGLE, size: 24, color: "0284C7" },
                      right: { style: BorderStyle.SINGLE, size: 12, color: "38BDF8" }
                    },
                    margins: { top: 160, bottom: 160, left: 200, right: 200 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "AI EXPERT PERFORMANCE INSIGHT\n", bold: true, size: 20, color: "0284C7", font: universalFont }),
                          new TextRun({ text: report.aiInsight, size: 19, color: "0F172A", font: universalFont }),
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ClipTrix_Report_${report.id}_${languageName.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
