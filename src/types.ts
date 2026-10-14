export type ModelQuality = 'isnet_quint8' | 'isnet_fp16' | 'isnet';

export type BackgroundStyle = 'checker-light' | 'checker-dark' | 'color';

export interface ImageMetadata {
  file: File;
  name: string;
  size: number;
  width: number;
  height: number;
  objectUrl: string;
}

export interface ProcessedResult {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
  processingTimeMs: number;
}

export type ProcessingStatus = 'idle' | 'loading-model' | 'processing' | 'done' | 'error';

export interface ProcessingProgress {
  status: ProcessingStatus;
  percentage: number;
  detail: string;
  error?: string | null;
}
