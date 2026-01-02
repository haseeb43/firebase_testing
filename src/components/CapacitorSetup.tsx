'use client';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

export function CapacitorSetup() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const setupStatusBar = async () => {
        try {
          // Show the status bar
          await StatusBar.show();

          // Style.Light = Dark text for light backgrounds (BLACK icons)
          await StatusBar.setStyle({ style: Style.Light });

          // Note: backgroundColor might not work on Android 15+
          // but we'll keep it for older versions
          await StatusBar.setBackgroundColor({ color: '#ffffff' });

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
//       const setupStatusBar = async () => {
//         try {
//           // Use LIGHT background (to match drawer bg-background)
//           await StatusBar.setBackgroundColor({ color: '#ffffff' }); // or your bg-background color

//           // Use DARK icons for light background
//           await StatusBar.setStyle({ style: Style.Dark });

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
