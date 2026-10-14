import React from 'react';
import { Layers, Sparkles, UploadCloud } from 'lucide-react';

interface HeaderProps {
  onUploadClick: () => void;
  hasActiveImage: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onUploadClick,
  hasActiveImage,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded-md"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors whitespace-nowrap">
              BG Remover
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#workspace"
            className="hover:text-purple-700 transition-colors whitespace-nowrap"
          >
            Studio
          </a>
          <a
            href="#how-it-works"
            className="hover:text-purple-700 transition-colors whitespace-nowrap"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="hover:text-purple-700 transition-colors whitespace-nowrap"
          >
            Features
          </a>
          <a
            href="#faq"
            className="hover:text-purple-700 transition-colors whitespace-nowrap"
          >
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {hasActiveImage ? (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors whitespace-nowrap border border-purple-200/60"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New</span>
            </button>
          ) : (
            <button
              onClick={onUploadClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg shadow-sm shadow-purple-600/25 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Removing</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
