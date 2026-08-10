import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { processVideoAssessment } from "./src/engine/assessmentEngine";
import { processReportTranslation } from "./src/engine/translationEngine";
import { translateReportFallback } from "./src/engine/fallbackTranslator";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// Real-time Video Assessment endpoint using Refactored Assessment Engine
app.post("/api/assess-video", async (req, res) => {
  try {
    const { videoBase64, mimeType, categoryKey, categoryName, customPrompt, title, videoFileName, duration } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const report = await processVideoAssessment(
      {
        videoBase64,
        mimeType,
        categoryKey,
        categoryName,
        customPrompt,
        title,
        videoFileName,
        duration
      },
      apiKey
    );

    res.json(report);
  } catch (error: any) {
    console.error("Error in /api/assess-video:", error?.message || error);
    const msg = error?.message || 'Failed to complete real-time video assessment.';
    const isRateLimit = msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('quota') || msg.includes('429');
    res.status(isRateLimit ? 429 : 500).json({ error: msg });
  }
});

// Multilingual Report Translation Endpoint
app.post("/api/translate-report", async (req, res) => {
  try {
    const { report, targetLanguage } = req.body;
    if (!report || !targetLanguage) {
      return res.status(400).json({ error: 'Missing report object or targetLanguage.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const translatedReport = await processReportTranslation(report, targetLanguage, apiKey);

    res.json(translatedReport);
  } catch (error: any) {
    console.error("Error in /api/translate-report:", error);
    const report = req.body?.report;
    const targetLanguage = req.body?.targetLanguage || 'target language';
    if (report) {
      const fallbackReport = translateReportFallback(report, targetLanguage);
      return res.json(fallbackReport);
    }
    res.status(200).json({ error: error.message || 'Failed to translate report.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
