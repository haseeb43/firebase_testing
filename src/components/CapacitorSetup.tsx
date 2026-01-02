'use client';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

export function CapacitorSetup() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const setupStatusBar = async () => {
        try {
          // Show status bar
          await StatusBar.show();

          // Set icon style based on your background color
          // Style.Light = Dark icons (for light backgrounds)
          // Style.Dark = White icons (for dark backgrounds)
          await StatusBar.setStyle({ style: Style.Light });

          // Try to set background color (works on iOS and Android 14-)
          // Silently fails on Android 15+ (CSS handles it)
          try {
            await StatusBar.setBackgroundColor({ color: '#ffffff' });
          } catch (e) {
            // Android 15+ - CSS body::before handles the background
          }

          console.log('Status bar configured');
        } catch (error) {
          console.error('Status bar setup failed:', error);
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
//       const setupStatusBar = async () => {
//         try {
//           // Show the status bar
//           await StatusBar.show();

//           // Style.Light = Dark text for light backgrounds (BLACK icons)
//           await StatusBar.setStyle({ style: Style.Light });

//           // Note: backgroundColor might not work on Android 15+
//           // but we'll keep it for older versions
//           await StatusBar.setBackgroundColor({ color: '#ffffff' });

//           console.log('Status bar configured');
//         } catch (error) {
//           console.error('Status bar error:', error);
//         }
//       };

//       setupStatusBar();
//     }
//   }, []);

//   return null;
// }
