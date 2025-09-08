"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { VideoUpload } from "@/components/VideoUpload";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";

export default function InterpolatePage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [algo, setAlgo] = React.useState<string>("rife");
  const [isRunning, setIsRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [resultReady, setResultReady] = React.useState(false);

  return (
    <div className="grid gap-6 pb-8">
      <Card>
        <CardHeader>
          <CardTitle className="heading-secondary text-glow">Video Interpolation</CardTitle>
          <CardDescription className="text-body">Upload video, select interpolation algorithm and target frame rate (UI demo only).</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="grid gap-4">
              <div className="field">
                <Label htmlFor="video">Video File</Label>
                <VideoUpload value={file} onChange={setFile} />
                <p className="help-text">Recommend shorter videos for quick preview</p>
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
                <Input id="target-fps" type="number" min={24} step={1} defaultValue={60} />
              </div>

              <div className="field">
                <Label htmlFor="strength">Smoothness (0-1)</Label>
                <Input id="strength" type="number" min={0} max={1} step={0.1} defaultValue={0.8} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  disabled={!file || isRunning}
                  onClick={() => {
                    setIsRunning(true);
                    setProgress(0);
                    setResultReady(false);
                    const total = 20;
                    let current = 0;
                    const id = setInterval(() => {
                      current += 1;
                      setProgress(Math.floor((current / total) * 100));
                      if (current >= total) {
                        clearInterval(id);
                        setIsRunning(false);
                        setResultReady(true);
                      }
                    }, 150);
                  }}
                >
                  {isRunning ? "Processing..." : "Start Interpolation"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setProgress(0);
                    setIsRunning(false);
                    setResultReady(false);
                  }}
                >
                  Reset
                </Button>
              </div>

              {isRunning && (
                <div className="grid gap-2">
                  <div className="text-sm text-body-secondary text-emphasis">Interpolating, please wait...</div>
                  <Progress value={progress} />
                </div>
              )}

              {resultReady && !isRunning && (
                <Alert variant="success" title="Completed">
                  Interpolation completed, new video generated (demo).
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


