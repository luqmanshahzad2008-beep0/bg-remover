import { removeBackground } from '@imgly/background-removal';
import { ModelQuality, ProcessedResult } from '../types';
import { getImageDimensions } from './fileUtils';

export interface ProgressCallback {
  (percentage: number, detail: string, status: 'loading-model' | 'processing'): void;
}

export async function processBackgroundRemoval(
  fileOrUrl: File | string,
  quality: ModelQuality = 'isnet_fp16',
  onProgress?: ProgressCallback
): Promise<ProcessedResult> {
  const startTime = performance.now();

  try {
    if (onProgress) {
      onProgress(5, 'Preparing neural network pipeline...', 'loading-model');
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let publicPath = 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/';
    if (origin) {
      try {
        const localCheck = await fetch(`${origin}/api/imgly/resources.json`, { method: 'HEAD' });
        if (localCheck.ok) {
          publicPath = `${origin}/api/imgly/`;
        }
      } catch {
        // Fallback to CDN for static environments like Cloudflare Pages
      }
    }

    const blobResult = await removeBackground(fileOrUrl, {
      publicPath,
      model: quality,
      output: {
        format: 'image/png',
        quality: 1.0,
      },
      progress: (key: string, current: number, total: number) => {
        if (!onProgress) return;

        let pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
        let detail = 'Processing image...';
        let status: 'loading-model' | 'processing' = 'processing';

        if (key.includes('fetch') || key.includes('models') || key.includes('onnx')) {
          status = 'loading-model';
          const mbCurrent = (current / (1024 * 1024)).toFixed(1);
          const mbTotal = (total / (1024 * 1024)).toFixed(1);
          detail = total > 0
            ? `Downloading AI model: ${mbCurrent} MB / ${mbTotal} MB (${pct}%)`
            : `Loading AI weights (${mbCurrent} MB)...`;
        } else if (key.includes('compute') || key.includes('inference')) {
          status = 'processing';
          detail = 'Running edge segmentation and alpha extraction...';
          pct = Math.max(pct, 85);
        } else {
          detail = `Optimizing subject boundaries (${key})...`;
        }

        onProgress(pct, detail, status);
      },
    });

    const objectUrl = URL.createObjectURL(blobResult);
    const dimensions = await getImageDimensions(objectUrl);
    const endTime = performance.now();

    return {
      blob: blobResult,
      objectUrl,
      width: dimensions.width,
      height: dimensions.height,
      processingTimeMs: Math.round(endTime - startTime),
    };
  } catch (error) {
    console.error('Background removal error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown processing error.';
    throw new Error(`Failed to remove background: ${msg}`);
  }
}
