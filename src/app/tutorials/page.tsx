"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

const tutorialCategories = [
  {
    category: "Frame Extraction Tutorials",
    icon: "🎞️",
    tutorials: [
      {
        title: "Extract Single Frame from Video",
        slug: "extract-single-frame",
        description: "Learn how to extract a specific frame from any video file",
        difficulty: "Beginner",
        duration: "3 min",
        icon: "📷"
      },
      {
        title: "Batch Extract Video Frames",
        slug: "batch-extract-frames",
        description: "Extract multiple frames using various strategies and intervals",
        difficulty: "Intermediate",
        duration: "5 min",
        icon: "🎬"
      },
      {
        title: "Extract Keyframes from Video",
        slug: "extract-keyframes",
        description: "Automatically identify and extract important keyframes",
        difficulty: "Advanced",
        duration: "7 min",
        icon: "🔑"
      }
    ]
  },
  {
    category: "Frame Interpolation Tutorials",
    icon: "⚡",
    tutorials: [
      {
        title: "Double Video Frame Rate with AI",
        slug: "double-frame-rate",
        description: "Use RIFE AI to convert 30fps videos to smooth 60fps",
        difficulty: "Beginner",
        duration: "4 min",
        icon: "🚀"
      },
      {
        title: "Enhance Slow Motion Videos",
        slug: "enhance-slow-motion",
        description: "Create ultra-smooth slow motion effects with frame interpolation",
        difficulty: "Intermediate",
        duration: "6 min",
        icon: "🎥"
      },
      {
        title: "Fix Low FPS Gameplay Videos",
        slug: "fix-low-fps-gaming",
        description: "Improve gaming footage quality by increasing frame rates",
        difficulty: "Advanced",
        duration: "8 min",
        icon: "🎮"
      }
    ]
  }
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://vframe.cc"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tutorials",
      "item": "https://vframe.cc/tutorials"
    }
  ]
};

export default function TutorialsPage() {
  useEffect(() => {
    trackPageView('Tutorials Hub', '/tutorials');
  }, []);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      <div className="w-full">
        <div className="grid gap-8 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-primary">
              Video Processing Tutorials
            </h1>
            <p className="text-lg text-body max-w-3xl mx-auto">
              Master video frame extraction and AI interpolation with our comprehensive step-by-step guides
            </p>
          </div>

          {/* Quick Start Section */}
          <Card className="bg-gradient-to-br from-primary-solid/10 to-accent/10 border-primary-solid/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-emphasis">New to Frame Extraction?</h3>
                  <p className="text-sm text-body-secondary">
                    Start with our beginner-friendly guide to extracting single frames from videos.
                  </p>
                  <Link href="/tutorials/extract-single-frame">
                    <Button size="sm" className="w-full sm:w-auto">
                      Start Extracting Frames →
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-emphasis">Want Smoother Videos?</h3>
                  <p className="text-sm text-body-secondary">
                    Learn how to double your video frame rate using AI interpolation technology.
                  </p>
                  <Link href="/tutorials/double-frame-rate">
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">
                      Try AI Interpolation →
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Categories */}
          {tutorialCategories.map((category) => (
            <div key={category.category} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl font-bold heading-secondary">{category.category}</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tutorials.map((tutorial) => (
                  <Link 
                    key={tutorial.slug} 
                    href={`/tutorials/${tutorial.slug}`}
                    className="block group"
                  >
                    <Card className="h-full hover:scale-105 transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <span className="text-2xl">{tutorial.icon}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              tutorial.difficulty === 'Beginner' ? 'bg-success/20 text-success' :
                              tutorial.difficulty === 'Intermediate' ? 'bg-warning/20 text-warning' :
                              'bg-accent/20 text-accent-foreground'
                            }`}>
                              {tutorial.difficulty}
                            </span>
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-3 group-hover:text-primary-solid transition-colors">
                          {tutorial.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {tutorial.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-xs text-body-secondary">
                          <span>⏱️ {tutorial.duration} read</span>
                          <span className="text-primary-solid group-hover:translate-x-1 transition-transform">
                            Learn more →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <Card className="text-center py-8">
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold heading-secondary">
                Ready to Start Processing Videos?
              </h3>
              <p className="text-body max-w-2xl mx-auto">
                Apply what you've learned with our professional video processing tools
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link href="/extract">
                  <Button size="lg">
                    🎬 Extract Frames Now
                  </Button>
                </Link>
                <Link href="/interpolate">
                  <Button size="lg" variant="outline">
                    ⚡ Try Interpolation
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
