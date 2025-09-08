"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { VideoFrameExtractor, ExtractedVideoFrame } from "@/lib/video-frame-extractor";
import { extractVideoMetadata } from "@/lib/extract-video-metadata";

interface VideoFrameSelectorProps {
  file: File | null;
  extractor?: VideoFrameExtractor | null;
  onFrameSelect?: (frame: ExtractedVideoFrame | null) => void;
  onFramesLoad?: (frames: ExtractedVideoFrame[]) => void;
  onFrameDownload?: (frame: ExtractedVideoFrame) => void;
  className?: string;
}

export function VideoFrameSelector({
  file,
  extractor,
  onFrameSelect,
  onFramesLoad,
  onFrameDownload,
  className
}: VideoFrameSelectorProps) {
  const [frames, setFrames] = React.useState<ExtractedVideoFrame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [videoDuration, setVideoDuration] = React.useState(0);
  
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const sliderRef = React.useRef<HTMLInputElement>(null);

  // Extract frames when extractor is available
  React.useEffect(() => {
    if (!extractor || !file) {
      setFrames([]);
      setCurrentFrameIndex(0);
      return;
    }

    const extractFrames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get video metadata first
        const metadata = await extractVideoMetadata(extractor.url);
        setVideoDuration(metadata.duration);

        // Extract frames using the provided extractor
        const extractedFrames = await extractor.extractAllFrames();
        
        setFrames(extractedFrames);
        onFramesLoad?.(extractedFrames);
        
        // Set initial frame
        if (extractedFrames.length > 0) {
          setCurrentFrameIndex(0);
          onFrameSelect?.(extractedFrames[0]);
        }
      } catch (err) {
        console.error('Frame extraction failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to extract frames');
      } finally {
        setIsLoading(false);
      }
    };

    extractFrames();
  }, [extractor, file, onFrameSelect, onFramesLoad]);

  // Update canvas when current frame changes
  React.useEffect(() => {
    if (frames.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const frame = frames[currentFrameIndex];
      
      if (ctx && frame) {
        // Calculate display size while maintaining aspect ratio
        const originalWidth = frame.imageBitmap.width;
        const originalHeight = frame.imageBitmap.height;
        const aspectRatio = originalWidth / originalHeight;
        
        // Maximum display dimensions
        const maxDisplayWidth = 800;
        const maxDisplayHeight = 450;
        
        let displayWidth = originalWidth;
        let displayHeight = originalHeight;
        
        // Scale down if too large, maintaining aspect ratio
        if (displayWidth > maxDisplayWidth) {
          displayWidth = maxDisplayWidth;
          displayHeight = displayWidth / aspectRatio;
        }
        
        if (displayHeight > maxDisplayHeight) {
          displayHeight = maxDisplayHeight;
          displayWidth = displayHeight * aspectRatio;
        }
        
        // Set canvas to display size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        
        // Set CSS size to match canvas size for crisp display
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        
        // Clear and draw the frame
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        ctx.drawImage(frame.imageBitmap, 0, 0, displayWidth, displayHeight);
        
        onFrameSelect?.(frame);
      }
    }
  }, [frames, currentFrameIndex, onFrameSelect]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCurrentFrameIndex(value);
  };

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (frames.length === 0) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setCurrentFrameIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setCurrentFrameIndex(prev => Math.min(frames.length - 1, prev + 1));
        break;
      case 'Home':
        e.preventDefault();
        setCurrentFrameIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setCurrentFrameIndex(frames.length - 1);
        break;
    }
  }, [frames.length]);

  // Add keyboard event listeners
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  if (!file) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-center h-48 rounded-lg border border-border bg-muted/20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-solid border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-body-secondary">Loading video frames...</p>
            <p className="text-xs text-caption mt-1">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "flex items-center justify-center h-64 rounded-lg border border-error/30 bg-error/10 text-error-foreground",
        className
      )}>
        <div className="text-center">
          <p className="text-sm font-medium">Error loading video</p>
          <p className="text-xs text-error-foreground/70 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (frames.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center h-64 rounded-lg border border-border bg-muted/20",
        className
      )}>
        <p className="text-sm text-muted-foreground">No frames extracted</p>
      </div>
    );
  }

  const currentFrame = frames[currentFrameIndex];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Video Frame Display */}
      <div className="relative rounded-lg overflow-hidden bg-black shadow-lg">
        <div className="flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            className="block"
            style={{ 
              maxWidth: '100%',
              maxHeight: '450px',
              width: 'auto',
              height: 'auto'
            }}
          />
        </div>
        
        {/* Frame Info Overlay */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-filter backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
          {currentFrameIndex + 1} / {frames.length}
        </div>
        
        <div className="absolute top-3 right-3 bg-black/80 backdrop-filter backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-mono">
          {formatTime(currentFrame?.time || 0)}
        </div>
        
        {/* Keyboard shortcuts hint */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-filter backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full opacity-70 hover:opacity-100 transition-opacity">
          ← → to navigate
        </div>
        
        {/* Quick action button */}
        {onFrameDownload && currentFrame && (
          <div className="absolute bottom-3 right-3">
            <button
              onClick={() => onFrameDownload(currentFrame)}
              className="bg-primary-solid hover:bg-primary-solid/90 text-primary-foreground text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 shadow-lg"
              title="Download current frame"
            >
              📷 Download
            </button>
          </div>
        )}
      </div>

      {/* Progress Slider */}
      <div className="space-y-2">
        <div className="relative">
          <input
            ref={sliderRef}
            type="range"
            min={0}
            max={frames.length - 1}
            value={currentFrameIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          
          {/* Time display */}
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-emphasis font-mono">
              {formatTime(currentFrame?.time || 0)} / {formatTime(videoDuration)}
            </span>
            <span className="text-muted-foreground">
              Frame {currentFrameIndex + 1} of {frames.length}
            </span>
          </div>
        </div>

        {/* Frame navigation buttons */}
        <div className="flex justify-center gap-1">
          <button
            onClick={() => setCurrentFrameIndex(0)}
            disabled={currentFrameIndex === 0}
            className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="First frame"
          >
            ⏮
          </button>
          <button
            onClick={() => setCurrentFrameIndex(Math.max(0, currentFrameIndex - 10))}
            disabled={currentFrameIndex === 0}
            className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Back 10 frames"
          >
            ⏪
          </button>
          <button
            onClick={() => setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))}
            disabled={currentFrameIndex === 0}
            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Previous frame"
          >
            ◀
          </button>
          <button
            onClick={() => setCurrentFrameIndex(Math.min(frames.length - 1, currentFrameIndex + 1))}
            disabled={currentFrameIndex === frames.length - 1}
            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Next frame"
          >
            ▶
          </button>
          <button
            onClick={() => setCurrentFrameIndex(Math.min(frames.length - 1, currentFrameIndex + 10))}
            disabled={currentFrameIndex === frames.length - 1}
            className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Forward 10 frames"
          >
            ⏩
          </button>
          <button
            onClick={() => setCurrentFrameIndex(frames.length - 1)}
            disabled={currentFrameIndex === frames.length - 1}
            className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Last frame"
          >
            ⏭
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider {
          background: linear-gradient(to right, 
            var(--primary-solid) 0%, 
            var(--primary-solid) ${frames.length > 1 ? (currentFrameIndex / (frames.length - 1)) * 100 : 0}%, 
            var(--muted) ${frames.length > 1 ? (currentFrameIndex / (frames.length - 1)) * 100 : 0}%, 
            var(--muted) 100%
          );
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--primary-solid);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--primary-solid);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
