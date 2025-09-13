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
  "name": "How to Extract a Single Frame from Video",
  "description": "Step-by-step guide to extract a specific frame from any video file using vframe.cc",
  "image": "https://vframe.cc/og-image.png",
  "totalTime": "PT3M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [],
  "tool": [{
    "@type": "HowToTool",
    "name": "vframe.cc Video Frame Extractor"
  }],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Upload Video",
      "text": "Upload your video file in MP4 format to the frame extraction tool",
      "url": "https://vframe.cc/extract"
    },
    {
      "@type": "HowToStep",
      "name": "Navigate to Frame",
      "text": "Use the timeline slider or frame navigation buttons to find your desired frame",
      "url": "https://vframe.cc/extract"
    },
    {
      "@type": "HowToStep",
      "name": "Extract Frame",
      "text": "Click 'Extract Selected Frame' to download the frame as an image",
      "url": "https://vframe.cc/extract"
    }
  ]
};

export default function ExtractSingleFrameTutorial() {
  useEffect(() => {
    trackPageView('Tutorial - Extract Single Frame', '/tutorials/extract-single-frame');
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
            <span className="text-emphasis">Extract Single Frame</span>
          </nav>

          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📷</span>
              <h1 className="text-3xl sm:text-4xl font-bold heading-primary">
                How to Extract a Single Frame from Video
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-success/20 text-success rounded-full">Beginner</span>
              <span className="text-body-secondary">⏱️ 3 min read</span>
              <span className="text-body-secondary">✅ No software installation required</span>
            </div>
            <p className="text-lg text-body">
              Learn how to extract any single frame from your video and save it as a high-quality image. 
              Perfect for creating thumbnails, capturing memorable moments, or analyzing specific video frames.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* When to Use */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">📌 When to Use Single Frame Extraction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-solid mt-1">✓</span>
                    <span><strong>Creating Thumbnails:</strong> Extract the perfect frame for video thumbnails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-solid mt-1">✓</span>
                    <span><strong>Capturing Moments:</strong> Save specific moments from videos as images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-solid mt-1">✓</span>
                    <span><strong>Video Analysis:</strong> Extract frames for detailed analysis or comparison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-solid mt-1">✓</span>
                    <span><strong>Creating Stills:</strong> Generate high-quality still images from video content</span>
                  </li>
                </ul>
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
                    Upload Your Video File
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body">
                    Navigate to the <Link href="/extract" className="text-primary-solid hover:underline">Frame Extraction Tool</Link> and upload your video file.
                  </p>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Supported Format:</strong> MP4 (more formats coming soon)</p>
                    <p className="text-sm"><strong>Maximum File Size:</strong> 100MB for free users</p>
                    <p className="text-sm"><strong>Tip:</strong> For best results, use high-quality source videos</p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-l-4 border-l-primary-solid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-solid text-white rounded-full flex items-center justify-center font-bold">2</span>
                    Navigate to Your Desired Frame
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body">
                    Once your video loads, use the preview controls to find the exact frame you want to extract:
                  </p>
                  <ul className="space-y-2 text-body ml-4">
                    <li>• <strong>Timeline Slider:</strong> Drag to quickly scrub through the video</li>
                    <li>• <strong>Frame Buttons:</strong> Use ◀ ▶ for precise frame-by-frame navigation</li>
                    <li>• <strong>Jump Controls:</strong> Use ⏪ ⏩ to skip 10 frames at a time</li>
                    <li>• <strong>Keyboard Shortcuts:</strong> Use arrow keys for quick navigation</li>
                  </ul>
                  <Alert variant="info" title="Pro Tip">
                    The frame counter and timestamp display help you identify the exact position in your video
                  </Alert>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-l-4 border-l-primary-solid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-solid text-white rounded-full flex items-center justify-center font-bold">3</span>
                    Configure Extraction Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body">
                    Choose your extraction preferences:
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">Extraction Method</p>
                      <p className="text-sm text-body-secondary">Select "Selected Frame" to extract only the current frame</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">Image Format</p>
                      <p className="text-sm text-body-secondary">Choose between PNG (lossless), JPG (compressed), or WebP (modern)</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">Resize Options (Optional)</p>
                      <p className="text-sm text-body-secondary">Set a custom width or keep original dimensions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="border-l-4 border-l-primary-solid">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-solid text-white rounded-full flex items-center justify-center font-bold">4</span>
                    Extract and Download
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body">
                    Click the "Extract Selected Frame" button to process and download your frame.
                  </p>
                  <div className="bg-success/10 border border-success/30 p-4 rounded-lg">
                    <p className="text-sm text-success font-medium mb-2">✅ Success!</p>
                    <p className="text-sm">Your frame will be automatically downloaded to your device in the chosen format.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tips and Best Practices */}
            <Card className="bg-gradient-to-br from-primary-solid/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-xl">💡 Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-1">1. Choose the Right Format</p>
                    <p className="text-sm text-body-secondary">Use PNG for maximum quality, JPG for smaller files, or WebP for the best balance</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">2. Frame Selection Precision</p>
                    <p className="text-sm text-body-secondary">Use keyboard arrow keys for frame-by-frame precision when timing is critical</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">3. Consider Resolution</p>
                    <p className="text-sm text-body-secondary">Extract at original resolution for best quality, resize only when necessary</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">4. Quick Download Option</p>
                    <p className="text-sm text-body-secondary">Use the quick "📷 Download" button in the preview for instant frame capture</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🎯 Common Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">YouTube Thumbnails</h4>
                    <p className="text-sm text-body-secondary">Extract eye-catching frames at 1920x1080 resolution for perfect YouTube thumbnails</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Social Media Posts</h4>
                    <p className="text-sm text-body-secondary">Capture memorable moments from videos for Instagram, Twitter, or Facebook posts</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Documentation</h4>
                    <p className="text-sm text-body-secondary">Extract frames from tutorial videos for step-by-step documentation</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Video Analysis</h4>
                    <p className="text-sm text-body-secondary">Extract specific frames for detailed analysis or comparison studies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="text-center bg-gradient-to-br from-primary-solid/10 to-accent/10 border-primary-solid/30">
              <CardContent className="py-8 space-y-4">
                <h3 className="text-xl font-semibold">Ready to Extract Your First Frame?</h3>
                <p className="text-body-secondary max-w-2xl mx-auto">
                  Start extracting frames from your videos now with our free online tool. No installation required!
                </p>
                <Link href="/extract">
                  <Button size="lg" className="mt-4">
                    🎬 Start Extracting Frames
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Related Tutorials */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">📚 Related Tutorials</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/tutorials/batch-extract-frames" className="block">
                  <Card className="hover:scale-105 transition-transform">
                    <CardContent className="py-4">
                      <h4 className="font-medium mb-1">Batch Extract Video Frames</h4>
                      <p className="text-sm text-body-secondary">Learn how to extract multiple frames at once</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/tutorials/extract-keyframes" className="block">
                  <Card className="hover:scale-105 transition-transform">
                    <CardContent className="py-4">
                      <h4 className="font-medium mb-1">Extract Keyframes Automatically</h4>
                      <p className="text-sm text-body-secondary">Automatically identify and extract important frames</p>
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
