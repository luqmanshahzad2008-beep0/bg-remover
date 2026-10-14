import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-purple-100/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              BG Remover
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="#workspace" className="hover:text-purple-700 transition-colors">
              Studio
            </a>
            <a href="#how-it-works" className="hover:text-purple-700 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-purple-700 transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-purple-700 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Server Uploads · 100% Client-Side</span>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} BG Remover. Real in-browser AI background erasure.</p>
          <p>Built with React, TypeScript & @imgly/background-removal.</p>
        </div>
      </div>
    </footer>
  );
};
