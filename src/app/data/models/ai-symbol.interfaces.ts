import { StyleConfig, StyleUiState } from '@data/services/ai-symbol-state.service';

export interface AiGenerationParams {
  prompt: string;
  num_images: number;
  steps: number;
  loraAdapter?: string;
  loraStrength?: number;
}

export interface AiGenerationResponse {
  status?: 'queued' | 'processing' | 'completed';
  job_id?: string;
  queue_position?: number;
  estimated_wait_time?: number;
  image_urls: string[]; // present when status is 'completed' or legacy response
}

export interface AiImageToImageParams {
  image: string; // base64 encoded image
  prompt: string; // built prompt using buildPrompt()
  num_images: number;
  steps: number;
  loraAdapter?: string;
  loraStrength?: number;
}

export interface PromptOptions {
  mode: 'text' | 'image';
  userPrompt: string;
  styleState: StyleUiState;
  styleConfig?: StyleConfig;
}