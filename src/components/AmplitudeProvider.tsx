"use client";

import { useEffect, useRef } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

export function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Ensure Amplitude is only initialized once during the application lifecycle
    if (isInitialized.current) {
      return;
    }

    try {
      // Add Session Replay to the Amplitude instance
      amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
      
      // Initialize amplitude with the provided API key and autocapture enabled
      amplitude.init('32361e6565bb3f3258a0e2d9305a015d', {
        autocapture: true,
      });

      isInitialized.current = true;
      console.log('Amplitude Analytics and Session Replay initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Amplitude:', error);
    }
  }, []);

  return <>{children}</>;
}
