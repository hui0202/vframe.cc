"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { websiteSchema, organizationSchema, webApplicationSchema } from "@/lib/seo-data";
import { BlurGradientBg } from "@/lib/BlurGradientBg.module.js"
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const colorbg = new BlurGradientBg({
      dom: "box",
      colors: [
        "#1a1a1f",
        "#2d1b69",
        "#1e1e20",
        "#0f0f11"
      ],
      resize_mode: "cover",
      seed: 2024
    });

    return () => {
      // Cleanup when component unmounts
      if (colorbg && colorbg.destroy) {
        colorbg.destroy();
      }
    };
  }, []);
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, organizationSchema, webApplicationSchema])
        }}
      />
      
      {/* Background container - 使用正常文档流 */}
      <div id="box" className="fixed inset-0 -z-50"></div>
      
      {/* Subtle overlay for better text readability */}
      <div className="fixed inset-0 -z-40 bg-gradient-to-br from-black/10 via-transparent to-black/20 pointer-events-none"></div>
      
      <div className="grid gap-16 relative z-10">
      {/* 英雄区域 */}
      <section className="grid gap-8 text-center py-12 relative">
        {/* 标题区域亮度增强 */}
        <div className="absolute inset-0 bg-gradient-radial from-white/10 via-white/5 to-transparent opacity-80 pointer-events-none"></div>
        
        <div className="space-y-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl heading-primary">
            <span className="text-gradient-primary drop-shadow-lg">
              vframe.cc
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-body max-w-2xl mx-auto px-4">
            Professional video frame processing tool with intelligent extraction and high-quality interpolation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 px-4">
            <Link href="/extract">
              <Button size="lg" className="text-base px-8 w-full sm:w-auto cursor-pointer">
                🎬 Extract Frames
              </Button>
            </Link>
            <Link href="/interpolate">
              <Button variant="outline" size="lg" className="text-base px-8 w-full sm:w-auto cursor-pointer">
                ⚡ Try Interpolation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 功能卡片 */}
      <section className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card className="group hover:scale-105 transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-solid to-accent flex items-center justify-center mb-4">
              <span className="text-2xl">🎞️</span>
            </div>
            <CardTitle className="text-xl heading-tertiary">Video Frame Extraction</CardTitle>
            <CardDescription className="text-base text-body">
              Multiple extraction strategies: single frame, all frames, every N frames, time intervals, fixed FPS, or keyframes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm list-styled space-y-2">
              <li>Currently supports MP4 format</li>
              <li>Interactive frame preview with timeline scrubbing</li>
              <li>Extract individual frames or complete sequences</li>
              <li>Flexible extraction parameter configuration</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="group hover:scale-105 transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary-solid flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <CardTitle className="text-xl heading-tertiary">Intelligent Interpolation</CardTitle>
            <CardDescription className="text-base text-body">
              Based on <span className="text-code">RIFE</span> and other advanced algorithms, intelligently generate intermediate frames to improve video smoothness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm list-styled space-y-2">
              <li>Enhance 24/30 FPS to 60/120 FPS</li>
              <li>Multiple interpolation algorithms available</li>
              <li>Adjustable smoothness parameters</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* 特性介绍 */}
      <section className="text-center py-8 px-4">
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-solid to-accent flex items-center justify-center mx-auto">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg heading-tertiary text-glow">Efficient Processing</h3>
            <p className="text-sm text-body-secondary">Optimized algorithms ensure fast processing, saving your valuable time</p>
          </div>
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary-solid flex items-center justify-center mx-auto">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg heading-tertiary text-glow">Precise Control</h3>
            <p className="text-sm text-body-secondary">Rich parameter configuration to meet the refined needs of professional users</p>
          </div>
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-solid to-accent flex items-center justify-center mx-auto">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="text-lg heading-tertiary text-glow">Easy to Use</h3>
            <p className="text-sm text-body-secondary">Intuitive interface design, easy to get started without complex learning</p>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
