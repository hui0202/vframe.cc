"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { trackPageView } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const faqCategories = [
  {
    category: "General Questions",
    icon: "💭",
    questions: [
      {
        question: "What is vframe.cc?",
        answer: "vframe.cc is a professional online video processing platform that offers two main services: video frame extraction and AI-powered frame interpolation. You can extract individual frames or batches of frames from videos, and use AI to double your video frame rates for smoother playback."
      },
      {
        question: "Is vframe.cc free to use?",
        answer: "Yes! vframe.cc offers a free tier that allows you to process videos up to 100MB. You can extract frames and use AI interpolation without any payment. Premium plans are available for larger files and additional features."
      },
      {
        question: "Do I need to install any software?",
        answer: "No installation required! vframe.cc runs entirely in your web browser. It works on Windows, Mac, Linux, and even mobile devices. All you need is a modern web browser and an internet connection."
      },
      {
        question: "What video formats are supported?",
        answer: "Currently, we support MP4 format for frame extraction, and MP4, WebM, and MOV formats for AI interpolation. We're continuously working to add support for more video formats."
      },
      {
        question: "Is my video data safe?",
        answer: "Absolutely! We use SSL encryption for all file transfers, and your videos are automatically deleted from our servers immediately after processing. We never store or share your video content."
      }
    ]
  },
  {
    category: "Frame Extraction",
    icon: "🎞️",
    questions: [
      {
        question: "How do I extract a single frame from a video?",
        answer: "Simply upload your video, use the timeline slider or navigation buttons to find the exact frame you want, select 'Selected Frame' as the extraction method, and click 'Extract Selected Frame'. The frame will be downloaded as an image file."
      },
      {
        question: "What's the difference between extraction methods?",
        answer: "We offer multiple extraction strategies: 'Selected Frame' extracts one specific frame, 'All Frames' extracts every frame, 'Every N Frames' extracts at regular intervals (e.g., every 5th frame), 'Time Interval' extracts based on time (e.g., every 0.5 seconds), 'Fixed FPS' extracts at a specific frame rate, and 'Keyframes' automatically detects important scene changes."
      },
      {
        question: "What image formats can I export frames in?",
        answer: "You can export frames in three formats: PNG (lossless quality, larger files), JPG (compressed, smaller files), and WebP (modern format with best compression). Choose based on your quality and file size requirements."
      },
      {
        question: "Can I extract frames in custom resolutions?",
        answer: "Yes! You can either keep the original resolution or specify a custom width. The height will be automatically calculated to maintain the aspect ratio. We also provide common presets like 480p, 720p, 1080p, etc."
      },
      {
        question: "How many frames can I extract at once?",
        answer: "There's no hard limit on the number of frames you can extract. However, for very large extractions (hundreds of frames), the download file size might be substantial. All extracted frames are packaged in a convenient ZIP file."
      },
      {
        question: "Why would I need to extract video frames?",
        answer: "Frame extraction has many uses: creating video thumbnails, capturing memorable moments as photos, analyzing video content frame-by-frame, creating GIFs, generating storyboards, extracting reference images for artwork, and creating documentation from video tutorials."
      }
    ]
  },
  {
    category: "AI Interpolation",
    icon: "⚡",
    questions: [
      {
        question: "What is AI frame interpolation?",
        answer: "AI frame interpolation uses artificial intelligence to generate new frames between existing ones, effectively doubling your video's frame rate. For example, it can convert a 30 FPS video to 60 FPS by creating smooth intermediate frames."
      },
      {
        question: "What is RIFE technology?",
        answer: "RIFE (Real-Time Intermediate Flow Estimation) is a state-of-the-art AI model that analyzes motion between frames and generates natural-looking intermediate frames. It's one of the most advanced interpolation technologies available, producing smooth results with minimal artifacts."
      },
      {
        question: "What frame rates work best for interpolation?",
        answer: "Input videos between 24-30 FPS work best for interpolation. The AI will double the frame rate, so 24 FPS becomes 48 FPS, and 30 FPS becomes 60 FPS. Higher input frame rates may not show as dramatic improvements."
      },
      {
        question: "How long does interpolation take?",
        answer: "Processing time depends on video length and resolution. Typically, a 30-second 1080p video takes 1-2 minutes to process. Shorter videos and lower resolutions process faster."
      },
      {
        question: "Can I see a demo before uploading my video?",
        answer: "Yes! When you visit the interpolation page, you'll see a demo video that shows the before and after comparison. This lets you experience the quality of our AI interpolation before processing your own videos."
      },
      {
        question: "What types of videos work best with interpolation?",
        answer: "Videos with smooth camera movement, stable footage, good lighting, and continuous shots work best. Gaming videos, sports footage, drone shots, and professional recordings typically produce excellent results. Videos with rapid cuts or extreme motion blur may not interpolate as well."
      }
    ]
  },
  {
    category: "Technical Questions",
    icon: "🔧",
    questions: [
      {
        question: "What's the maximum file size I can upload?",
        answer: "Free users can upload videos up to 100MB. This is sufficient for most short to medium-length videos. Premium plans offer higher limits for professional use cases."
      },
      {
        question: "What browsers are supported?",
        answer: "vframe.cc works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for the best experience."
      },
      {
        question: "Can I process 4K videos?",
        answer: "Yes, we support videos up to 4K resolution (3840×2160). However, processing time will be longer for higher resolutions, and file size limits still apply."
      },
      {
        question: "Is there an API available?",
        answer: "An API for developers is coming soon! This will allow you to integrate our frame extraction and interpolation capabilities into your own applications."
      },
      {
        question: "Can I process multiple videos at once?",
        answer: "Currently, videos are processed one at a time. Batch processing for multiple videos is on our roadmap and coming soon."
      },
      {
        question: "Why is my video taking long to process?",
        answer: "Processing time depends on several factors: video length, resolution, selected processing options, and current server load. Longer videos and higher resolutions naturally take more time. If processing seems stuck, try refreshing the page and uploading again."
      }
    ]
  },
  {
    category: "Troubleshooting",
    icon: "🔍",
    questions: [
      {
        question: "My video won't upload. What should I do?",
        answer: "First, check that your video is in a supported format (MP4 for extraction, MP4/WebM/MOV for interpolation) and under the file size limit (100MB for free users). If the problem persists, try using a different browser or clearing your browser cache."
      },
      {
        question: "The extracted frames look blurry. How can I improve quality?",
        answer: "Make sure you're using PNG format for lossless quality, keeping the original resolution (don't resize unless necessary), and that your source video is high quality. Blurry source videos will produce blurry frames."
      },
      {
        question: "Interpolation results have artifacts. What causes this?",
        answer: "Artifacts can occur with videos that have rapid scene changes, extreme motion blur, flashing lights, or very low quality source material. For best results, use stable, well-lit footage with smooth motion."
      },
      {
        question: "Can I cancel processing once it starts?",
        answer: "You can refresh the page to stop processing, but you'll need to start over. We recommend letting the process complete as it usually doesn't take long."
      },
      {
        question: "My download failed. Can I retrieve my processed video?",
        answer: "If you're using the interpolation tool, check your processing history at the bottom of the page. Recent results are saved temporarily. For frame extraction, you'll need to process again if the download failed."
      }
    ]
  }
];

