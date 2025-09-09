"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";
import {
  validateFileSize,
  getMaxFileSize,
  formatFileSize,
} from "@/lib/upload-config";
import { trackPageView, trackEvent } from "@/lib/analytics";

// Import structured data for interpolation
const interpolationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RIFE AI Video Interpolation Tool",
  "description": "Double video frame rates using RIFE AI interpolation technology. Enhance video smoothness from 24/30 FPS to 60/120 FPS.",
  "url": "https://vframe.cc/interpolate",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "RIFE AI interpolation technology",
    "Double video frame rates",
    "Enhance video smoothness",
    "Support for various video formats",
    "Real-time processing preview"
  ]
};

// LocalStorage keys
const STORAGE_KEY_PREFIX = 'vframe_interpolation_';
const STORAGE_KEY_HISTORY = `${STORAGE_KEY_PREFIX}history`;

// History item interface
interface HistoryItem {
  id: string;
  interpolatedVideoUrl: string;
  originalVideoUrl: string;
  timestamp: number;
  filename?: string;
}

// Helper functions for localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

const clearStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
};

export default function InterpolatePage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  const [isRunning, setIsRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [resultReady, setResultReady] = React.useState(true); // Set to true to show demo
  const [interpolatedVideoUrl, setInterpolatedVideoUrl] =
    React.useState<string>("https://cdn.vframe.cc/videos/1757418968939-fg2x0x1mmkq.mp4");
  const [error, setError] = React.useState<string>("");
  const [uploadProgress, setUploadProgress] = React.useState(0);
  
  // Demo video URLs - placeholders for now
  const [demoOriginalUrl] = React.useState<string>("https://cdn.vframe.cc/videos/1757418882492-8jlghu4oyln.mp4");
  const [demoInterpolatedUrl] = React.useState<string>("https://cdn.vframe.cc/videos/1757418968939-fg2x0x1mmkq.mp4");
  const [isUsingDemo, setIsUsingDemo] = React.useState(true);
  const [historyItems, setHistoryItems] = React.useState<HistoryItem[]>([]);

  // Load only history on component mount - always start with demo
  React.useEffect(() => {
    const savedHistory = loadFromStorage(STORAGE_KEY_HISTORY, []);
    setHistoryItems(savedHistory);
    
    // Always start in demo mode regardless of localStorage
    // This ensures first-time users always see the demo
  }, []);

  // Helper functions for history management
  const addToHistory = (item: Omit<HistoryItem, 'id'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
    };
    
    const updatedHistory = [newItem, ...historyItems].slice(0, 10); // Keep only latest 10 items
    setHistoryItems(updatedHistory);
    saveToStorage(STORAGE_KEY_HISTORY, updatedHistory);
  };

  const deleteFromHistory = (id: string) => {
    const updatedHistory = historyItems.filter(item => item.id !== id);
    setHistoryItems(updatedHistory);
    saveToStorage(STORAGE_KEY_HISTORY, updatedHistory);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInterpolatedVideoUrl(item.interpolatedVideoUrl);
    setResultReady(true);
    setIsUsingDemo(false);
    // No need to save to localStorage - just display the result
  };

  // Function to upload video file and get URL
  const uploadVideoFile = async (file: File): Promise<string> => {
    return await uploadWithPresignedUrl(file);
  };

  // 直接上传方法
  const uploadWithPresignedUrl = async (file: File): Promise<string> => {
    setUploadProgress(10);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder: "videos",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.statusText}`);
    }

    const { data } = await response.json();
    const { uploadUrl, fileUrl, method } = data;

    setUploadProgress(30);

    // Step 2: Upload file using PUT method with signed URL
    console.log("📤 PUT Upload Details:");
    console.log("URL:", uploadUrl);
    console.log("Method:", method);
    console.log("File:", file.name, file.size, "bytes");

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.size.toString(),
      },
      mode: "cors",
      credentials: "omit",
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    setUploadProgress(100);

    return fileUrl;
  };

  // Function to call the interpolation API
  const callInterpolationAPI = async (videoUrl: string) => {
    try {
      const response = await fetch("/api/interpolation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  // Main interpolation handler
  const handleInterpolation = async () => {
    if (!file && !videoUrl) {
      setError("Please select a video file or provide a video URL");
      return;
    }

    // Validate file size if file is selected
    if (file && !validateFileSize(file.size, file.type)) {
      const maxSize = getMaxFileSize(file.type);
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      setError(
        `File size (${formatFileSize(
          file.size
        )}) exceeds the limit of ${maxSizeMB}MB`
      );
      return;
    }

    // Switch from demo mode to user mode
    setIsUsingDemo(false);
    setIsRunning(true);
    setProgress(0);
    setResultReady(false);
    setError("");
    setInterpolatedVideoUrl("");

    try {
      // 追踪插帧开始事件
      trackEvent('interpolation_started', {
        is_demo: false,
      });
      let urlToProcess = videoUrl;

      // If file is selected, upload it first
      if (file) {
        setProgress(10);
        urlToProcess = await uploadVideoFile(file);
        setProgress(30);
      }

      // Call the interpolation API
      setProgress(50);
      const result = await callInterpolationAPI(urlToProcess);
      setProgress(90);

      // Handle the result
      let finalResultUrl = "";
      if (typeof result === "string") {
        finalResultUrl = result;
        setInterpolatedVideoUrl(result);
      } else if (result.interpolated_video_url) {
        finalResultUrl = result.interpolated_video_url;
        setInterpolatedVideoUrl(result.interpolated_video_url);
      } else {
        throw new Error("Invalid response format from API");
      }

      // Add to history only - no need to save current state
      addToHistory({
        interpolatedVideoUrl: finalResultUrl,
        originalVideoUrl: urlToProcess,
        timestamp: Date.now(),
        filename: file ? file.name : undefined,
      });

      setProgress(100);
      setResultReady(true);
      
      // 追踪插帧完成事件
      trackEvent('interpolation_completed', {
        is_demo: false,
      });
      
    } catch (error) {
      console.error("Interpolation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to interpolate video";
      setError(errorMessage);
      
      // 追踪插帧失败事件
      trackEvent('interpolation_failed', {
        error_message: errorMessage,
        is_demo: false,
      });
    } finally {
      setIsRunning(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      {/* Structured Data for Interpolate Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(interpolationSchema)
        }}
      />
      
      <div className="grid gap-6 pb-8">
      <Card>
        <CardHeader>
          <CardTitle className="heading-secondary text-glow">
            RIFE AI Video Interpolation - Double Frame Rate
          </CardTitle>
          <CardDescription className="text-body">
            Upload a video file or provide a video URL to double the frame rate using RIFE AI interpolation technology.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Upload Section */}
          <div className="grid gap-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full">
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('main-video-file-input')?.click()}
                className="flex items-center justify-center gap-3 px-6 py-3 text-base lg:w-64 shrink-0"
              >
                <span className="text-2xl">📁</span>
                Upload Video File
              </Button>
              
              <span className="text-sm text-body-secondary self-center">or</span>
              
              <div className="flex gap-3 flex-1">
                <Input
                  id="video-url"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    if (e.target.value) {
                      setFile(null); // Clear file when URL is provided
                      setIsUsingDemo(false); // Switch from demo mode
                      setResultReady(false); // Clear demo results
                      setInterpolatedVideoUrl(""); // Clear demo video URL
                    }
                  }}
                  className="flex-1"
                />
              </div>
            </div>
            
            <input
              id="main-video-file-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  setVideoUrl(""); // Clear URL when file is selected
                  setIsUsingDemo(false); // Switch from demo mode
                  setResultReady(false); // Clear demo results
                  setInterpolatedVideoUrl(""); // Clear demo video URL
                }
              }}
            />
          </div>

          {/* Video Comparison Section */}
            <div className="grid gap-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Original Video */}
              <div className="field flex-1">
                <Label>Original Video {isUsingDemo && <span className="text-xs text-body-secondary">(Demo)</span>}</Label>
                <div className="flex flex-col h-full">
                  {/* Video Container */}
                  <div className="flex-1">
                    {file ? (
                      <div className="relative group">
                      <video
                        controls
                        loop
                        autoPlay
                        muted
                        className="w-full max-h-96 rounded-lg border border-border object-contain"
                        src={URL.createObjectURL(file)}
                        ref={(video) => {
                          if (video) {
                            video.playbackRate = 0.5;
                          }
                        }}
                      >
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                             onClick={() => document.getElementById('main-video-file-input')?.click()}>
                          <div className="text-white text-center drop-shadow-lg">
                            <div className="text-2xl mb-2">📁</div>
                            <p className="text-sm font-medium">Click to change video</p>
                          </div>
                        </div>
                      </div>
                    ) : videoUrl ? (
                    <video
                      controls
                      loop
                      autoPlay
                      muted
                      className="w-full max-h-96 rounded-lg border border-border object-contain"
                      src={videoUrl}
                      ref={(video) => {
                        if (video) {
                          video.playbackRate = 0.5;
                        }
                      }}
                    >
                        Your browser does not support the video tag.
                      </video>
                    ) : isUsingDemo ? (
                      <div className="relative group">
                        <video
                          controls
                          loop
                          autoPlay
                          muted
                          className="w-full max-h-96 rounded-lg border border-border object-contain"
                          src={demoOriginalUrl}
                          ref={(video) => {
                            if (video) {
                              video.playbackRate = 0.5;
                            }
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                             onClick={() => document.getElementById('main-video-file-input')?.click()}>
                          <div className="text-white text-center drop-shadow-lg">
                            <div className="text-2xl mb-2">📁</div>
                            <p className="text-sm font-medium">Click to upload your video</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="w-full min-h-[300px] max-h-96 bg-surface rounded-lg border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-surface-hover transition-colors aspect-video"
                        onClick={() => document.getElementById('main-video-file-input')?.click()}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">📁</div>
                          <p className="text-body-secondary">Click to select video file</p>
                          <p className="text-xs text-body-secondary mt-1">or use the upload button above</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom Info Area - Fixed Height */}
                  <div className="mt-2 h-12 flex flex-col justify-start">
                {file && (
                    <p className="text-xs text-body-secondary">
                      Size: {formatFileSize(file.size)}
                      {!validateFileSize(file.size, file.type) && (
                        <span className="text-error ml-2">
                            ⚠️ File too large (max: {Math.round(getMaxFileSize(file.type) / (1024 * 1024))}MB)
                        </span>
                      )}
                    </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Interpolated Video */}
              <div className="field flex-1">
                <Label>Interpolated Video (2x Frame Rate) {isUsingDemo && <span className="text-xs text-body-secondary">(Demo)</span>}</Label>
                <div className="flex flex-col h-full">
                  {/* Video Container */}
                  <div className="flex-1">
                    {resultReady && !isRunning && interpolatedVideoUrl ? (
                      <video
                        controls
                        loop
                        autoPlay
                        muted
                        className="w-full max-h-96 rounded-lg border border-border object-contain"
                        src={isUsingDemo ? demoInterpolatedUrl : interpolatedVideoUrl}
                        ref={(video) => {
                          if (video) {
                            video.playbackRate = 0.5;
                          }
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full min-h-[300px] max-h-96 bg-surface rounded-lg border border-dashed border-border flex items-center justify-center aspect-video">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎬</div>
                          <p className="text-body-secondary">
                            {isRunning ? "Processing..." : "Interpolated video will appear here"}
                          </p>
                          <p className="text-xs text-body-secondary mt-1">
                            {isRunning ? "Please wait..." : "2x frame rate result"}
                </p>
              </div>
            </div>
                    )}
              </div>

                  {/* Bottom Action Area - Fixed Height */}
                  <div className="mt-2 h-12 flex items-start">
                    {resultReady && !isRunning && interpolatedVideoUrl && !isUsingDemo && (
                <Button
                        variant="outline"
                        size="sm"
                      onClick={() => {
                        // 追踪插帧视频下载事件
                        trackEvent('interpolated_video_downloaded', {
                          is_demo: isUsingDemo,
                        });
                        
                        const a = document.createElement("a");
                        a.href = interpolatedVideoUrl;
                        a.download = `interpolated-video-${Date.now()}.mp4`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                      >
                        Download
                </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
              </div>

          {/* Loading and Status Section */}
          <div className="grid gap-4">
              {isRunning && (
                <div className="grid gap-2">
                  {file && uploadProgress > 0 && uploadProgress < 100 && (
                    <>
                      <div className="text-sm text-body-secondary text-emphasis">
                        Uploading video...
                      </div>
                      <Progress value={uploadProgress} />
                    </>
                  )}
                  {(uploadProgress === 100 || !file) && (
                    <>
                      <div className="text-sm text-body-secondary text-emphasis">
                        Processing interpolation...
                      </div>
                      <Progress value={progress} />
                    </>
                  )}
                </div>
              )}

              {error && (
                <Alert variant="destructive" title="Error">
                  {error}
                </Alert>
              )}

            {resultReady && !isRunning && interpolatedVideoUrl && !isUsingDemo && (
                  <Alert variant="success" title="Completed">
                Interpolation completed successfully! Compare the videos above to see the difference.
                  </Alert>
            )}
          </div>


          {/* Controls Section */}
            <div className="grid gap-4">
            <div className="flex gap-3">
                <Button
                  disabled={(!file && !videoUrl) || isRunning}
                  onClick={handleInterpolation}
                size="lg"
                >
                  {isRunning ? "Processing..." : "Start Interpolation"}
                </Button>
              </div>

          </div>
        </CardContent>
      </Card>

      {/* History Section */}
      {historyItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="heading-secondary">
              Processing History
            </CardTitle>
            <CardDescription className="text-body">
              Your recent video interpolation results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium text-body">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-body">Source</th>
                    <th className="text-left p-3 text-sm font-medium text-body">Result</th>
                    <th className="text-left p-3 text-sm font-medium text-body">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyItems.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-surface transition-colors">
                      <td className="p-3 text-sm text-body-secondary">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 text-sm text-body">
                        {item.filename ? (
                          <span className="font-medium">{item.filename}</span>
                        ) : (
                          <span className="text-body-secondary">URL Input</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-12 bg-surface rounded border overflow-hidden">
                    <video
                              className="w-full h-full object-cover"
                              src={item.interpolatedVideoUrl}
                              muted
                              autoPlay
                              loop
                              playsInline
                            />
                          </div>
                          <span className="text-sm text-body-secondary">Interpolated</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                            onClick={() => loadFromHistory(item)}
                      >
                            Load
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // 追踪历史记录视频下载事件
                          trackEvent('interpolated_video_downloaded', {
                            is_demo: false,
                          });
                          
                          const a = document.createElement("a");
                              a.href = item.interpolatedVideoUrl;
                              a.download = `interpolated-${item.timestamp}.mp4`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                      >
                        Download
                      </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFromHistory(item.id)}
                            className="text-error hover:text-error"
                          >
                            Delete
                      </Button>
                    </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </CardContent>
      </Card>
      )}
      </div>
    </>
  );
}

