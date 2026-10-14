import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { SAMPLE_IMAGES, SampleImage } from '../utils/sampleImages';
import { validateImageFile } from '../utils/fileUtils';

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  onSampleSelected: (sample: SampleImage) => void;
  isLoadingSample: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileSelected,
  onSampleSelected,
  isLoadingSample,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file.');
      return;
    }

    setErrorMessage(null);
    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const validation = validateImageFile(file);
            if (!validation.valid) {
              setErrorMessage(validation.error || 'Invalid pasted image.');
            } else {
              setErrorMessage(null);
              onFileSelected(file);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelected]);

  return (
    <div className="w-full">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 sm:p-12 text-center bg-white shadow-sm ${
          isDragging
            ? 'border-purple-600 bg-purple-50/50 scale-[1.008]'
            : 'border-purple-200/90 hover:border-purple-500 hover:bg-purple-50/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            // Reset input so same file can be selected again
            e.target.value = '';
          }}
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Drag & drop your image here
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            or browse files from your computer. You can also paste directly with <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 rounded text-slate-600 border border-slate-200">Ctrl+V</kbd>
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-6 py-3 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-sm shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Select Image File</span>
          </button>

          <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
            <span>Supports JPG, PNG, WebP</span>
            <span aria-hidden="true">·</span>
            <span>Up to 10 MB</span>
            <span aria-hidden="true">·</span>
            <span>100% Private</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-sm text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to process file</p>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Sample Images Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              No image handy? Try these sample photos:
            </h4>
            <p className="text-xs text-slate-500">
              Click any photo to test instant on-device background removal.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-purple-700 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Test</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              disabled={isLoadingSample}
              onClick={() => onSampleSelected(sample)}
              className="group text-left bg-white border border-slate-200/80 hover:border-purple-400 rounded-xl p-2 transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 disabled:opacity-60"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 relative mb-2">
                <img
                  src={sample.src}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {sample.category}
                </span>
              </div>
              <div className="px-1">
                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-purple-700 transition-colors">
                  {sample.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {sample.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Guarantee note */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-purple-600" />
        <span>Photos stay on your device — processed in your browser with WebAssembly & WebGPU.</span>
      </div>
    </div>
  );
};
