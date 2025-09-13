"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const frameExtractionFeatures = [
  {
    icon: "📷",
    title: "Single Frame Extraction",
    description: "Extract any specific frame from your video with precise navigation controls",
    highlights: ["Frame-by-frame navigation", "Timeline scrubbing", "Keyboard shortcuts"],
    status: "available"
  },
  {
    icon: "🎞️",
    title: "Batch Frame Extraction",
    description: "Extract multiple frames at once using various intelligent strategies",
    highlights: ["All frames extraction", "Every N frames", "Time-based intervals"],
    status: "available"
  },
  {
    icon: "🔑",
    title: "Keyframe Detection",
    description: "Automatically identify and extract important scene changes",
    highlights: ["Scene detection", "Motion analysis", "Smart selection"],
    status: "available"
  },
  {
    icon: "🎯",
    title: "Fixed FPS Extraction",
    description: "Extract frames at a specific frame rate for consistent output",
    highlights: ["Custom FPS settings", "Uniform intervals", "Predictable output"],
    status: "available"
  },
  {
    icon: "📐",
    title: "Custom Resolution Export",
    description: "Resize extracted frames to your desired dimensions",
    highlights: ["Maintain aspect ratio", "Common presets", "Custom dimensions"],
    status: "available"
  },
  {
    icon: "🖼️",
    title: "Multiple Export Formats",
    description: "Export frames in PNG, JPG, or WebP formats",
    highlights: ["Lossless PNG", "Compressed JPG", "Modern WebP"],
    status: "available"
  }
];

const interpolationFeatures = [
  {
    icon: "🤖",
    title: "RIFE AI Technology",
    description: "State-of-the-art Real-Time Intermediate Flow Estimation for smooth interpolation",
    highlights: ["Advanced AI model", "Natural motion", "Artifact reduction"],
    status: "available"
  },
  {
    icon: "⚡",
    title: "2x Frame Rate Boost",
    description: "Double your video frame rate from 30fps to 60fps instantly",
    highlights: ["30→60 FPS", "24→48 FPS", "Automatic detection"],
    status: "available"
  },
  {
    icon: "🎬",
    title: "Slow Motion Creation",
    description: "Create cinematic slow-motion effects without high-speed cameras",
    highlights: ["Smooth slow-mo", "Temporal consistency", "Professional quality"],
    status: "available"
  },
  {
    icon: "🔄",
    title: "Real-Time Preview",
    description: "Preview interpolated results side-by-side with original",
    highlights: ["Before/after view", "Instant comparison", "Quality check"],
    status: "available"
  },
  {
    icon: "☁️",
    title: "Cloud Processing",
    description: "Fast cloud-based processing without local GPU requirements",
    highlights: ["No GPU needed", "Fast processing", "Scalable performance"],
    status: "available"
  },
  {
    icon: "📊",
    title: "Batch Processing",
    description: "Process multiple videos in sequence for efficient workflow",
    highlights: ["Queue system", "Bulk processing", "Time saving"],
    status: "coming-soon"
  }
];

const comparisonData = [
  {
    feature: "Frame Extraction Methods",
    vframe: ["Single", "Batch", "Every N", "Time Interval", "Fixed FPS", "Keyframes"],
    competitors: ["Limited options", "Basic extraction only"],
    highlight: true
  },
  {
    feature: "AI Interpolation",
    vframe: ["RIFE AI", "2x Frame Rate", "Cloud Processing"],
    competitors: ["Not available", "Requires expensive software"],
    highlight: true
  },
  {
    feature: "Export Formats",
    vframe: ["PNG", "JPG", "WebP", "ZIP Archive"],
    competitors: ["Limited formats"],
    highlight: false
  },
  {
    feature: "Processing Speed",
    vframe: ["Real-time preview", "Fast extraction", "Cloud acceleration"],
    competitors: ["Slower processing", "Local only"],
    highlight: true
  },
  {
    feature: "File Size Limit",
    vframe: ["100MB free", "Larger with account"],
    competitors: ["Varies", "Often limited"],
    highlight: false
  },
  {
    feature: "Price",
    vframe: ["Free with limits", "Affordable plans"],
    competitors: ["Expensive software", "Subscription required"],
    highlight: true
  },
  {
    feature: "Installation Required",
    vframe: ["No", "Browser-based"],
    competitors: ["Yes", "Heavy software"],
    highlight: true
  },
  {
    feature: "Platform Support",
    vframe: ["Windows", "Mac", "Linux", "Mobile"],
    competitors: ["Limited platforms"],
    highlight: true
  }
];

const featuresSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "vframe.cc - Video Frame Processing Suite",
  "description": "Professional video frame extraction and AI interpolation tools",
  "applicationCategory": "MultimediaApplication",
  "featureList": [
    ...frameExtractionFeatures.map(f => f.title),
    ...interpolationFeatures.map(f => f.title)
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available with premium options"
  }
};

