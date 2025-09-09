"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { VideoUpload } from "@/components/VideoUpload";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";
import { VideoFrameExtractor, ExtractedVideoFrame } from "@/lib/video-frame-extractor";
import { extractVideoMetadata } from "@/lib/extract-video-metadata";
import { VideoFrameSelector } from "@/components/VideoFrameSelector";
import { cn } from "@/lib/cn";
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-data";
import { trackPageView, trackEvent, trackButtonClick } from "@/lib/analytics";

interface ExtractionResult {
  frames: ExtractedVideoFrame[];
  downloadUrl?: string;
}

export default function ExtractPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [method, setMethod] = React.useState<string>("every-nth");
  const [isRunning, setIsRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [result, setResult] = React.useState<ExtractionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = React.useState<ExtractedVideoFrame | null>(null);
  const [allFrames, setAllFrames] = React.useState<ExtractedVideoFrame[]>([]);
  const [extractor, setExtractor] = React.useState<VideoFrameExtractor | null>(null);
  
  // Form parameters
  const [nthFrame, setNthFrame] = React.useState(5);
  const [timeInterval, setTimeInterval] = React.useState(0.5);
  const [targetFps, setTargetFps] = React.useState(4);
  const [resizeWidth, setResizeWidth] = React.useState<number | null>(null);
  const [outputFormat, setOutputFormat] = React.useState("png");

  // Create extractor when file changes
  React.useEffect(() => {
    if (file) {
      // Create a single extractor instance using the file directly
      const newExtractor = new VideoFrameExtractor(file);
      setExtractor(newExtractor);
      
      return () => {
        // Clean up the extractor (it will handle URL cleanup internally)
        newExtractor.dispose();
      };
    } else {
      setExtractor(null);
      setAllFrames([]);
      setSelectedFrame(null);
    }
  }, [file]);

  const downloadFramesAsZip = async (frames: ExtractedVideoFrame[]) => {
    try {
      // 追踪批量下载事件
      trackEvent('frames_downloaded', {
        frames_count: frames.length,
        extraction_strategy: method,
      });
      
      // Create a zip file containing all frames
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const canvas = document.createElement('canvas');
        canvas.width = resizeWidth || frame.imageBitmap.width;
        canvas.height = resizeWidth 
          ? Math.round((frame.imageBitmap.height * resizeWidth) / frame.imageBitmap.width)
          : frame.imageBitmap.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(frame.imageBitmap, 0, 0, canvas.width, canvas.height);
          
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), `image/${outputFormat}`, 0.9);
          });
          
          const filename = `frame_${String(i + 1).padStart(4, '0')}_${frame.time.toFixed(3)}s.${outputFormat}`;
          zip.file(filename, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `extracted_frames_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (error) {
      console.error('Failed to download frames:', error);
      setError('Failed to create download file');
    }
  };

  const downloadSingleFrame = async (frame: ExtractedVideoFrame) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = resizeWidth || frame.imageBitmap.width;
      canvas.height = resizeWidth 
        ? Math.round((frame.imageBitmap.height * resizeWidth) / frame.imageBitmap.width)
        : frame.imageBitmap.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(frame.imageBitmap, 0, 0, canvas.width, canvas.height);
        
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), `image/${outputFormat}`, 0.9);
        });
        
        const downloadUrl = URL.createObjectURL(blob);
        const frameIndex = allFrames.findIndex(f => f === frame) + 1;
        const filename = `frame_${String(frameIndex).padStart(4, '0')}_${frame.time.toFixed(3)}s.${outputFormat}`;
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
    } catch (error) {
      console.error('Failed to download single frame:', error);
      setError('Failed to download frame');
    }
  };

  const extractFrames = async () => {
    if (!file || !extractor) return;

    setIsRunning(true);
    setProgress(0);
    setResult(null);
    setError(null);

    try {
      // 追踪帧提取开始事件
      trackEvent('frame_extraction_started', {
        extraction_strategy: method,
      });
      let frames: ExtractedVideoFrame[] = [];

      // Use already loaded frames if available, otherwise extract using the shared extractor
      const sourceFrames = allFrames.length > 0 ? allFrames : await extractor.extractAllFrames((progress) => {
        setProgress(Math.round(progress * 0.8)); // Reserve 20% for processing
      });

      if (method === "current-frame") {
        // Extract only the currently selected frame
        if (selectedFrame) {
          frames = [selectedFrame];
        } else {
          throw new Error('No frame selected');
        }
      } else if (method === "all-frames") {
        // Extract all available frames
        frames = sourceFrames;
      } else if (method === "every-nth") {
        frames = sourceFrames.filter((_, index) => index % nthFrame === 0);
      } else if (method === "interval-seconds") {
        let lastTime = -timeInterval;
        frames = sourceFrames.filter((frame) => {
          if (frame.time - lastTime >= timeInterval) {
            lastTime = frame.time;
            return true;
          }
          return false;
        });
      } else if (method === "fixed-fps") {
        // Calculate which frames to extract based on target FPS
        const metadata = await extractVideoMetadata(extractor.url);
        const totalDesiredFrames = Math.ceil(metadata.duration * targetFps);
        const step = sourceFrames.length / totalDesiredFrames;
        
        frames = [];
        for (let i = 0; i < totalDesiredFrames && i < sourceFrames.length; i++) {
          const index = Math.floor(i * step);
          if (index < sourceFrames.length) {
            frames.push(sourceFrames[index]);
          }
        }
      } else if (method === "keyframes") {
        // For keyframes, extract evenly spaced frames (simplified implementation)
        const keyframeCount = Math.max(10, Math.ceil(sourceFrames.length / 30));
        const step = sourceFrames.length / keyframeCount;
        
        frames = [];
        for (let i = 0; i < keyframeCount; i++) {
          const index = Math.floor(i * step);
          if (index < sourceFrames.length) {
            frames.push(sourceFrames[index]);
          }
        }
      }

      setProgress(90);
      
      setResult({ frames });
      setProgress(100);
      
      // 追踪帧提取完成事件
      trackEvent('frame_extraction_completed', {
        extraction_strategy: method,
        frames_extracted: frames.length,
      });
      
    } catch (error) {
      console.error('Extraction failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Extraction failed';
      setError(errorMessage);
      
      // 追踪帧提取失败事件
      trackEvent('frame_extraction_failed', {
        extraction_strategy: method,
        error_message: errorMessage,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      {/* Structured Data for Extract Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([softwareApplicationSchema, howToSchema])
        }}
      />
      
      <div className="grid gap-6 pb-8">
      <Card>
        <CardHeader>
          <CardTitle className="heading-secondary text-glow">Video Frame Extraction</CardTitle>
          <CardDescription className="text-body">Upload video and choose extraction strategy and parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Video Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-solid to-accent flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <Label className="text-base font-semibold">Upload Video File</Label>
            </div>
                <VideoUpload value={file} onChange={setFile} />
            <p className="help-text">Currently supports <span className="text-code">MP4</span> format only</p>
          </div>

          {/* Step 2: Frame Preview & Selection */}
          {file && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-solid to-accent flex items-center justify-center text-white text-sm font-medium">
                  2
                </div>
                <Label className="text-base font-semibold">Preview & Select Frames</Label>
              </div>
                  <VideoFrameSelector
                    file={file}
                    extractor={extractor}
                    onFrameSelect={setSelectedFrame}
                    onFramesLoad={setAllFrames}
                    onFrameDownload={downloadSingleFrame}
                  />
              {selectedFrame && (
                <div className="flex items-center justify-between">
                  <p className="help-text">
                    Current frame: <span className="text-emphasis">{selectedFrame.time.toFixed(3)}s</span> 
                    • Frame {allFrames.findIndex(f => f === selectedFrame) + 1} of {allFrames.length}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadSingleFrame(selectedFrame)}
                    className="text-xs"
                  >
                    📷 Download This Frame
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Extraction Settings */}
          {file && allFrames.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-solid to-accent flex items-center justify-center text-white text-sm font-medium">
                  3
                </div>
                <Label className="text-base font-semibold">Extraction Settings</Label>
            </div>

              {/* Extraction Method Cards */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Choose Extraction Method:</Label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      value: "current-frame",
                      icon: "📷",
                      title: "Selected Frame",
                      description: "Extract the currently selected frame",
                      badge: "Quick"
                    },
                    {
                      value: "all-frames",
                      icon: "🎞️",
                      title: "All Frames",
                      description: "Extract every frame from the video",
                      badge: allFrames.length > 100 ? "Large" : "Complete"
                    },
                    {
                      value: "every-nth",
                      icon: "⏭️",
                      title: "Every N Frames",
                      description: "Extract frames at regular intervals",
                      badge: "Efficient"
                    },
                    {
                      value: "interval-seconds",
                      icon: "⏰",
                      title: "Time Interval",
                      description: "Extract frames by time intervals",
                      badge: "Precise"
                    },
                    {
                      value: "fixed-fps",
                      icon: "🎯",
                      title: "Fixed FPS",
                      description: "Extract at a target frame rate",
                      badge: "Smooth"
                    },
                    {
                      value: "keyframes",
                      icon: "🔑",
                      title: "Key Frames",
                      description: "Extract important scene changes",
                      badge: "Smart"
                    }
                  ].map((option) => (
                    <div
                      key={option.value}
                      onClick={() => setMethod(option.value)}
                      className={cn(
                        "relative p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105",
                        method === option.value
                          ? "border-primary-solid bg-primary-solid/10 shadow-lg"
                          : "border-border bg-muted/20 hover:border-primary-solid/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{option.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-emphasis">{option.title}</h4>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              option.badge === "Large" ? "bg-warning/20 text-warning" :
                              option.badge === "Quick" ? "bg-success/20 text-success" :
                              "bg-accent/20 text-accent-foreground"
                            )}>
                              {option.badge}
                            </span>
                          </div>
                          <p className="text-xs text-body-secondary leading-relaxed">{option.description}</p>
                        </div>
                        {method === option.value && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary-solid flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {method === "current-frame" && selectedFrame && (
                <div className="field">
                  <div className="p-4 rounded-lg bg-accent/20 border border-accent/30">
                    <p className="text-sm text-emphasis mb-2">Selected Frame:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-muted rounded overflow-hidden flex items-center justify-center">
                        <canvas
                          ref={(canvas) => {
                            if (canvas && selectedFrame.imageBitmap) {
                              // Calculate proper dimensions maintaining aspect ratio
                              const aspectRatio = selectedFrame.imageBitmap.width / selectedFrame.imageBitmap.height;
                              const maxWidth = 64;
                              const maxHeight = 48;
                              
                              let width = maxWidth;
                              let height = width / aspectRatio;
                              
                              if (height > maxHeight) {
                                height = maxHeight;
                                width = height * aspectRatio;
                              }
                              
                              canvas.width = width;
                              canvas.height = height;
                              canvas.style.width = `${width}px`;
                              canvas.style.height = `${height}px`;
                              
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.drawImage(selectedFrame.imageBitmap, 0, 0, width, height);
                              }
                            }
                          }}
                          className="block"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-emphasis">
                          Frame {allFrames.findIndex(f => f === selectedFrame) + 1}
                        </p>
                        <p className="text-xs text-caption">
                          Time: {selectedFrame.time.toFixed(3)}s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {method === "all-frames" && (
                <div className="field">
                  <div className="p-4 rounded-lg bg-success/20 border border-success/30">
                    <p className="text-sm text-emphasis mb-2">Extract All Frames:</p>
                    <p className="text-xs text-caption">
                      This will extract every single frame from the video. 
                      {allFrames.length > 0 && (
                        <span className="text-emphasis"> Total: {allFrames.length} frames</span>
                      )}
                    </p>
                    {allFrames.length > 100 && (
                      <div className="mt-3 p-2 rounded bg-warning/20 border border-warning/30">
                        <p className="text-xs text-warning font-medium">
                          ⚠️ Large extraction detected
                        </p>
                        <p className="text-xs text-warning/80 mt-1">
                          {allFrames.length} frames will create a large ZIP file (~{Math.round(allFrames.length * 0.5)} MB estimated)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Method-specific parameters */}
              {method === "every-nth" && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <Label className="text-sm font-medium mb-3 block">Frame Interval Settings</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="nth" className="text-sm w-20">Every</Label>
                      <Input 
                        id="nth" 
                        type="number" 
                        min={1} 
                        value={nthFrame}
                        onChange={(e) => setNthFrame(parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <span className="text-sm text-body-secondary">frames</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">Quick presets:</span>
                      {[2, 5, 10, 30].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setNthFrame(preset)}
                          className={cn(
                            "text-xs px-2 py-1 rounded transition-colors",
                            nthFrame === preset
                              ? "bg-primary-solid text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-caption bg-accent/10 p-2 rounded">
                      📊 This will extract approximately <span className="text-emphasis">{Math.ceil(allFrames.length / nthFrame)}</span> frames
                    </div>
                  </div>
                </div>
              )}

              {method === "interval-seconds" && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <Label className="text-sm font-medium mb-3 block">Time Interval Settings</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="sec" className="text-sm w-20">Every</Label>
                      <Input 
                        id="sec" 
                        type="number" 
                        min={0.1} 
                        step={0.1} 
                        value={timeInterval}
                        onChange={(e) => setTimeInterval(parseFloat(e.target.value) || 0.1)}
                        className="w-24"
                      />
                      <span className="text-sm text-body-secondary">seconds</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">Quick presets:</span>
                      {[0.5, 1.0, 2.0, 5.0].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setTimeInterval(preset)}
                          className={cn(
                            "text-xs px-2 py-1 rounded transition-colors",
                            timeInterval === preset
                              ? "bg-primary-solid text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {preset}s
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-caption bg-accent/10 p-2 rounded">
                      📊 Estimated output: <span className="text-emphasis">{Math.ceil((allFrames[allFrames.length - 1]?.time || 0) / timeInterval)}</span> frames
                    </div>
                  </div>
                </div>
              )}

              {method === "fixed-fps" && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <Label className="text-sm font-medium mb-3 block">Target Frame Rate</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="fps" className="text-sm w-20">Target</Label>
                      <Input 
                        id="fps" 
                        type="number" 
                        min={1} 
                        step={1} 
                        value={targetFps}
                        onChange={(e) => setTargetFps(parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <span className="text-sm text-body-secondary">FPS</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">Common rates:</span>
                      {[1, 2, 4, 8, 12].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setTargetFps(preset)}
                          className={cn(
                            "text-xs px-2 py-1 rounded transition-colors",
                            targetFps === preset
                              ? "bg-primary-solid text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-caption bg-accent/10 p-2 rounded">
                      📊 This will extract approximately <span className="text-emphasis">{Math.ceil((allFrames[allFrames.length - 1]?.time || 0) * targetFps)}</span> frames
                    </div>
                  </div>
                </div>
              )}

              {/* Output Settings */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Output Settings:</Label>
                <div className="space-y-4">
              <div className="field">
                    <Label htmlFor="format">Image Format</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "PNG", value: "png", desc: "Lossless, larger files" },
                        { label: "JPG", value: "jpg", desc: "Compressed, smaller files" },
                        { label: "WEBP", value: "webp", desc: "Modern, best compression" }
                      ].map((format) => (
                        <div
                          key={format.value}
                          onClick={() => setOutputFormat(format.value)}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all text-center",
                            outputFormat === format.value
                              ? "border-primary-solid bg-primary-solid/10"
                              : "border-border bg-muted/20 hover:border-primary-solid/50"
                          )}
                        >
                          <div className="font-medium text-sm">{format.label}</div>
                          <div className="text-xs text-caption mt-1">{format.desc}</div>
                        </div>
                      ))}
                    </div>
              </div>

              <div className="field">
                    <Label htmlFor="resize">Resize Width (optional)</Label>
                    <div className="space-y-3">
                      <Input 
                        id="resize" 
                        type="number" 
                        min={0} 
                        placeholder="Original size"
                        value={resizeWidth || ''}
                        onChange={(e) => setResizeWidth(e.target.value ? parseInt(e.target.value) : null)}
                      />
                      <div className="space-y-2">
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">Common sizes:</span>
                          {[480, 720, 1080, 1920, 2560].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => setResizeWidth(preset)}
                              className={cn(
                                "text-xs px-2 py-1 rounded transition-colors",
                                resizeWidth === preset
                                  ? "bg-primary-solid text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {preset}p
                            </button>
                          ))}
                          <button
                            onClick={() => setResizeWidth(null)}
                            className={cn(
                              "text-xs px-2 py-1 rounded transition-colors",
                              resizeWidth === null
                                ? "bg-primary-solid text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                            )}
                          >
                            Original
                          </button>
                        </div>
                        <div className="text-xs text-caption">
                          {selectedFrame && (
                            <span>
                              Original: {selectedFrame.imageBitmap.width}x{selectedFrame.imageBitmap.height}
                              {resizeWidth && (
                                <span className="text-emphasis ml-2">
                                  → {resizeWidth}x{Math.round((selectedFrame.imageBitmap.height * resizeWidth) / selectedFrame.imageBitmap.width)}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  disabled={!file || isRunning || !extractor || allFrames.length === 0 || (method === "current-frame" && !selectedFrame)}
                  onClick={extractFrames}
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  {isRunning ? "Processing..." : 
                   method === "current-frame" ? "Extract Selected Frame" : 
                   method === "all-frames" ? "Extract All Frames" :
                   "Start Batch Extraction"}
                </Button>
                
                {selectedFrame && method !== "current-frame" && (
                  <Button
                    variant="outline"
                    onClick={() => downloadSingleFrame(selectedFrame)}
                    size="lg"
                  >
                    📷 Download Current Frame
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    setProgress(0);
                    setIsRunning(false);
                    setError(null);
                    setSelectedFrame(null);
                    setAllFrames([]);
                    if (extractor) {
                      extractor.dispose();
                    }
                    setExtractor(null);
                  }}
                >
                  Reset All
                </Button>
                
                {result && result.frames.length > 1 && (
                  <Button
                    variant="success"
                    onClick={() => downloadFramesAsZip(result.frames)}
                    size="lg"
                  >
                    📥 Download ZIP ({result.frames.length} frames)
                  </Button>
                )}
                
                {result && result.frames.length === 1 && (
                  <Button
                    variant="success"
                    onClick={() => downloadSingleFrame(result.frames[0])}
                    size="lg"
                  >
                    📷 Download Frame
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Processing & Results */}
              {isRunning && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-solid to-accent flex items-center justify-center text-white text-sm font-medium">
                  4
                </div>
                <Label className="text-base font-semibold">Processing</Label>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-body-secondary text-emphasis">Extracting frames, please wait...</div>
                <Progress value={progress} />
                <div className="text-xs text-caption">{progress}% complete</div>
              </div>
                </div>
              )}

          {error && (
            <Alert variant="destructive" title="Extraction Error">
              {error}
                </Alert>
              )}

          {result && !isRunning && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-success-foreground text-sm font-medium">
                  ✓
                </div>
                <Label className="text-base font-semibold text-success">Extraction Completed</Label>
              </div>
              
              <Alert variant="success" title="Success!">
                {result.frames.length === 1 
                  ? `Successfully extracted the selected frame at ${result.frames[0].time.toFixed(3)}s`
                  : method === "all-frames"
                    ? `Successfully extracted all ${result.frames.length} frames from the video`
                    : `Successfully extracted ${result.frames.length} frames using ${method.replace('-', ' ')} method`
                }
              </Alert>
              
              {/* Results Preview */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {result.frames.length === 1 ? "Extracted Frame:" : `Preview (first ${Math.min(8, result.frames.length)} frames):`}
                </Label>
                <div className={cn(
                  "grid gap-3",
                  result.frames.length === 1 
                    ? "grid-cols-1 max-w-2xl mx-auto" 
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                )}>
                  {result.frames.slice(0, result.frames.length === 1 ? 1 : 8).map((frame, index) => (
                    <div key={index} className="group relative bg-black rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-solid transition-all">
                      <div className={cn(
                        "flex items-center justify-center bg-black",
                        result.frames.length === 1 ? "min-h-[300px]" : "min-h-[80px] max-h-[120px]"
                      )}>
                        <canvas
                          ref={(canvas) => {
                            if (canvas && frame.imageBitmap) {
                              const aspectRatio = frame.imageBitmap.width / frame.imageBitmap.height;
                              const maxWidth = result.frames.length === 1 ? 600 : 150;
                              const maxHeight = result.frames.length === 1 ? 400 : 100;
                              
                              let displayWidth = frame.imageBitmap.width;
                              let displayHeight = frame.imageBitmap.height;
                              
                              // Scale down if too large, maintaining aspect ratio
                              if (displayWidth > maxWidth) {
                                displayWidth = maxWidth;
                                displayHeight = displayWidth / aspectRatio;
                              }
                              
                              if (displayHeight > maxHeight) {
                                displayHeight = maxHeight;
                                displayWidth = displayHeight * aspectRatio;
                              }
                              
                              canvas.width = displayWidth;
                              canvas.height = displayHeight;
                              canvas.style.width = `${displayWidth}px`;
                              canvas.style.height = `${displayHeight}px`;
                              
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.drawImage(frame.imageBitmap, 0, 0, displayWidth, displayHeight);
                              }
                            }
                          }}
                          className="block"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {result.frames.length === 1 
                          ? `Frame ${allFrames.findIndex(f => f === frame) + 1} • ${frame.time.toFixed(3)}s`
                          : `${frame.time.toFixed(2)}s`
                        }
                      </div>
                      {result.frames.length === 1 && (
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => downloadSingleFrame(frame)}
                            className="bg-primary-solid hover:bg-primary-solid/90 text-primary-foreground text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 shadow-lg"
                          >
                            📷 Download
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {result.frames.length > 8 && (
                    <div className="min-h-[80px] max-h-[120px] bg-muted/50 rounded-lg flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-muted-foreground font-medium">
                        +{result.frames.length - 8}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        more frames
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </>
  );
}


