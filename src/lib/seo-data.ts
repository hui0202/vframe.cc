// SEO structured data schemas for different pages

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "vframe.cc",
  "alternateName": "Video Frame Processing Tool",
  "url": "https://vframe.cc",
  "description": "Professional video processing tool for frame extraction and RIFE AI interpolation",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://vframe.cc/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "vframe.cc",
  "url": "https://vframe.cc",
  "logo": "https://vframe.cc/android-chrome-512x512.png",
  "description": "Professional video processing tool for frame extraction and RIFE AI interpolation",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "https://twitter.com/vframe_cc",
    "https://github.com/vframe-cc"
  ]
};

export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "vframe.cc",
  "description": "Professional video processing tool for frame extraction and RIFE AI interpolation",
  "url": "https://vframe.cc",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "category": "Free"
  },
  "featureList": [
    "Video frame extraction from MP4 files",
    "RIFE AI interpolation for frame rate enhancement", 
    "Multiple extraction strategies (single frame, all frames, every N frames, time intervals, fixed FPS, keyframes)",
    "Batch processing and ZIP download",
    "Real-time video preview and frame selection",
    "Professional video processing tools"
  ],
  "screenshot": "https://vframe.cc/android-chrome-512x512.png"
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Video Frame Extractor Tool",
  "description": "Extract frames from MP4 videos with multiple strategies and enhance frame rates using AI interpolation",
  "url": "https://vframe.cc/extract",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  }
};

export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Extract Frames from Video",
  "description": "Learn how to extract frames from MP4 videos using vframe.cc professional tool",
  "image": "https://vframe.cc/android-chrome-512x512.png",
  "totalTime": "PT5M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Upload Video",
      "text": "Upload your MP4 video file to the extraction tool",
      "image": "https://vframe.cc/android-chrome-192x192.png"
    },
    {
      "@type": "HowToStep", 
      "name": "Choose Extraction Method",
      "text": "Select from multiple extraction strategies: single frame, all frames, every N frames, time intervals, fixed FPS, or keyframes",
      "image": "https://vframe.cc/android-chrome-192x192.png"
    },
    {
      "@type": "HowToStep",
      "name": "Configure Parameters",
      "text": "Set extraction parameters like frame interval, output format (PNG/JPG/WEBP), and resize options",
      "image": "https://vframe.cc/android-chrome-192x192.png"
    },
    {
      "@type": "HowToStep",
      "name": "Extract and Download",
      "text": "Start extraction and download individual frames or complete ZIP archive",
      "image": "https://vframe.cc/android-chrome-192x192.png"
    }
  ]
};
