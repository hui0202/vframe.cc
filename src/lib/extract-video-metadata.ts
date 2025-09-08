export async function extractVideoMetadata(videoUrl: string): Promise<{
    duration: number;
    width: number;
    height: number;
    fps: number;
    totalFrames: number;
  }> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.crossOrigin = "anonymous";
      video.muted = true;
  
      video.addEventListener("loadedmetadata", async () => {
        const duration = video.duration;
        const width = video.videoWidth;
        const height = video.videoHeight;
  
        // Estimate FPS using requestVideoFrameCallback if available
        let fps = 30; // Default fallback
        let totalFrames = Math.round(duration * fps);
  
        if ("requestVideoFrameCallback" in video) {
          try {
            fps = await estimateFPS(video);
            totalFrames = Math.round(duration * fps);
          } catch {
            // Fallback to default if estimation fails
          }
        }
  
        resolve({
          duration,
          width,
          height,
          fps,
          totalFrames,
        });
  
        video.remove();
      });
  
      video.addEventListener("error", () => {
        resolve({
          duration: 0,
          width: 0,
          height: 0,
          fps: 30,
          totalFrames: 0,
        });
        video.remove();
      });
  
      video.src = videoUrl;
    });
  }
  
  async function estimateFPS(video: HTMLVideoElement): Promise<number> {
      return new Promise((resolve) => {
        let frameCount = 0;
        let lastTime = 0;
        let fps = 30;
    
        const countFrames = (now: DOMHighResTimeStamp, metadata: any) => {
          if (lastTime !== 0) {
            const timeDiff = now - lastTime;
            const currentFPS = 1000 / timeDiff;
    
            // Average FPS over multiple frames for accuracy
            if (frameCount > 0) {
              fps = (fps * frameCount + currentFPS) / (frameCount + 1);
            } else {
              fps = currentFPS;
            }
          }
    
          lastTime = now;
          frameCount++;
    
          // Sample enough frames to get a good estimate
          if (frameCount < 10 && video.currentTime < video.duration) {
            (video as any).requestVideoFrameCallback(countFrames);
          } else {
            // Return actual FPS value (rounded to 2 decimal places)
            resolve(Math.round(fps * 100) / 100);
          }
        };
    
        // Start sampling
        video.playsInline = true;
        video.play();
        (video as any).requestVideoFrameCallback(countFrames);
      });
    }
    
  