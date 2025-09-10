import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Nav } from "@/components/Nav";
import { AmplitudeProvider } from "@/components/AmplitudeProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Video Processing Tool",
    default: "Professional Video Frame Processing Tool",
  },
  description:
    "Professional video processing tool for frame extraction and RIFE AI interpolation. Extract frames from MP4 videos and enhance frame rates with intelligent algorithms.",
  keywords:
    "video frame extraction, RIFE interpolation, video processing, frame rate enhancement, AI video",
  authors: [{ name: "vframe.cc" }],
  creator: "vframe.cc",
  publisher: "vframe.cc",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vframe.cc",
    siteName: "vframe.cc",
    title: "Professional Video Frame Processing Tool",
    description:
      "Professional video processing tool for frame extraction and RIFE AI interpolation. Extract frames from MP4 videos and enhance frame rates with intelligent algorithms.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Video Frame Processing Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vframe_cc",
    creator: "@vframe_cc",
    title: "Professional Video Frame Processing Tool",
    description:
      "Professional video processing tool for frame extraction and RIFE AI interpolation.",
    images: ["/android-chrome-512x512.png"],
  },
  alternates: {
    canonical: "https://vframe.cc",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "vframe.cc",
              description:
                "Professional video processing tool for frame extraction and RIFE AI interpolation",
              url: "https://vframe.cc",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Video frame extraction",
                "RIFE AI interpolation",
                "Multiple extraction strategies",
                "MP4 format support",
              ],
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17544847064"
          strategy="afterInteractive"
        />
        <Script
          id="google-ads"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17544847064');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Ads Conversion Tracking */}

        <Analytics />
        <AmplitudeProvider>
          <header className="border-b border-border/50 bg-background/95 sticky top-0 z-50 supports-[backdrop-filter]:backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
            <div className="container-page flex h-16 items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
              >
                <img
                  src="/android-chrome-192x192.png"
                  alt="vframe.cc logo"
                  width={40}
                  height={40}
                  className="rounded-lg shadow-sm"
                />
                <span className="text-lg font-bold text-gradient-primary text-glow">
                  vframe.cc
                </span>
              </Link>
              <Nav />
            </div>
          </header>
          <main className="container-page py-12">{children}</main>
          <footer className="border-t border-border/50 bg-background/90 supports-[backdrop-filter]:backdrop-blur-sm supports-[backdrop-filter]:bg-background/50">
            <div className="container-page h-16 flex items-center justify-between text-sm text-body-secondary">
              <span>
                © {new Date().getFullYear()} vframe.cc - Professional Video
                Processing Tool
              </span>
              <span className="text-gradient-accent text-emphasis">
                Making video processing easier
              </span>
            </div>
          </footer>
        </AmplitudeProvider>
      </body>
    </html>
  );
}
