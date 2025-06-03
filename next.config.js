// Temporarily disable PWA in development to avoid webpack conflicts with Turbopack
const withPWA = process.env.NODE_ENV === 'production' 
  ? require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: false
    })
  : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack is now stable, no need for experimental config
};

module.exports = withPWA(nextConfig);