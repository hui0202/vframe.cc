import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Nav } from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vframe.cc - Professional Video Frame Processing Tool",
  description: "All-in-one tool for video frame extraction and intelligent interpolation, supporting multiple algorithms and formats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b border-border/50 backdrop-filter backdrop-blur-lg bg-background/80 sticky top-0 z-50">
          <div className="container-page flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold text-gradient-primary hover:scale-105 transition-transform duration-200 text-glow">
              vframe.cc
            </Link>
            <Nav />
          </div>
        </header>
        <main className="container-page py-12">{children}</main>
        <footer className="border-t border-border/50 backdrop-filter backdrop-blur-sm bg-background/50">
          <div className="container-page h-16 flex items-center justify-between text-sm text-body-secondary">
            <span>© {new Date().getFullYear()} vframe.cc - Professional Video Processing Tool</span>
            <span className="text-gradient-accent text-emphasis">Making video processing easier</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
