'use client';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

export function CapacitorSetup() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Set icon color to LIGHT (white icons for dark background)
      StatusBar.setStyle({ style: Style.Light });

      // Set background color to match header
      StatusBar.setBackgroundColor({ color: '#1a1f2e' });
    }
  }, []);

  return null;
}

// 'use client';

// import { Capacitor } from '@capacitor/core';
// import { StatusBar, Style } from '@capacitor/status-bar';
// import { useEffect } from 'react';

// export function CapacitorSetup() {
//   useEffect(() => {
//     if (Capacitor.isNativePlatform()) {
//       // Set status bar style (light icons for dark background)
//       StatusBar.setStyle({ style: Style.Light });
//     }
//   }, []);

//   return null;
// }
