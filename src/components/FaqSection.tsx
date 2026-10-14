import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does real in-browser AI background removal work?',
    answer:
      'BG Remover runs deep learning segmentation models (ISNet) directly inside your web browser using WebAssembly and WebGL/WebGPU acceleration. When you remove a background, the neural network calculates an alpha mask that separates the primary subject from the background pixels without sending your image to any external server.',
  },
  {
    question: 'Are my photos ever uploaded to a remote server or stored?',
    answer:
      'No. Your images remain 100% private on your machine. All computation occurs locally in your browser memory, making BG Remover completely safe for confidential product designs, personal photos, and sensitive documents.',
  },
  {
    question: 'What file formats and image sizes are supported?',
    answer:
      'You can upload JPG, JPEG, PNG, and WebP images up to 10 MB in file size. You can also paste directly from your clipboard using Ctrl+V or Cmd+V.',
  },
  {
    question: 'Does the output image have actual alpha transparency?',
    answer:
      'Yes! When you click "Download Transparent PNG", you receive a standard 32-bit RGBA PNG file with a true transparent alpha channel. You can import this PNG directly into Photoshop, Figma, Canva, Illustrator, or website code without any background color.',
  },
  {
    question: 'Why does the first image take a few seconds to process?',
    answer:
      'During your first removal in a session, your browser downloads the neural network weights (around 44-88 MB depending on your selected preset) and caches them in your browser. Once cached, subsequent background removals are much faster.',
  },
  {
    question: 'Can I add a custom background color before downloading?',
    answer:
      'Yes! In the workspace, you can switch between transparent checkerboard preview, preset studio colors (white, black, gray, lavender, mint), or choose any custom hex color. You can then download either the transparent PNG or the image with your chosen background.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 border-t border-purple-100/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Everything you need to know
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Clear answers about performance, file formats, and transparency.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:text-purple-700 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
