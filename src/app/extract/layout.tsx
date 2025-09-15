import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Frame Extraction Tool",
  description: "Extract frames from MP4 videos with multiple strategies: single frame, all frames, every N frames, time intervals, fixed FPS, or keyframes. Professional video processing tool.",
  keywords: "video frame extraction, MP4 frame extractor, video to images, frame export, video processing, keyframe extraction",
  openGraph: {
    title: "Video Frame Extraction Tool",
    description: "Extract frames from MP4 videos with multiple strategies. Professional video processing tool with flexible extraction options.",
    url: process.env.NEXT_PUBLIC_BASE_URL + "/extract",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Video Frame Extraction Tool",
      },
    ],
  },
  twitter: {
    title: "Video Frame Extraction Tool",
    description: "Extract frames from MP4 videos with multiple strategies.",
  },
};

export default function ExtractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
