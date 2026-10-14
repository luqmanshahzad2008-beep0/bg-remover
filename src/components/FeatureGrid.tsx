import React from 'react';
import { Cpu, ShieldCheck, Zap, Download, Sparkles, Layers } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      index: '01',
      title: 'In-Browser Neural Processing',
      description:
        'Powered by ONNX Runtime and WebAssembly. Deep ISNet vision models execute right inside your browser window without uploading files to third-party cloud servers.',
      icon: Cpu,
    },
    {
      index: '02',
      title: 'True Alpha Transparency',
      description:
        'Produces clean, feathered 32-bit RGBA PNG output. Intricate flyaway hair strands, fine fur, and delicate translucent edges are isolated with surgical precision.',
      icon: Layers,
    },
    {
      index: '03',
      title: 'Complete Data Privacy',
      description:
        'Your photos, portraits, and product mockups never leave your local machine. No tracking, no server logs, and no cloud data storage.',
      icon: ShieldCheck,
    },
    {
      index: '04',
      title: 'Free & Unlimited Downloads',
      description:
        'No hidden subscriptions, no credit card requirements, and no watermarks on your downloaded transparent PNG assets.',
      icon: Download,
    },
    {
      index: '05',
      title: 'Flexible Canvas Studio',
      description:
        'Preview your isolated subject against light or dark transparency checkerboards, or test immediate solid backdrops with our color palette.',
      icon: Zap,
    },
    {
      index: '06',
      title: 'Instant Drag, Drop & Paste',
      description:
        'Supports standard JPG, PNG, and WebP images up to 10 MB. Simply paste straight from your clipboard with Ctrl+V for rapid workflows.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 border-t border-purple-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Engineered For Precision
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Professional background isolation, without server lag
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Why wait for queued remote APIs when your computer can process images instantly?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.index}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-purple-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-purple-600">
                      {f.index}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
