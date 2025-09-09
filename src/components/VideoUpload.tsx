"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { trackEvent, trackButtonClick } from "@/lib/analytics";

export type VideoUploadProps = {
  value?: File | null;
  onChange?: (file: File | null) => void;
  className?: string;
};

export function VideoUpload({ value = null, onChange, className }: VideoUploadProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // 追踪视频上传事件
      try {
        trackEvent('video_uploaded', {
          file_name: file.name,
        });
      } catch (error) {
        trackEvent('video_upload_failed', {
          error_message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    onChange?.(file ?? null);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className={cn("grid gap-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4"
        className="hidden"
        onChange={handleSelect}
      />
      {value ? (
        <div 
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = '';
              inputRef.current.click();
            }
          }}
          className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 hover:border-primary-solid/50 transition-all duration-200 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-solid to-accent flex items-center justify-center">
            <span className="text-lg">🎬</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emphasis truncate">{value.name}</p>
            <p className="text-xs text-caption">
              {(value.size / (1024 * 1024)).toFixed(1)} MB • MP4 Video • Click to change
            </p>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = '';
              inputRef.current.click();
            }
          }}
          className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary-solid/50 hover:bg-muted/40 transition-all duration-200 bg-muted/20 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-solid to-accent flex items-center justify-center mb-3">
            <span className="text-xl">🎬</span>
          </div>
          <p className="text-sm text-emphasis">Click to Select Video File</p>
          <p className="text-xs text-caption mt-1">Currently supports <span className="text-code">MP4</span> format only</p>
        </div>
      )}
      <div className="flex gap-3">
        <Button 
          onClick={() => {
            trackButtonClick(
              value ? 'Change Video' : 'Select Video', 
              'Video Upload', 
              'Upload Component'
            );
            // Reset input value before clicking to ensure change event fires
            if (inputRef.current) {
              inputRef.current.value = '';
              inputRef.current.click();
            }
          }} 
          variant="primary" 
          size="md"
        >
          {value ? "Change Video" : "Select Video"}
        </Button>
        {value ? (
          <Button 
            variant="outline" 
            onClick={() => {
              trackButtonClick('Clear Video', 'Video Upload', 'Upload Component');
              onChange?.(null);
            }} 
            size="md"
          >
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}


