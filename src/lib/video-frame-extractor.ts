import { DataStream, createFile} from 'mp4box';
import { extractVideoMetadata } from './extract-video-metadata';

export interface ExtractedVideoFrame {
  time: number;
  imageBitmap: ImageBitmap;
}

export class VideoFrameExtractor {
  private file: File;
  private videoUrl: string | null = null;
  private allFrames: ExtractedVideoFrame[] | null = null;
  private isExtracting = false;
  private extractionPromise: Promise<ExtractedVideoFrame[]> | null = null;

  constructor(file: File) {
    this.file = file;
  }

  private getVideoUrl(): string {
    if (!this.videoUrl) {
      this.videoUrl = URL.createObjectURL(this.file);
    }
    return this.videoUrl;
  }

  async extractAllFrames(
    onProgress?: (progress: number) => void,
    options?: {
      maxFrames?: number;
      skipFailedFrames?: boolean;
    }
  ): Promise<ExtractedVideoFrame[]> {
    if (this.allFrames) {
      onProgress?.(100);
      return this.allFrames;
    }

    if (this.isExtracting && this.extractionPromise) {
      return this.extractionPromise;
    }

    this.isExtracting = true;
    this.extractionPromise = this.performExtraction(onProgress, options);

    try {
      this.allFrames = await this.extractionPromise;
      return this.allFrames;
    } finally {
      this.isExtracting = false;
    }
  }

  private async performExtraction(
    onProgress?: (progress: number) => void,
    options?: {
      maxFrames?: number;
      skipFailedFrames?: boolean;
    }
  ): Promise<ExtractedVideoFrame[]> {
    const { skipFailedFrames = true } = options || {};
    const videoUrl = this.getVideoUrl();

    if (!window.VideoDecoder) {
      const metadata = await extractVideoMetadata(videoUrl);
      return extractAllVideoFrames(videoUrl, metadata, onProgress, {
        skipFailedFrames,
        frameTimeout: 3000,
      });
    }

    try {
      return await extractAllVideoFramesWithWebCodecsImpl(
        videoUrl,
        onProgress,
        options
      );
    } catch (error) {
      console.warn(
        "WebCodecs extraction failed, falling back to traditional method:",
        error
      );
      const metadata = await extractVideoMetadata(videoUrl);
      return extractAllVideoFrames(videoUrl, metadata, onProgress, {
        skipFailedFrames,
        frameTimeout: 3000,
      });
    }
  }

  async extractThumbnails(
    frameCount: number,
    videoDuration?: number
  ): Promise<ExtractedVideoFrame[]> {
    const allFrames = await this.extractAllFrames(undefined, {
      maxFrames: Math.min(frameCount * 3, 150),
      skipFailedFrames: true,
    });

    if (allFrames.length <= frameCount) {
      return allFrames;
    }

    const selectedFrames: ExtractedVideoFrame[] = [];
    const step = allFrames.length / frameCount;

    for (let i = 0; i < frameCount; i++) {
      const index = Math.floor(i * step);
      selectedFrames.push(allFrames[index]);
    }

    return selectedFrames;
  }

  async extractLastFrame(): Promise<ExtractedVideoFrame> {
    // Extract all frames to get the true last frame
    const allFrames = await this.extractAllFrames(undefined, {
      skipFailedFrames: true,
    });

    if (allFrames.length === 0) {
      throw new Error("Failed to extract any frames");
    }

    return allFrames.at(-1)!;
  }

  async extractFrameAtTime(
    targetTime: number
  ): Promise<ExtractedVideoFrame | null> {
    const allFrames = await this.extractAllFrames();

    if (allFrames.length === 0) {
      return null;
    }

    // Find closest frame using binary search
    let left = 0;
    let right = allFrames.length - 1;
    let closestFrame = allFrames[0];

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const frame = allFrames[mid];

      if (
        Math.abs(frame.time - targetTime) <
        Math.abs(closestFrame.time - targetTime)
      ) {
        closestFrame = frame;
      }

      if (frame.time < targetTime) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return closestFrame;
  }

