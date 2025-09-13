"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

const useCases = [
  {
    category: "Content Creation",
    icon: "🎬",
    cases: [
      {
        title: "YouTube Thumbnail Extraction",
        description: "Extract the perfect frame from your videos to create eye-catching YouTube thumbnails that boost click-through rates.",
        benefits: ["Save time on thumbnail creation", "Find the most engaging moments", "Export in optimal resolution"],
        tools: ["Frame Extraction"],
        difficulty: "Easy",
        timeToImplement: "2 minutes"
      },
      {
        title: "Social Media Video Enhancement",
        description: "Double the frame rate of your social media videos for smoother playback on Instagram, TikTok, and Twitter.",
        benefits: ["Stand out with smooth videos", "Professional-looking content", "Better engagement rates"],
        tools: ["AI Interpolation"],
        difficulty: "Easy",
        timeToImplement: "5 minutes"
      },
      {
        title: "Creating GIFs from Videos",
        description: "Extract sequential frames from videos to create high-quality GIFs for messaging and social media.",
        benefits: ["Perfect loop points", "Optimal frame selection", "Size optimization"],
        tools: ["Frame Extraction"],
        difficulty: "Medium",
        timeToImplement: "10 minutes"
      }
    ]
  },
  {
    category: "Gaming & Esports",
    icon: "🎮",
    cases: [
      {
        title: "Gameplay Footage Enhancement",
        description: "Convert 30 FPS gameplay recordings to smooth 60 FPS for professional streaming and YouTube uploads.",
        benefits: ["Smoother gameplay viewing", "Professional quality", "Better viewer retention"],
        tools: ["AI Interpolation"],
        difficulty: "Easy",
        timeToImplement: "5 minutes"
      },
      {
        title: "Highlight Reel Creation",
        description: "Extract key frames from gaming sessions to create compelling highlight compilations and montages.",
        benefits: ["Capture epic moments", "Easy compilation creation", "Perfect timing extraction"],
        tools: ["Frame Extraction"],
        difficulty: "Medium",
        timeToImplement: "15 minutes"
      },
      {
        title: "Slow Motion Kill Cams",
        description: "Create cinematic slow-motion effects for gaming highlights using AI frame interpolation.",
        benefits: ["Dramatic effect", "Smooth slow motion", "Professional editing"],
        tools: ["AI Interpolation", "Frame Extraction"],
        difficulty: "Advanced",
        timeToImplement: "20 minutes"
      }
    ]
  },
  {
    category: "Professional Video Production",
    icon: "📹",
    cases: [
      {
        title: "Documentary Frame Analysis",
        description: "Extract frames for detailed analysis, storyboarding, and documentation in documentary production.",
        benefits: ["Detailed scene analysis", "Storyboard creation", "Archive documentation"],
        tools: ["Frame Extraction"],
        difficulty: "Medium",
        timeToImplement: "10 minutes"
      },
      {
        title: "Wedding Video Enhancement",
        description: "Enhance wedding videos with smoother motion for a more cinematic and professional appearance.",
        benefits: ["Cinematic quality", "Smooth motion", "Happy clients"],
        tools: ["AI Interpolation"],
        difficulty: "Easy",
        timeToImplement: "10 minutes"
      },
      {
        title: "Music Video Frame Extraction",
        description: "Extract frames for album covers, promotional materials, and behind-the-scenes content.",
        benefits: ["Marketing materials", "Social media content", "Album artwork"],
        tools: ["Frame Extraction"],
        difficulty: "Easy",
        timeToImplement: "5 minutes"
      }
    ]
  },
  {
    category: "Sports & Action",
    icon: "⚽",
    cases: [
      {
        title: "Sports Replay Enhancement",
        description: "Create smooth slow-motion replays from regular speed sports footage for analysis and highlights.",
        benefits: ["Detailed motion analysis", "Smooth replays", "Training insights"],
        tools: ["AI Interpolation"],
        difficulty: "Medium",
        timeToImplement: "10 minutes"
      },
      {
        title: "Action Sequence Breakdown",
        description: "Extract frame-by-frame sequences of athletic performances for coaching and technique analysis.",
        benefits: ["Technique improvement", "Performance analysis", "Training materials"],
        tools: ["Frame Extraction"],
        difficulty: "Easy",
        timeToImplement: "5 minutes"
      },
      {
        title: "Drone Footage Smoothing",
        description: "Enhance drone racing and aerial sports footage with AI interpolation for ultra-smooth viewing.",
        benefits: ["Cinematic quality", "Reduced motion blur", "Professional results"],
        tools: ["AI Interpolation"],
        difficulty: "Medium",
        timeToImplement: "15 minutes"
      }
    ]
  },
  {
    category: "Education & Training",
    icon: "📚",
    cases: [
      {
        title: "Tutorial Screenshot Creation",
        description: "Extract frames from video tutorials to create step-by-step documentation and guides.",
        benefits: ["Clear documentation", "Visual guides", "Easy reference"],
        tools: ["Frame Extraction"],
        difficulty: "Easy",
        timeToImplement: "5 minutes"
      },
      {
        title: "Scientific Video Analysis",
        description: "Extract frames from high-speed camera footage for scientific analysis and research documentation.",
        benefits: ["Precise analysis", "Research documentation", "Publication materials"],
        tools: ["Frame Extraction"],
        difficulty: "Advanced",
        timeToImplement: "20 minutes"
      },
      {
        title: "Online Course Enhancement",
        description: "Improve the quality of recorded lectures and demonstrations with smoother frame rates.",
        benefits: ["Better viewing experience", "Professional quality", "Student engagement"],
        tools: ["AI Interpolation"],
        difficulty: "Easy",
        timeToImplement: "10 minutes"
      }
    ]
  },
  {
    category: "Animation & VFX",
    icon: "✨",
    cases: [
      {
        title: "Stop Motion Smoothing",
        description: "Use AI interpolation to add intermediate frames to stop-motion animations for smoother playback.",
        benefits: ["Smoother animation", "Time savings", "Professional results"],
        tools: ["AI Interpolation"],
        difficulty: "Medium",
        timeToImplement: "15 minutes"
      },
      {
        title: "Animation Reference Extraction",
        description: "Extract key frames from reference videos for animation and rotoscoping work.",
        benefits: ["Accurate reference", "Key pose extraction", "Animation planning"],
        tools: ["Frame Extraction"],
        difficulty: "Easy",
        timeToImplement: "5 minutes"
      },
      {
        title: "Time-lapse Enhancement",
        description: "Create ultra-smooth time-lapse videos by interpolating frames between captures.",
        benefits: ["Smooth transitions", "Professional quality", "Reduced flicker"],
        tools: ["AI Interpolation"],
        difficulty: "Medium",
        timeToImplement: "10 minutes"
      }
    ]
  }
];

const useCaseSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Video Processing Use Cases - Frame Extraction & AI Interpolation",
  "description": "Discover how professionals use vframe.cc for video frame extraction and AI interpolation in various industries",
  "url": "https://vframe.cc/use-cases",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": useCases.flatMap((category, categoryIndex) => 
      category.cases.map((useCase, caseIndex) => ({
        "@type": "ListItem",
        "position": categoryIndex * 3 + caseIndex + 1,
        "item": {
          "@type": "HowTo",
          "name": useCase.title,
          "description": useCase.description
        }
      }))
    )
  }
};

export default function UseCasesPage() {
  useEffect(() => {
    trackPageView('Use Cases', '/use-cases');
  }, []);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(useCaseSchema)
        }}
      />

      <div className="w-full">
        <div className="grid gap-8 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-primary">
              Real-World Use Cases
            </h1>
            <p className="text-lg text-body">
              Discover how professionals and creators use our video frame extraction and AI interpolation tools 
              to enhance their workflows and create stunning content
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              {["Content Creation", "Gaming", "Sports", "Education", "Professional", "Animation"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-primary-solid/10 text-primary-solid rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <Card className="bg-gradient-to-br from-primary-solid/10 to-accent/10 border-primary-solid/30">
            <CardContent className="py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary-solid">1M+</p>
                  <p className="text-sm text-body-secondary">Frames Extracted</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-solid">50K+</p>
                  <p className="text-sm text-body-secondary">Videos Enhanced</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-solid">2x</p>
                  <p className="text-sm text-body-secondary">Frame Rate Boost</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-solid">95%</p>
                  <p className="text-sm text-body-secondary">User Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Use Case Categories */}
          {useCases.map((category) => (
            <div key={category.category} className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl font-bold heading-secondary">{category.category}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.cases.map((useCase) => (
                  <Card key={useCase.title} className="group hover:scale-105 transition-all duration-300 hover:shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary-solid transition-colors">
                        {useCase.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {useCase.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Benefits */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-body-secondary uppercase tracking-wider">Benefits</p>
                        <ul className="space-y-1">
                          {useCase.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm text-body flex items-start gap-2">
                              <span className="text-success mt-0.5">✓</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          {useCase.tools.map((tool) => (
                            <span key={tool} className="text-xs px-2 py-1 bg-muted rounded-full">
                              {tool === "Frame Extraction" ? "🎞️" : "⚡"} {tool}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-body-secondary">
                          <span className={`px-2 py-1 rounded-full ${
                            useCase.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                            useCase.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
                            'bg-accent/20 text-accent-foreground'
                          }`}>
                            {useCase.difficulty}
                          </span>
                          <span>⏱️ {useCase.timeToImplement}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Industry Testimonials */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">What Our Users Say</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-solid to-accent rounded-full mx-auto flex items-center justify-center text-2xl">
                    🎬
                  </div>
                  <p className="text-sm italic text-body">
                    "Frame extraction saves me hours creating thumbnails for my YouTube channel. 
                    The quality is perfect every time!"
                  </p>
                  <p className="text-xs text-body-secondary">- Content Creator</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary-solid rounded-full mx-auto flex items-center justify-center text-2xl">
                    🎮
                  </div>
                  <p className="text-sm italic text-body">
                    "AI interpolation transformed my 30fps gameplay into buttery smooth 60fps. 
                    My viewers love the quality!"
                  </p>
                  <p className="text-xs text-body-secondary">- Gaming Streamer</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-solid to-accent rounded-full mx-auto flex items-center justify-center text-2xl">
                    📹
                  </div>
                  <p className="text-sm italic text-body">
                    "Essential tool for my video production workflow. 
                    The frame extraction is precise and the AI interpolation is magic!"
                  </p>
                  <p className="text-xs text-body-secondary">- Video Producer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="text-center bg-gradient-to-br from-primary-solid/10 to-accent/10 border-primary-solid/30">
            <CardContent className="py-8 space-y-4">
              <h3 className="text-2xl font-semibold">Ready to Transform Your Videos?</h3>
              <p className="text-body-secondary max-w-2xl mx-auto">
                Join thousands of creators and professionals using our tools to enhance their video content
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
