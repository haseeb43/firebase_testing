'use client';

import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { useEffect } from 'react';

export function CapacitorSetup() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Don't let status bar overlay content
      StatusBar.setOverlaysWebView({ overlay: false });
      // Optional: match your navbar color
      StatusBar.setBackgroundColor({ color: '#ffffff' });
    }
  }, []);

  return null;
}