  async extractFramesInRange(
    startTime: number,
    endTime: number
  ): Promise<ExtractedVideoFrame[]> {
    const allFrames = await this.extractAllFrames();
    return allFrames.filter(
      (frame) => frame.time >= startTime && frame.time <= endTime
    );
  }

  dispose(): void {
    if (this.allFrames) {
      this.allFrames.forEach((frame) => frame.imageBitmap.close());
      this.allFrames = null;
    }
    this.extractionPromise = null;
    
    // Clean up video URL
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
      this.videoUrl = null;
    }
  }

  get frameCount(): number {
    return this.allFrames?.length ?? 0;
  }

  get isReady(): boolean {
    return this.allFrames !== null;
  }

  get url(): string {
    return this.getVideoUrl();
  }

  get fileName(): string {
    return this.file.name;
  }

  get fileSize(): number {
    return this.file.size;
  }
}

// Factory function for creating VideoFrameExtractor
export function createVideoFrameExtractor(
  file: File
): VideoFrameExtractor {
  return new VideoFrameExtractor(file);
}

export function isBlackFrame(
  canvas: HTMLCanvasElement,
  threshold = 30
): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let totalBrightness = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    totalBrightness += r * 0.299 + g * 0.587 + b * 0.114;
  }

  const avgBrightness = totalBrightness / (pixelCount / 4);
  return avgBrightness < threshold;
}

export async function extractSingleFrameWithFallback(
  video: HTMLVideoElement,
  time: number,
  timeout = 3000,
  maxRetries = 3
): Promise<ImageBitmap> {
  let currentTime = time;
  let lastError: Error | null = null;

  const attemptExtraction = async (
    attemptNumber: number
  ): Promise<ImageBitmap> => {
    try {
      const imageBitmap = await extractSingleFrame(video, currentTime, timeout);

      if (attemptNumber === 1) {
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(imageBitmap, 0, 0);

          if (isBlackFrame(canvas)) {
            console.warn(
              `Black frame detected at time ${time}, retrying with earlier time`
            );
            imageBitmap.close();
            currentTime = Math.max(0, currentTime - 0.1);

            if (currentTime <= 0) {
              return extractSingleFrame(video, currentTime, timeout);
            }
            return attemptExtraction(attemptNumber + 1);
          }
        }
      }

      return imageBitmap;
    } catch (error) {
      lastError = error as Error;

      if (attemptNumber < maxRetries) {
        currentTime = Math.max(0, currentTime - 0.05);
        if (currentTime <= 0) {
          throw lastError;
        }
        console.warn(
          `Frame extraction failed at time ${
            currentTime + 0.05
          }, retrying with time ${currentTime}`
        );
        return attemptExtraction(attemptNumber + 1);
      }

      throw lastError;
    }
  };

  return attemptExtraction(1);
}

export function initializeVideoElement(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = url;

    const handleLoadedMetadata = () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      resolve(video);
    };

    const handleError = (error: Event) => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      reject(error);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);
  });
}

export function calculateTimePoints(duration: number, count: number): number[] {
  const timePoints: number[] = [];

  if (count === 1) {
    timePoints.push(duration / 2);
  } else {
    timePoints.push(0);

    if (count > 2) {
      const interval = duration / (count - 1);
      for (let i = 1; i < count - 1; i++) {
        timePoints.push(i * interval);
      }
    }

    timePoints.push(Math.max(0, duration - 0.01));
  }

  return timePoints;
}

