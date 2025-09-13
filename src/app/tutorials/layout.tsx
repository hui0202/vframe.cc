import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | Video Frame Processing Tutorials | vframe.cc',
    default: 'Video Processing Tutorials | vframe.cc',
  },
  description: 'Learn how to extract video frames and use AI interpolation to enhance video frame rates. Step-by-step tutorials for video processing.',
  keywords: ['video frame extraction tutorial', 'video interpolation guide', 'frame extraction how-to', 'RIFE AI tutorial', 'video processing guide'],
};

export default function TutorialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
