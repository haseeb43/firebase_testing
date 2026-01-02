'use client';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

export function CapacitorSetup() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const setupStatusBar = async () => {
        try {
          // Set background first
          await StatusBar.setBackgroundColor({ color: '#1a1f2e' });

          // Then force light icons (white)
          await StatusBar.setStyle({ style: Style.Light });

          console.log('Status bar configured');
        } catch (error) {
          console.error('Status bar error:', error);
        }
      };

      setupStatusBar();
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
//       // Set icon color to LIGHT (white icons for dark background)
//       StatusBar.setStyle({ style: Style.Light });

//       // Set background color to match header
//       StatusBar.setBackgroundColor({ color: '#1a1f2e' });
//     }
//   }, []);

//   return null;
// }