// Generate FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqCategories.flatMap(category =>
    category.questions.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  )
};

export default function FAQPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["General Questions"]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    trackPageView('FAQ', '/faq');
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredCategories = searchQuery
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

      <div className="w-full">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-primary">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Find answers to common questions about video frame extraction and AI interpolation
            </p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-solid"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-body-secondary">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-body-secondary hover:text-body"
                  >
                    ✕
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          {!searchQuery && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              {faqCategories.map((category) => (
                <button
                  key={category.category}
                  onClick={() => {
                    const element = document.getElementById(category.category.replace(/\s+/g, '-'));
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-center"
                >
                  <span className="text-2xl block mb-1">{category.icon}</span>
                  <span className="text-xs text-body-secondary">{category.category}</span>
                </button>
              ))}
            </div>
          )}

          {/* FAQ Categories */}
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <Card key={category.category} id={category.category.replace(/\s+/g, '-')}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <CardTitle className="text-xl">{category.category}</CardTitle>
                    </div>
                    <span className={cn(
                      "text-2xl transition-transform duration-200",
                      expandedCategories.includes(category.category) ? "rotate-180" : ""
                    )}>
                      ⌄
                    </span>
                  </div>
                </CardHeader>
                {expandedCategories.includes(category.category) && (
                  <CardContent className="space-y-4">
                    {category.questions.map((item, index) => (
                      <div key={index} className="border-b border-border last:border-0 pb-4 last:pb-0">
                        <h3 className="font-semibold text-emphasis mb-2">
                          {item.question}
                        </h3>
                        <p className="text-body-secondary text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Still Have Questions? */}
          <Card className="mt-8 text-center bg-gradient-to-br from-primary-solid/10 to-accent/10 border-primary-solid/30">
            <CardContent className="py-8 space-y-4">
              <h3 className="text-xl font-semibold">Still Have Questions?</h3>
              <p className="text-body-secondary max-w-2xl mx-auto">
                Can't find what you're looking for? Try our tools with the demo videos or explore our detailed tutorials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link href="/tutorials">
                  <Button variant="outline">
                    📚 View Tutorials
                  </Button>
                </Link>
                <Link href="/extract">
                  <Button>
                    🎬 Try Frame Extraction
                  </Button>
                </Link>
                <Link href="/interpolate">
                  <Button>
                    ⚡ Try Interpolation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <div className="mt-8 text-center text-sm text-body-secondary">
            <p>
              Need help with something specific? 
              <Link href="mailto:support@vframe.cc" className="text-primary-solid hover:underline ml-1">
                Contact Support
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