export function extractSingleFrame(
  video: HTMLVideoElement,
  time: number,
  timeout = 3000
): Promise<ImageBitmap> {
  return new Promise<ImageBitmap>((resolve, reject) => {
    let timeoutId: NodeJS.Timeout;
    let hasResolved = false;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", handleError);
    };

    const handleSeeked = async () => {
      if (hasResolved) return;
      hasResolved = true;
      cleanup();

      try {
        const imageBitmap = await createImageBitmap(video);
        resolve(imageBitmap);
      } catch (error) {
        reject(error);
      }
    };

    const handleError = () => {
      if (hasResolved) return;
      hasResolved = true;
      cleanup();
      reject(new Error(`Video seek error at time ${time}`));
    };

    const handleTimeout = () => {
      if (hasResolved) return;
      hasResolved = true;
      cleanup();
      reject(new Error(`Frame extraction timeout at time ${time}`));
    };

    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError);
    timeoutId = setTimeout(handleTimeout, timeout);

    try {
      video.currentTime = time;
    } catch (error) {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
        reject(error);
      }
    }
  });
}

export async function extractVideoThumbnails(
  file: File,
  videoDuration: number,
  frameCount: number
): Promise<ExtractedVideoFrame[]> {
  const extractor = new VideoFrameExtractor(file);
  try {
    return await extractor.extractThumbnails(frameCount, videoDuration);
  } finally {
    // Don't dispose here as the caller might need the frames
  }
}

export async function extractLastFrame(
  file: File
): Promise<ExtractedVideoFrame> {
  const extractor = new VideoFrameExtractor(file);
  return await extractor.extractLastFrame();
}

export interface VideoMetadata {
  duration: number;
  fps: number;
  width?: number;
  height?: number;
}

const getExtradata = (mp4box: any, selectedTrackId?: number) => {
  try {
    if (!mp4box.moov?.traks?.length) {
      console.warn("No tracks found in MP4 file");
      return null;
    }

    const videoTrack = mp4box.moov.traks.find((trak: any) => {
      return trak.tkhd?.track_id === selectedTrackId;
    });

    if (!videoTrack?.mdia?.minf?.stbl?.stsd?.entries?.[0]) {
      console.warn(
        "No valid video track found for codec description extraction"
      );
      return null;
    }
    const entry = videoTrack.mdia.minf.stbl.stsd.entries[0];
    const box = entry.avcC ?? entry.hvcC ?? entry.vpcC ?? entry.av01C;

    if (box != null && box.write && typeof box.write === "function") {
      try {
        const stream = new DataStream(undefined, 0); // 1 for BIG_ENDIAN
        box.write(stream);
        const description = new Uint8Array(stream.buffer.slice(8));
        return description;
      } catch (error) {
        console.warn("Failed to write codec box:", error);
        return null;
      }
    }
  } catch (error) {
    console.warn("Failed to extract codec description:", error);
  }
  return null;
};

