import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RIFE AI Video Interpolation Tool",
  description: "Double video frame rates using RIFE AI interpolation technology. Upload videos or provide URLs to enhance smoothness from 24/30 FPS to 60/120 FPS.",
  keywords: "RIFE AI interpolation, video frame rate enhancement, AI video processing, frame interpolation, video smoothness, FPS doubling",
  openGraph: {
    title: "RIFE AI Video Interpolation Tool",
    description: "Double video frame rates using RIFE AI interpolation technology. Enhance video smoothness with advanced algorithms.",
    url: "https://vframe.cc/interpolate",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "RIFE AI Video Interpolation Tool",
      },
    ],
  },
  twitter: {
    title: "RIFE AI Video Interpolation Tool",
    description: "Double video frame rates using RIFE AI interpolation technology.",
  },
};

export default function InterpolateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
