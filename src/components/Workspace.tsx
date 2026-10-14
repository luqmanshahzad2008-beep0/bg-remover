import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Check,
  AlertCircle,
  Eye,
  Columns,
  RefreshCw,
  Palette,
} from 'lucide-react';
import {
  ImageMetadata,
  ProcessedResult,
  ProcessingProgress,
  BackgroundStyle,
  ModelQuality,
} from '../types';
import { formatBytes, downloadBlob, downloadWithCustomBackground } from '../utils/fileUtils';
import { ComparisonSlider } from './ComparisonSlider';

interface WorkspaceProps {
  imageMeta: ImageMetadata;
  processed: ProcessedResult | null;
  progress: ProcessingProgress;
  onRemoveBackground: (quality: ModelQuality) => void;
  onReset: () => void;
}

const PRESET_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Pure Black', value: '#000000' },
  { name: 'Studio Gray', value: '#F1F5F9' },
  { name: 'Vibrant Purple', value: '#7C3AED' },
  { name: 'Soft Lavender', value: '#E9D5FF' },
  { name: 'Pastel Mint', value: '#D1FAE5' },
  { name: 'Warm Cream', value: '#FEF3C7' },
  { name: 'Ocean Cyan', value: '#06B6D4' },
];

export const Workspace: React.FC<WorkspaceProps> = ({
  imageMeta,
  processed,
  progress,
  onRemoveBackground,
  onReset,
}) => {
  const [viewMode, setViewMode] = useState<'result' | 'split' | 'original'>('result');
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('checker-light');
  const [customColor, setCustomColor] = useState<string>('#FFFFFF');
  const [selectedQuality, setSelectedQuality] = useState<ModelQuality>('isnet_fp16');
  const [isExportingCustom, setIsExportingCustom] = useState(false);

  const isProcessing = progress.status === 'loading-model' || progress.status === 'processing';

  const handleDownloadTransparent = () => {
    if (!processed?.blob) return;
    downloadBlob(processed.blob, imageMeta.name, '-transparent.png');
  };

  const handleDownloadWithBg = async () => {
    if (!processed?.objectUrl) return;
    setIsExportingCustom(true);
    try {
      await downloadWithCustomBackground(
        processed.objectUrl,
        customColor,
        imageMeta.name
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingCustom(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
      {/* Workspace Top Toolbar */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {imageMeta.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
              <span>{formatBytes(imageMeta.size)}</span>
              <span aria-hidden="true">·</span>
              <span>{imageMeta.width} × {imageMeta.height} px</span>
              {processed && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-600 font-medium">Processed in {(processed.processingTimeMs / 1000).toFixed(1)}s</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Another Image</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-4 sm:p-6">
        {/* State 1: Processing Progress View */}
        {isProcessing && (
          <div className="min-h-[420px] rounded-xl border border-purple-200/80 bg-purple-50/30 p-8 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-purple-600 animate-pulse" />
              </div>
            </div>

            <h4 className="text-lg font-bold text-slate-900 mb-1">
              {progress.status === 'loading-model' ? 'Loading AI Model...' : 'Removing Background...'}
            </h4>
            <p className="text-sm text-slate-600 max-w-md mb-6">
              {progress.detail}
            </p>

            {/* Progress bar */}
            <div className="w-full max-w-md bg-purple-100 rounded-full h-3 overflow-hidden p-0.5 border border-purple-200">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, progress.percentage)}%` }}
              />
            </div>
            <span className="text-xs font-mono font-medium text-purple-700 mt-2 tabular-nums">
              {progress.percentage}% completed
            </span>

            <p className="text-xs text-slate-400 mt-6 max-w-sm">
              Processing runs directly inside your browser using WebAssembly. High resolution photos may take a few seconds.
            </p>
          </div>
        )}

        {/* State 2: Error Notification */}
        {progress.error && !isProcessing && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-sm text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Background Removal Failed</p>
              <p className="text-xs text-rose-700 mt-0.5">{progress.error}</p>
            </div>
            <button
              onClick={() => onRemoveBackground(selectedQuality)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 rounded-lg transition-colors border border-rose-300 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* State 3: Not processed yet - Show Original Preview + Action Box */}
        {!processed && !isProcessing && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Original Image Preview */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200/80 p-4 min-h-[400px] overflow-hidden">
              <img
                src={imageMeta.objectUrl}
                alt={imageMeta.name}
                className="max-h-[500px] max-w-full w-auto h-auto object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Right: Removal Configuration & Trigger */}
            <div className="lg:col-span-4 flex flex-col gap-5 p-5 bg-purple-50/40 rounded-xl border border-purple-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                  Ready to Process
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  AI Background Eraser
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Isolates your subject with pixel-precise edge alpha masks using deep convolutional networks.
                </p>
              </div>

              {/* Model Quality Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Quality & Speed Preset
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedQuality('isnet_fp16')}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      selectedQuality === 'isnet_fp16'
                        ? 'border-purple-600 bg-white ring-2 ring-purple-600/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Balanced (Recommended)</span>
                      {selectedQuality === 'isnet_fp16' && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Fast 16-bit float neural model with sharp hair and fur edge retention.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedQuality('isnet_quint8')}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      selectedQuality === 'isnet_quint8'
                        ? 'border-purple-600 bg-white ring-2 ring-purple-600/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Fast 8-bit Quantized</span>
                      {selectedQuality === 'isnet_quint8' && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Lightweight 44 MB model for fast loading and low memory devices.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedQuality('isnet')}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      selectedQuality === 'isnet'
                        ? 'border-purple-600 bg-white ring-2 ring-purple-600/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Ultra HD (Full Precision)</span>
                      {selectedQuality === 'isnet' && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Full 32-bit float model for maximal resolution accuracy on desktop GPUs.
                    </p>
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => onRemoveBackground(selectedQuality)}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Remove Background</span>
              </button>
            </div>
          </div>
        )}

        {/* State 4: Completed Result View */}
        {processed && !isProcessing && (
          <div className="space-y-6">
            {/* View Mode & Background Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              {/* Left: View Mode Segmented Tabs */}
              <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('result')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                    viewMode === 'result'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Transparent Result</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                    viewMode === 'split'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Before / After Slider</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                    viewMode === 'original'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Original</span>
                </button>
              </div>

              {/* Right: Background Presets (Active in result & split modes) */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-500">
                  Canvas Preview:
                </span>

                <button
                  type="button"
                  onClick={() => setBackgroundStyle('checker-light')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                    backgroundStyle === 'checker-light'
                      ? 'border-purple-600 text-purple-700 bg-purple-50 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  Light Checker
                </button>

                <button
                  type="button"
                  onClick={() => setBackgroundStyle('checker-dark')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                    backgroundStyle === 'checker-dark'
                      ? 'border-purple-600 text-purple-700 bg-purple-50 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  Dark Checker
                </button>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                  {PRESET_COLORS.slice(0, 5).map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.name}
                      onClick={() => {
                        setBackgroundStyle('color');
                        setCustomColor(c.value);
                      }}
                      className={`w-6 h-6 rounded-full border transition-transform ${
                        backgroundStyle === 'color' && customColor === c.value
                          ? 'ring-2 ring-purple-600 scale-110'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}

                  {/* Custom color picker */}
                  <label className="relative cursor-pointer ml-1">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setBackgroundStyle('color');
                        setCustomColor(e.target.value);
                      }}
                      className="sr-only"
                    />
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-slate-600 transition-transform ${
                        backgroundStyle === 'color' && !PRESET_COLORS.some((c) => c.value === customColor)
                          ? 'ring-2 ring-purple-600 scale-110'
                          : 'border-slate-300 hover:scale-105 bg-white'
                      }`}
                      title="Pick custom background color"
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Display Canvas Frame */}
            <div className="relative min-h-[460px] max-h-[640px] rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-900">
              {viewMode === 'split' ? (
                <ComparisonSlider
                  originalUrl={imageMeta.objectUrl}
                  processedUrl={processed.objectUrl}
                  backgroundStyle={backgroundStyle}
                  customColor={customColor}
                />
              ) : viewMode === 'original' ? (
                <div className="w-full h-full p-4 flex items-center justify-center bg-slate-100">
                  <img
                    src={imageMeta.objectUrl}
                    alt="Original"
                    className="max-h-[580px] max-w-full w-auto h-auto object-contain rounded"
                  />
                </div>
              ) : (
                /* Transparent Result on Checkerboard or Chosen Background */
                <div
                  className={`w-full h-full min-h-[460px] p-4 flex items-center justify-center transition-colors ${
                    backgroundStyle === 'checker-light'
                      ? 'checkerboard-pattern'
                      : backgroundStyle === 'checker-dark'
                      ? 'checkerboard-dark'
                      : ''
                  }`}
                  style={backgroundStyle === 'color' ? { backgroundColor: customColor } : {}}
                >
                  <img
                    src={processed.objectUrl}
                    alt="Transparent PNG Result"
                    className="max-h-[580px] max-w-full w-auto h-auto object-contain drop-shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-purple-50/40 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Another Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveBackground(selectedQuality)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-purple-700 bg-purple-100/70 hover:bg-purple-100 rounded-xl transition-all flex items-center gap-1.5"
                  title="Re-run background removal with quality settings"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-process</span>
                </button>
              </div>

              {/* Download Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {backgroundStyle === 'color' && (
                  <button
                    type="button"
                    disabled={isExportingCustom}
                    onClick={handleDownloadWithBg}
                    className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-purple-800 bg-purple-100/90 hover:bg-purple-200 border border-purple-200 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download with Background</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownloadTransparent}
                  className="flex-1 sm:flex-initial px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Transparent PNG</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