async function extractAllVideoFramesWithWebCodecsImpl(
  videoUrl: string,
  onProgress?: (progress: number) => void,
  options?: {
    maxFrames?: number;
    skipFailedFrames?: boolean;
  }
): Promise<ExtractedVideoFrame[]> {
  const { maxFrames, skipFailedFrames = true } = options || {};

  return new Promise(async (resolve, reject) => {
    let isResolved = false;
    let timeoutId: NodeJS.Timeout | null = null;
    const videoFrames: ExtractedVideoFrame[] = [];
    const rawFrames: Array<{ timestamp: number; imageBitmap: ImageBitmap }> =
      [];
    const processedTimestamps = new Set<number>();

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    let videoDuration = 0;
    let videoFrameRate = 30;

    const processAllFrames = () => {
      if (isResolved) return;

      rawFrames.sort((a, b) => a.timestamp - b.timestamp);
      const frameInterval = 1 / videoFrameRate;
      rawFrames.forEach((rawFrame, index) => {
        const frameTimeSeconds = Math.min(
          index * frameInterval,
          videoDuration - 0.01
        );

        videoFrames.push({
          time: frameTimeSeconds,
          imageBitmap: rawFrame.imageBitmap,
        });
      });

      resolveWithFrames();
    };

    const resolveWithFrames = () => {
      if (isResolved) return;
      isResolved = true;
      cleanup();
      resolve(videoFrames);
    };

    const rejectWithError = (error: any) => {
      if (isResolved) return;
      isResolved = true;
      cleanup();
      reject(error);
    };

    timeoutId = setTimeout(() => {
      console.warn(
        "Video frame extraction timed out, returning partial results"
      );
      if (rawFrames.length > 0) {
        console.log(`Processing ${rawFrames.length} frames before timeout`);
        processAllFrames();
      } else {
        rejectWithError(
          new Error("Video frame extraction timed out with no frames")
        );
      }
    }, 60000);

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const mp4box = createFile();

      let videoTrack: any = null;
      let videoDecoder: VideoDecoder | null = null;
      const allSamples: any[] = [];
      let expectedSampleCount = 0;
      mp4box.onReady = function (info: any) {
        try {
          videoTrack = info.videoTracks.find(
            (track: any) => track.type === "video"
          );

          if (!videoTrack) {
            throw new Error("No video track found in the file");
          }

          expectedSampleCount =
            maxFrames && maxFrames > 0
              ? Math.min(maxFrames, videoTrack.nb_samples)
              : videoTrack.nb_samples;

          videoDuration = videoTrack.duration / videoTrack.timescale;
          videoFrameRate = videoTrack.nb_samples / videoDuration;
          videoDecoder = new VideoDecoder({
            output: (webCodecsFrame) => {
              const frameTimestamp = webCodecsFrame.timestamp;

              if (processedTimestamps.has(frameTimestamp)) {
                console.warn(
                  `Duplicate frame timestamp ${frameTimestamp}, skipping`
                );
                webCodecsFrame.close();
                return;
              }
              processedTimestamps.add(frameTimestamp);

              createImageBitmap(webCodecsFrame)
                .then(async (img) => {
                  rawFrames.push({
                    timestamp: frameTimestamp,
                    imageBitmap: img,
                  });

                  const progress = Math.round(
                    (rawFrames.length / expectedSampleCount) * 100
                  );
                  onProgress?.(progress);

                  if (rawFrames.length >= expectedSampleCount) {
                    setTimeout(() => {
                      if (!isResolved) {
                        processAllFrames();
                      }
                    }, 100);
                  }

                  webCodecsFrame.close();
                })
                .catch((error) => {
                  console.warn("Failed to create image bitmap:", error);
                  webCodecsFrame.close();
                });
            },
            error: (err: DOMException) => {
              console.error("VideoDecoder error:", err);
              if (!skipFailedFrames) {
                rejectWithError(
                  new Error(`Video decoder error: ${err.message}`)
                );
              }
            },
          });

          const config: VideoDecoderConfig = {
            codec: videoTrack.codec,
            codedWidth: videoTrack.track_width,
            codedHeight: videoTrack.track_height,
          };

          const description = getExtradata(mp4box, videoTrack.id);
          if (description) {
            config.description = description;
          }

          videoDecoder.configure(config);

          if (maxFrames && maxFrames > 0) {
            mp4box.setExtractionOptions(videoTrack.id, "video", {
              nbSamples: maxFrames,
            });
          } else {
            mp4box.setExtractionOptions(videoTrack.id, "video");
          }

          mp4box.start();
        } catch (error) {
          console.error("Error in onReady:", error);
          rejectWithError(error);
        }
      };

      mp4box.onSamples = function (trackId: number, ref: any, samples: any[]) {
        try {
          if (videoTrack && videoTrack.id === trackId && videoDecoder) {
            allSamples.push(...samples);

            allSamples.sort((a, b) => a.cts - b.cts);

            for (const sample of samples) {
              try {
                const chunk = new EncodedVideoChunk({
                  type: sample.is_sync ? "key" : "delta",
                  timestamp: sample.cts,
                  duration: sample.duration || 0,
                  data: sample.data,
                });

                videoDecoder.decode(chunk);
              } catch (error) {
                console.warn("Failed to decode sample:", error);
                if (!skipFailedFrames) {
                  throw error;
                }
              }
            }

            if (allSamples.length >= expectedSampleCount) {
              console.log(
                `All ${allSamples.length} samples collected, flushing decoder`
              );
              mp4box.stop();

              videoDecoder
                .flush()
                .then(() => {
                  setTimeout(() => {
                    if (!isResolved) {
                      processAllFrames();
                    }
                  }, 1000);
                })
                .catch(rejectWithError);
            } else {
              mp4box.start();
            }
          }
        } catch (error) {
          console.error("Error in onSamples:", error);
          rejectWithError(error);
        }
      };

      mp4box.onError = function (error: any) {
        console.error("MP4Box error:", error);
        rejectWithError(new Error(`MP4Box error: ${error}`));
      };

      const mp4Buffer = buffer as any;
      mp4Buffer.fileStart = 0;
      mp4box.appendBuffer(mp4Buffer);
      mp4box.flush();
    } catch (error) {
      console.error("General error:", error);
      rejectWithError(error);
    }
  });
}