export default function FeaturesPage() {
  useEffect(() => {
    trackPageView('Features', '/features');
  }, []);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(featuresSchema)
        }}
      />

      <div className="w-full">
        <div className="grid gap-8 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-primary">
              Powerful Features for Video Processing
            </h1>
            <p className="text-lg text-body">
              Everything you need to extract frames and enhance videos with AI interpolation. 
              Professional tools made simple and accessible.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="py-6">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-body-secondary">Cloud-powered processing for instant results</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-6">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">Precision Tools</h3>
                <p className="text-sm text-body-secondary">Frame-accurate extraction with multiple strategies</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-6">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-semibold mb-2">AI Powered</h3>
                <p className="text-sm text-body-secondary">State-of-the-art RIFE AI for smooth interpolation</p>
              </CardContent>
            </Card>
          </div>

          {/* Frame Extraction Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎞️</span>
              <h2 className="text-2xl font-bold heading-secondary">Frame Extraction Features</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frameExtractionFeatures.map((feature) => (
                <Card key={feature.title} className="group hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{feature.icon}</span>
                      {feature.status === 'available' && (
                        <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-3">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {feature.highlights.map((highlight, index) => (
                        <li key={index} className="text-xs text-body-secondary flex items-start gap-2">
                          <span className="text-primary-solid mt-0.5">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Interpolation Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <h2 className="text-2xl font-bold heading-secondary">AI Interpolation Features</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interpolationFeatures.map((feature) => (
                <Card key={feature.title} className={cn(
                  "group hover:scale-105 transition-all duration-300",
                  feature.status === 'coming-soon' && "opacity-75"
                )}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{feature.icon}</span>
                      {feature.status === 'available' ? (
                        <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full">
                          Available
                        </span>
                      ) : feature.status === 'coming-soon' && (
                        <span className="text-xs px-2 py-1 bg-warning/20 text-warning rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-3">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {feature.highlights.map((highlight, index) => (
                        <li key={index} className="text-xs text-body-secondary flex items-start gap-2">
                          <span className="text-primary-solid mt-0.5">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Why Choose vframe.cc?</CardTitle>
              <CardDescription className="text-center">
                See how we compare to traditional video editing software
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium">Feature</th>
                      <th className="text-left p-3 font-medium text-primary-solid">vframe.cc</th>
                      <th className="text-left p-3 font-medium text-body-secondary">Traditional Software</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className={cn(
                        "border-b border-border",
                        row.highlight && "bg-primary-solid/5"
                      )}>
                        <td className="p-3 font-medium text-sm">{row.feature}</td>
                        <td className="p-3">
                          {row.vframe.map((item, i) => (
                            <span key={i} className="text-sm text-success flex items-start gap-1">
                              <span>✓</span> {item}
                              {i < row.vframe.length - 1 && <br />}
                            </span>
                          ))}
                        </td>
                        <td className="p-3">
                          {row.competitors.map((item, i) => (
                            <span key={i} className="text-sm text-body-secondary">
                              {item}
                              {i < row.competitors.length - 1 && <br />}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">📋 Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-body-secondary">Supported Formats</span>
                  <span className="text-sm font-medium">MP4, WebM, MOV</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-body-secondary">Max Resolution</span>
                  <span className="text-sm font-medium">4K (3840×2160)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-body-secondary">Processing Speed</span>
                  <span className="text-sm font-medium">Real-time to 2x</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-body-secondary">Export Quality</span>
                  <span className="text-sm font-medium">Lossless available</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-body-secondary">API Available</span>
                  <span className="text-sm font-medium">Coming Soon</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🔒 Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-medium">Secure Upload</p>
                    <p className="text-xs text-body-secondary">SSL encrypted file transfers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-medium">Auto-deletion</p>
                    <p className="text-xs text-body-secondary">Files deleted after processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-medium">No Storage</p>
                    <p className="text-xs text-body-secondary">We don't keep your videos</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-medium">GDPR Compliant</p>
                    <p className="text-xs text-body-secondary">Full data protection compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="text-center bg-gradient-to-br from-primary-solid/10 to-accent/10 border-primary-solid/30">
            <CardContent className="py-8 space-y-4">
              <h3 className="text-2xl font-semibold">Experience All Features Free</h3>
              <p className="text-body-secondary max-w-2xl mx-auto">
                Start using our professional video processing tools today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/extract">
                  <Button size="lg">
                    🎬 Try Frame Extraction
                  </Button>
                </Link>
                <Link href="/interpolate">
                  <Button size="lg" variant="outline">
                    ⚡ Try AI Interpolation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}
