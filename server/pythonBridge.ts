import { AnalyzeResponse } from './types.js';
import { runPipeline } from './pipeline.js';

export interface RunPipelineOptions {
  message: string;
  language?: string;
  simulated_ai_output?: any;
  force_source?: string;
}

/**
 * Executes the deterministic pipeline in native TypeScript.
 * Single runtime (Node.js/Express) guarantees 100% reliability in serverless & Cloud Run containers
 * without spawning external processes or requiring python3 runtime installations.
 */
export async function executePythonPipeline(options: RunPipelineOptions): Promise<AnalyzeResponse> {
  return runPipeline({
    message: options.message,
    language: options.language,
    simulated_ai_output: options.simulated_ai_output,
    force_source: options.force_source as any,
  });
}
