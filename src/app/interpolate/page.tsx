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
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { VideoUpload } from "@/components/VideoUpload";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";
import {
  validateFileSize,
  getMaxFileSize,
  formatFileSize,
} from "@/lib/upload-config";

export default function InterpolatePage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  const [algo, setAlgo] = React.useState<string>("rife");
  const [isRunning, setIsRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [resultReady, setResultReady] = React.useState(false);
  const [interpolatedVideoUrl, setInterpolatedVideoUrl] =
    React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [uploadProgress, setUploadProgress] = React.useState(0);

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

    setIsRunning(true);
    setProgress(0);
    setResultReady(false);
    setError("");
    setInterpolatedVideoUrl("");

    try {
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
      if (typeof result === "string") {
        setInterpolatedVideoUrl(result);
      } else if (result.interpolated_video_url) {
        setInterpolatedVideoUrl(result.interpolated_video_url);
      } else {
        throw new Error("Invalid response format from API");
      }

      setProgress(100);
      setResultReady(true);
    } catch (error) {
      console.error("Interpolation error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to interpolate video"
      );
    } finally {
      setIsRunning(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="grid gap-6 pb-8">
      <Card>
        <CardHeader>
          <CardTitle className="heading-secondary text-glow">
            Video Interpolation
          </CardTitle>
          <CardDescription className="text-body">
            Upload a video file or provide a video URL to generate interpolated
            frames using AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="grid gap-4">
              <div className="field">
                <Label htmlFor="video">Video File</Label>
                <VideoUpload value={file} onChange={setFile} />
                {file && (
                  <div className="mt-2">
                    <p className="text-xs text-body-secondary">
                      Size: {formatFileSize(file.size)}
                      {!validateFileSize(file.size, file.type) && (
                        <span className="text-error ml-2">
                          ⚠️ File too large (max:{" "}
                          {Math.round(
                            getMaxFileSize(file.type) / (1024 * 1024)
                          )}
                          MB)
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <p className="help-text">
                  Upload a video file to interpolate (max: 500MB for videos)
                </p>
              </div>

              <div className="field">
                <Label htmlFor="video-url">Or Video URL</Label>
                <Input
                  id="video-url"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <p className="help-text">
                  Provide a direct video URL instead of uploading
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="field">
                <Label>Interpolation Algorithm</Label>
                <Select
                  value={algo}
                  onChange={setAlgo}
                  options={[
                    { label: "RIFE (default)", value: "rife" },
                    { label: "FILM/DAIN (placeholder)", value: "dain" },
                  ]}
                />
              </div>

              <div className="field">
                <Label htmlFor="target-fps">Target FPS</Label>
                <Input
                  id="target-fps"
                  type="number"
                  min={24}
                  step={1}
                  defaultValue={60}
                />
              </div>

              <div className="field">
                <Label htmlFor="strength">Smoothness (0-1)</Label>
                <Input
                  id="strength"
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  defaultValue={0.8}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  disabled={(!file && !videoUrl) || isRunning}
                  onClick={handleInterpolation}
                >
                  {isRunning ? "Processing..." : "Start Interpolation"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setVideoUrl("");
                    setProgress(0);
                    setIsRunning(false);
                    setResultReady(false);
                    setError("");
                    setInterpolatedVideoUrl("");
                    setUploadProgress(0);
                  }}
                >
                  Reset
                </Button>
              </div>

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

              {resultReady && !isRunning && interpolatedVideoUrl && (
                <div className="grid gap-4">
                  <Alert variant="success" title="Completed">
                    Interpolation completed successfully!
                  </Alert>
                  <div className="field">
                    <Label>Interpolated Video</Label>
                    <video
                      controls
                      className="w-full max-w-md rounded-lg border border-border"
                      src={interpolatedVideoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(interpolatedVideoUrl, "_blank")
                        }
                      >
                        Open in New Tab
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
