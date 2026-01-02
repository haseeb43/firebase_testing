'use client';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

export function CapacitorSetup() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Set status bar style (light icons for dark background)
      StatusBar.setStyle({ style: Style.Light });
    }
  }, []);

  return null;
}
