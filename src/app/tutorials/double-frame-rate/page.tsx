"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

const tutorialSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Double Video Frame Rate with AI Interpolation",
  "description": "Learn how to convert 30fps videos to smooth 60fps using RIFE AI interpolation technology",
  "image": process.env.NEXT_PUBLIC_BASE_URL + "/og-image.png",
  "totalTime": "PT4M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [],
  "tool": [{
    "@type": "HowToTool",
    "name": "vframe.cc RIFE AI Interpolation Tool"
  }],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Upload Video",
      "text": "Upload your video file or provide a video URL",
      "url": process.env.NEXT_PUBLIC_BASE_URL + "/interpolate"
    },
    {
      "@type": "HowToStep",
      "name": "Process with AI",
      "text": "Click 'Start Interpolation' to process your video with RIFE AI",
      "url": process.env.NEXT_PUBLIC_BASE_URL + "/interpolate"
    },
    {
      "@type": "HowToStep",
      "name": "Download Result",
      "text": "Download your enhanced video with doubled frame rate",
      "url": process.env.NEXT_PUBLIC_BASE_URL + "/interpolate"
    }
  ]
};

export default function DoubleFrameRateTutorial() {
  useEffect(() => {
    trackPageView('Tutorial - Double Frame Rate', '/tutorials/double-frame-rate');
  }, []);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tutorialSchema)
        }}
      />

      <div className="w-full">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-body-secondary mb-6">
            <Link href="/" className="hover:text-primary-solid transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tutorials" className="hover:text-primary-solid transition-colors">Tutorials</Link>
            <span>/</span>
            <span className="text-emphasis">Double Frame Rate with AI</span>
          </nav>

          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🚀</span>
              <h1 className="text-3xl sm:text-4xl font-bold heading-primary">
                How to Double Video Frame Rate with AI
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-success/20 text-success rounded-full">Beginner</span>
              <span className="text-body-secondary">⏱️ 4 min read</span>
              <span className="text-body-secondary">🤖 Powered by RIFE AI</span>
            </div>
            <p className="text-lg text-body">
              Transform your 24/30 FPS videos into ultra-smooth 48/60 FPS masterpieces using advanced RIFE AI interpolation technology. 
              Perfect for creating cinematic slow-motion effects, improving gaming footage, and enhancing video quality.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* What is Frame Interpolation */}
            <Card className="bg-gradient-to-br from-primary-solid/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-xl">🎯 What is AI Frame Interpolation?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body">
                  Frame interpolation is a technique that uses artificial intelligence to generate new frames between existing ones, 
                  effectively increasing the frame rate of your video. Our tool uses RIFE (Real-Time Intermediate Flow Estimation), 
                  a state-of-the-art AI model that creates smooth, natural-looking intermediate frames.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <p className="font-medium text-sm mb-1">Before: 30 FPS</p>
                    <p className="text-xs text-body-secondary">Standard video frame rate, may appear choppy</p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-lg border border-success/30">
                    <p className="font-medium text-sm mb-1">After: 60 FPS</p>
                    <p className="text-xs text-success">Smooth, fluid motion with doubled frames</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">✨ Benefits of Frame Rate Doubling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <p className="font-medium mb-1">Gaming Videos</p>
                      <p className="text-sm text-body-secondary">Make gameplay footage smoother and more professional</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎬</span>
                    <div>
                      <p className="font-medium mb-1">Slow Motion</p>
                      <p className="text-sm text-body-secondary">Create buttery-smooth slow-motion effects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📹</span>
                    <div>
                      <p className="font-medium mb-1">Old Footage</p>
                      <p className="text-sm text-body-secondary">Modernize legacy videos with higher frame rates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🏃</span>
                    <div>
                      <p className="font-medium mb-1">Sports Videos</p>
                      <p className="text-sm text-body-secondary">Capture fast action with enhanced smoothness</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step by Step Guide */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold heading-secondary">Step-by-Step Guide</h2>
              
              {/* Step 1 */}
              <Card className="border-l-4 border-l-primary-solid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-solid text-white rounded-full flex items-center justify-center font-bold">1</span>
                    Prepare Your Video
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body">
                    Navigate to the <Link href="/interpolate" className="text-primary-solid hover:underline">AI Interpolation Tool</Link> and prepare your video for upload.
                  </p>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Supported Formats:</strong> MP4, WebM, MOV</p>
                    <p className="text-sm"><strong>Recommended Duration:</strong> Under 60 seconds for best results</p>
                    <p className="text-sm"><strong>Input Frame Rate:</strong> 24-30 FPS works best</p>
                  </div>
                  <Alert variant="info" title="Demo Available">
                    Try our demo video first to see the interpolation effect before uploading your own
                  </Alert>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-l-4 border-l-primary-solid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-solid text-white rounded-full flex items-center justify-center font-bold">2</span>
                    Upload Your Video
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body">
                    You have two options for providing your video:
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">📁 Direct Upload</p>
                      <p className="text-sm text-body-secondary">Click "Upload Video File" and select your video from your device</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">🔗 URL Input</p>
                      <p className="text-sm text-body-secondary">Paste a direct video URL if your video is already hosted online</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-l-4 border-l-primary-solid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-solid text-white rounded-full flex items-center justify-center font-bold">3</span>
                    Start AI Processing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body">
                    Click the "Start Interpolation" button to begin the AI processing:
                  </p>
                  <ul className="space-y-2 text-body ml-4">
                    <li>• The AI will analyze your video frames</li>
                    <li>• Generate intermediate frames using RIFE technology</li>
                    <li>• Compile the enhanced video with doubled frame rate</li>
                  </ul>
                  <div className="bg-warning/10 border border-warning/30 p-3 rounded-lg">
                    <p className="text-sm text-warning font-medium">⏱️ Processing Time</p>
                    <p className="text-sm text-body-secondary mt-1">
                      Processing typically takes 30 seconds to 2 minutes depending on video length and resolution
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="border-l-4 border-l-primary-solid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-solid text-white rounded-full flex items-center justify-center font-bold">4</span>
                    Preview and Download
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body">
                    Once processing is complete:
                  </p>
                  <ul className="space-y-2 text-body ml-4">
                    <li>• Preview the interpolated video side-by-side with the original</li>
                    <li>• Notice the smoother motion and increased fluidity</li>
                    <li>• Click "Download" to save the enhanced video</li>
                  </ul>
                  <div className="bg-success/10 border border-success/30 p-4 rounded-lg">
                    <p className="text-sm text-success font-medium mb-2">✅ Success!</p>
                    <p className="text-sm">Your video now has double the frame rate with smooth AI-generated intermediate frames</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🔬 How RIFE AI Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body">
                  RIFE (Real-Time Intermediate Flow Estimation) is a cutting-edge AI model that creates intermediate frames by:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-primary-solid font-bold">1.</span>
                    <div>
                      <p className="font-medium">Motion Analysis</p>
                      <p className="text-sm text-body-secondary">Analyzes motion patterns between consecutive frames</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary-solid font-bold">2.</span>
                    <div>
                      <p className="font-medium">Flow Estimation</p>
                      <p className="text-sm text-body-secondary">Calculates optical flow to understand object movement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary-solid font-bold">3.</span>
                    <div>
                      <p className="font-medium">Frame Synthesis</p>
                      <p className="text-sm text-body-secondary">Generates new frames that maintain visual consistency</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary-solid font-bold">4.</span>
                    <div>
                      <p className="font-medium">Temporal Smoothing</p>
                      <p className="text-sm text-body-secondary">Ensures smooth transitions between all frames</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card className="bg-gradient-to-br from-primary-solid/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-xl">💡 Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium mb-1">✓ Use Stable Footage</p>
                    <p className="text-sm text-body-secondary">Videos with less camera shake produce better interpolation results</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">✓ Optimal Resolution</p>
                    <p className="text-sm text-body-secondary">1080p or lower resolution videos process faster with excellent quality</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">✓ Avoid Rapid Cuts</p>
                    <p className="text-sm text-body-secondary">Continuous shots work better than videos with frequent scene changes</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">✓ Good Lighting</p>
                    <p className="text-sm text-body-secondary">Well-lit videos produce cleaner interpolated frames</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🎯 Perfect For These Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Gaming Content</h4>
                    <p className="text-sm text-body-secondary">Convert 30 FPS gameplay recordings to smooth 60 FPS for YouTube</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Slow Motion Sports</h4>
                    <p className="text-sm text-body-secondary">Create professional slow-motion replays from regular speed footage</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Animation Enhancement</h4>
                    <p className="text-sm text-body-secondary">Smooth out hand-drawn or stop-motion animations</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Vintage Film Restoration</h4>
                    <p className="text-sm text-body-secondary">Modernize old films by increasing their frame rates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="text-center bg-gradient-to-br from-primary-solid/10 to-accent/10 border-primary-solid/30">
              <CardContent className="py-8 space-y-4">
                <h3 className="text-xl font-semibold">Ready to Double Your Video Frame Rate?</h3>
                <p className="text-body-secondary max-w-2xl mx-auto">
                  Experience the magic of AI frame interpolation. Transform your videos into smooth, professional-looking content!
                </p>
                <Link href="/interpolate">
                  <Button size="lg" className="mt-4">
                    ⚡ Start AI Interpolation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Related Tutorials */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">📚 Related Tutorials</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/tutorials/enhance-slow-motion" className="block">
                  <Card className="hover:scale-105 transition-transform">
                    <CardContent className="py-4">
                      <h4 className="font-medium mb-1">Enhance Slow Motion Videos</h4>
                      <p className="text-sm text-body-secondary">Create ultra-smooth slow motion effects</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/tutorials/fix-low-fps-gaming" className="block">
                  <Card className="hover:scale-105 transition-transform">
                    <CardContent className="py-4">
                      <h4 className="font-medium mb-1">Fix Low FPS Gaming Videos</h4>
                      <p className="text-sm text-body-secondary">Improve gaming footage quality</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