export async function extractAllVideoFrames(
  videoUrl: string,
  metadata: VideoMetadata,
  onProgress?: (progress: number) => void,
  options?: {
    frameTimeout?: number;
    skipFailedFrames?: boolean;
  }
): Promise<ExtractedVideoFrame[]> {
  const { frameTimeout = 3000, skipFailedFrames = true } = options || {};

  const { duration: videoDuration, fps: videoFrameRate } = metadata;

  if (!videoDuration || videoDuration <= 0) {
    throw new Error("Invalid video duration");
  }

  if (!videoFrameRate || videoFrameRate <= 0) {
    throw new Error("Invalid video frame rate");
  }

  const video = await initializeVideoElement(videoUrl);

  const totalFrames = Math.ceil(videoDuration * videoFrameRate);
  const frameInterval = 1 / videoFrameRate;
  const frames: ExtractedVideoFrame[] = [];
  const failedFrames: number[] = [];

  const frameIndices = Array.from({ length: totalFrames }, (_, i) => i);

  await frameIndices.reduce(async (previousPromise, frameIndex) => {
    await previousPromise;

    const time = Math.min(frameIndex * frameInterval, videoDuration - 0.01);

    try {
      const imageBitmap = await extractSingleFrame(video, time, frameTimeout);
      frames.push({ time, imageBitmap });
    } catch (error) {
      console.warn(
        `Frame extraction failed for frame ${frameIndex} at time ${time}:`,
        error
      );
      failedFrames.push(frameIndex);

      if (!skipFailedFrames) {
        throw new Error(
          `Failed to extract frame ${frameIndex}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    if (frameIndex % 30 === 0 || frameIndex === totalFrames - 1) {
      const progress = Math.round(((frameIndex + 1) / totalFrames) * 100);
      onProgress?.(progress);
    }
  }, Promise.resolve());

  if (failedFrames.length > 0) {
    const successRate =
      ((totalFrames - failedFrames.length) / totalFrames) * 100;
    console.log(
      `Frame extraction completed: ${
        frames.length
      }/${totalFrames} frames extracted (${successRate.toFixed(
        1
      )}% success rate)`
    );
    console.warn(
      `Failed frames: ${failedFrames.length} (indices: ${failedFrames
        .slice(0, 10)
        .join(", ")}${failedFrames.length > 10 ? "..." : ""})`
    );
  }

  return frames;
}

export function base64ToFile(base64DataUrl: string, filename: string): File {
  const base64String = base64DataUrl.split(",")[1];

  const binaryString = atob(base64String);

  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.codePointAt(i) || 0;
  }

  const mimeMatch = base64DataUrl.match(/data:([^;]+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

  const blob = new Blob([bytes], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

