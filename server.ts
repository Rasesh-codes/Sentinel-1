import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { analyzeWithGemini } from './server/geminiService.js';
import { runPipeline } from './server/pipeline.js';
import { DEMO_BENCHMARKS } from './server/demoData.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Security & Parsing middleware
app.use(express.json({ limit: '100kb' }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// 1. Health check endpoint
const handleHealth = async (req: Request, res: Response) => {
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
  );

  let engineReady = false;
  try {
    const testResult = await runPipeline({
      message: 'test message',
      force_source: 'local_fallback',
    });
    if (testResult && testResult.risk_level) {
      engineReady = true;
    }
  } catch (err) {
    console.error('Engine health check failed:', err);
  }

  res.json({
    status: 'ok',
    app: 'SENTINEL',
    version: '1.0.0',
    tagline: 'Before you trust it, check it.',
    python_engine: engineReady,
    engine_ready: engineReady,
    gemini_configured: geminiConfigured,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', handleHealth);
app.get('/api/health', handleHealth);

// 2. Demo Benchmarks endpoint
app.get('/api/demos', (req: Request, res: Response) => {
  res.json({ demos: DEMO_BENCHMARKS });
});

// 3. Main Analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { message, language = 'en', force_source } = req.body;

    // Input validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Message text is required and cannot be empty or whitespace only.',
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: 'Message exceeds maximum limit of 4000 characters.',
      });
    }

    const safeLanguage = ['en', 'hi', 'hinglish'].includes(language) ? language : 'en';

    // Step A: Check if force_source is explicitly set to local_fallback
    let rawAiOutput = null;
    let attemptedGemini = false;

    if (force_source !== 'local_fallback') {
      attemptedGemini = true;
      rawAiOutput = await analyzeWithGemini(message, safeLanguage);
    }

    // Step B: Pass into Deterministic Verification Pipeline
    // Even if Gemini generated output, Deterministic Engine validates all evidence spans
    // and calculates the deterministic risk score!
    const result = await runPipeline({
      message,
      language: safeLanguage,
      simulated_ai_output: rawAiOutput || undefined,
      force_source: rawAiOutput ? 'gemini' : (force_source || (attemptedGemini ? 'local_fallback' : undefined)),
    });

    return res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error during analysis';
    console.error('[SENTINEL] Error processing analysis:', message);
    return res.status(500).json({
      error: 'An internal error occurred while analyzing the message. Please try again.',
      detail: message,
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SENTINEL] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
