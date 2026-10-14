/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Shield, Cpu, Image as ImageIcon } from 'lucide-react';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { Workspace } from './components/Workspace';
import { FeatureGrid } from './components/FeatureGrid';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import {
  ImageMetadata,
  ProcessedResult,
  ProcessingProgress,
  ModelQuality,
} from './types';
import { getImageDimensions } from './utils/fileUtils';
import { processBackgroundRemoval } from './utils/imageProcessing';
import { SampleImage, fetchSampleAsFile } from './utils/sampleImages';

export default function App() {
  const [imageMeta, setImageMeta] = useState<ImageMetadata | null>(null);
  const [processed, setProcessed] = useState<ProcessedResult | null>(null);
  const [progress, setProgress] = useState<ProcessingProgress>({
    status: 'idle',
    percentage: 0,
    detail: '',
    error: null,
  });
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);

  // Revoke object URLs when replacing or resetting
  const cleanupUrls = useCallback((meta: ImageMetadata | null, res: ProcessedResult | null) => {
    if (meta?.objectUrl) {
      URL.revokeObjectURL(meta.objectUrl);
    }
    if (res?.objectUrl) {
      URL.revokeObjectURL(res.objectUrl);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupUrls(imageMeta, processed);
    };
  }, [imageMeta, processed, cleanupUrls]);

  const handleFileSelected = async (file: File) => {
    // Revoke previous URLs
    cleanupUrls(imageMeta, processed);

    const objectUrl = URL.createObjectURL(file);
    try {
      const dimensions = await getImageDimensions(objectUrl);
      setImageMeta({
        file,
        name: file.name,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height,
        objectUrl,
      });
      setProcessed(null);
      setProgress({
        status: 'idle',
        percentage: 0,
        detail: '',
        error: null,
      });

      // Smooth scroll to workspace
      setTimeout(() => {
        workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      URL.revokeObjectURL(objectUrl);
      setProgress({
        status: 'error',
        percentage: 0,
        detail: '',
        error: 'Failed to read image dimensions. Please try another image.',
      });
    }
  };

  const handleSampleSelected = async (sample: SampleImage) => {
    setIsLoadingSample(true);
    try {
      const file = await fetchSampleAsFile(sample);
      await handleFileSelected(file);
    } catch (err) {
      console.error('Failed to load sample image:', err);
      setProgress({
        status: 'error',
        percentage: 0,
        detail: '',
        error: 'Could not load sample image. Please try again or upload a file.',
      });
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleRemoveBackground = async (quality: ModelQuality) => {
    if (!imageMeta) return;

    setProgress({
      status: 'loading-model',
      percentage: 10,
      detail: 'Initializing AI model engine in browser...',
      error: null,
    });

    try {
      const result = await processBackgroundRemoval(
        imageMeta.file,
        quality,
        (percentage, detail, status) => {
          setProgress({
            status,
            percentage,
            detail,
            error: null,
          });
        }
      );

      // Clean up previous result URL if exists
      if (processed?.objectUrl) {
        URL.revokeObjectURL(processed.objectUrl);
      }

      setProcessed(result);
      setProgress({
        status: 'done',
        percentage: 100,
        detail: 'Complete!',
        error: null,
      });
    } catch (err) {
      console.error('Background removal failed:', err);
      const msg = err instanceof Error ? err.message : 'Unknown processing error.';
      setProgress({
        status: 'error',
        percentage: 0,
        detail: '',
        error: msg,
      });
    }
  };

  const handleReset = () => {
    cleanupUrls(imageMeta, processed);
    setImageMeta(null);
    setProcessed(null);
    setProgress({
      status: 'idle',
      percentage: 0,
      detail: '',
      error: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToStudio = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FC] text-slate-900 selection:bg-purple-200 selection:text-purple-900">
      {/* Top Bar Header */}
      <Header
        onUploadClick={scrollToStudio}
        hasActiveImage={!!imageMeta}
        onReset={handleReset}
      />

      {/* Main Hero & Studio Area */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-18 lg:pb-24">
          {/* Subtle purple radial background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-100/50 via-purple-50/20 to-transparent pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Heading & Subtitle */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-100/70 text-purple-800 text-xs font-semibold mb-4 border border-purple-200/50">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Real In-Browser Neural AI · Zero Cloud Uploads</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                Remove Image Background for Free
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Extract subjects, portraits, and product photos with surgical edge precision. 100% free, unlimited, and runs locally in your browser.
              </p>

              {/* Quick trust metrics */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>100% Private (No server storage)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>On-Device ISNet AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  <span>Transparent PNG Output</span>
                </div>
              </div>
            </div>

            {/* Interactive Workspace Studio */}
            <div ref={workspaceRef} id="workspace" className="scroll-mt-24">
              {!imageMeta ? (
                <DropZone
                  onFileSelected={handleFileSelected}
                  onSampleSelected={handleSampleSelected}
                  isLoadingSample={isLoadingSample}
                />
              ) : (
                <Workspace
                  imageMeta={imageMeta}
                  processed={processed}
                  progress={progress}
                  onRemoveBackground={handleRemoveBackground}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Capabilities & Feature Grid */}
        <FeatureGrid />

        {/* FAQ Accordion */}
        <FaqSection />
      </main>

      {/* Quiet Footer */}
      <Footer />
    </div>
  );
}
