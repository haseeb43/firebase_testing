// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // trailingSlash: true,

  // Security and compatibility settings for Next.js 15
  experimental: {
    // Disable problematic features for Firebase compatibility
    optimizeCss: false,
    scrollRestoration: false,

  },

  // Disable type checking during build (helps with Firebase deployment)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true, // Required for Firebase Hosting
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'img1.wsimg.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  // Fix for Firebase static file serving with brackets
  generateBuildId: async () => {
    // Use timestamp to ensure unique builds
    return 'build-' + Date.now();
  },

  // webpack: (config, { isServer }) => {
  //   // Consistent chunk naming
  //   config.optimization = {
  //     ...config.optimization,
  //     splitChunks: {
  //       chunks: 'all',
  //       maxSize: 200000, // 200kb chunks
  //     },
  //   };

  //   // File loader for videos (your existing code)
  //   config.module.rules.push({
  //     test: /\.(mp4|webm)$/,
  //     use: {
  //       loader: 'file-loader',
  //       options: {
  //         publicPath: '/_next/static/videos/',
  //         outputPath: `${isServer ? '../' : ''}static/videos/`,
  //         name: '[name].[hash].[ext]',
  //       },
  //     },
  //   });

  //   return config;
  // },

  // Add compiler options for better performance
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
};

module.exports = nextConfig;

// // next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   trailingSlash: true,
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'placehold.co',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'picsum.photos',
//       },
//       {
//         protocol: 'https',
//         hostname: 'img1.wsimg.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'storage.googleapis.com',
//       },
//     ],
//   },
//   webpack: (config) => {
//     config.module.rules.push({
//       test: /\.(mp4|webm)$/,
//       use: {
//         loader: 'file-loader',
//         options: {
//           publicPath: '/_next/static/videos/',
//           outputPath: 'static/videos/',
//           name: '[name].[hash].[ext]',
//         },
//       },
//     });
//     return config;
//   },
// };

// module.exports = nextConfig;
