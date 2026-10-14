import React from 'react';
import { UploadCloud, Cpu, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload or Paste Image',
      description:
        'Drop your JPG, JPEG, PNG, or WebP photo into the studio or press Ctrl+V to paste directly from your clipboard.',
      icon: UploadCloud,
    },
    {
      number: '02',
      title: 'Run In-Browser AI Extraction',
      description:
        'Click Remove Background. The client-side neural network analyzes high-frequency boundaries to separate subject from backdrop.',
      icon: Cpu,
    },
    {
      number: '03',
      title: 'Download Transparent PNG',
      description:
        'Inspect your cutout using the comparison slider and download a crisp, transparent PNG ready for graphics or ecommerce.',
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50/60 border-t border-purple-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Simple 3-Step Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            How BG Remover Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            No signup required. Start removing backgrounds in less than 5 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-6 font-bold text-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-widest">
                    Step {step.number}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
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
