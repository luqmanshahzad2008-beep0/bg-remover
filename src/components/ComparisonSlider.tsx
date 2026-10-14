import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { BackgroundStyle } from '../types';

interface ComparisonSliderProps {
  originalUrl: string;
  processedUrl: string;
  backgroundStyle: BackgroundStyle;
  customColor: string;
  aspectRatio?: number;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalUrl,
  processedUrl,
  backgroundStyle,
  customColor,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const bgStyleClass =
    backgroundStyle === 'checker-light'
      ? 'checkerboard-pattern'
      : backgroundStyle === 'checker-dark'
      ? 'checkerboard-dark'
      : '';

  const customBgStyle =
    backgroundStyle === 'color' ? { backgroundColor: customColor } : {};

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full h-full max-h-[600px] min-h-[360px] select-none overflow-hidden rounded-xl border border-slate-200 cursor-ew-resize flex items-center justify-center bg-slate-900"
    >
      {/* Background Layer: Processed Image with Chosen Background */}
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center ${bgStyleClass}`}
        style={customBgStyle}
      >
        <img
          src={processedUrl}
          alt="Background removed result"
          className="max-w-full max-h-[600px] w-auto h-auto object-contain pointer-events-none"
        />
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
          Removed BG
        </div>
      </div>

      {/* Foreground Layer (Clipped Original Image) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-slate-100"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="max-w-full max-h-[600px] w-auto h-auto object-contain pointer-events-none"
        />
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
          Original
        </div>
      </div>

      {/* Draggable Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-purple-700 shadow-md border border-purple-200 flex items-center justify-center pointer-events-auto cursor-ew-resize">
          <ChevronsLeftRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
