export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size is ${sizeInMb} MB. The maximum allowed limit is 10 MB. Please upload a smaller image.`,
    };
  }

  // Check file type
  const isMimeSupported = SUPPORTED_MIME_TYPES.includes(file.type);
  const fileNameLower = file.name.toLowerCase();
  const isExtensionSupported = SUPPORTED_EXTENSIONS.some((ext) =>
    fileNameLower.endsWith(ext)
  );

  if (!isMimeSupported && !isExtensionSupported) {
    return {
      valid: false,
      error: 'Unsupported format. Please upload a JPG, JPEG, PNG, or WebP image.',
    };
  }

  return { valid: true };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Failed to read image dimensions.'));
    };
    img.src = url;
  });
}

export function downloadBlob(blob: Blob, originalFilename: string, suffix = '-bg-removed.png') {
  const baseName = originalFilename.replace(/\.[^/.]+$/, '');
  const downloadName = `${baseName}${suffix}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = downloadName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadWithCustomBackground(
  processedUrl: string,
  backgroundColor: string,
  originalFilename: string
): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to render background onto image.'));
    img.src = processedUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context.');

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw transparent image over background
  ctx.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    if (blob) {
      const baseName = originalFilename.replace(/\.[^/.]+$/, '');
      const downloadName = `${baseName}-custom-bg.png`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, 'image/png');
}
