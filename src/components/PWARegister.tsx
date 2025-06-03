'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    // Only register service worker in production or when explicitly testing PWA
    const isProduction = process.env.NODE_ENV === 'production';
    const isPWATest = typeof window !== 'undefined' && 
                      (window.location.search.includes('pwa=test') || 
                       window.location.pathname === '/pwa-test.html');
    
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (isProduction || isPWATest)
    ) {
      // Only register service worker if we're in a secure context or localhost
      const isSecureContext = window.isSecureContext || 
                             window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1';
      
      if (!isSecureContext) {
        console.log('Service Worker requires secure context (HTTPS)');
        return;
      }

      // Check if sw.js exists before registration
      fetch('/sw.js', { method: 'HEAD' })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Service Worker file not found: ${response.status}`);
          }
          
          // Register our custom service worker
          return navigator.serviceWorker.register('/sw.js', { 
            scope: '/',
            updateViaCache: 'none' // Always check for updates
          });
        })
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
          
          // Check for updates immediately
          registration.update();
          
          // Set up update listener
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New update available
                    console.log('New service worker version available');
                    
                    // Optional: Show update notification to user
                    if ('Notification' in window && Notification.permission === 'granted') {
                      new Notification('Lucky645 업데이트', {
                        body: '새로운 버전이 사용 가능합니다. 페이지를 새로고침해주세요.',
                        icon: '/icon-192x192.png'
                      });
                    }
                  } else {
                    // First time install
                    console.log('PWA installed successfully');
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error.message);
          // Don't throw error in development to prevent app crashes
        });

      // Listen for controllerchange event
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed');
        // Optionally reload the page to use the new service worker
        // window.location.reload();
      });

      // Handle service worker errors
      navigator.serviceWorker.addEventListener('error', (error) => {
        console.error('Service Worker error:', error);
      });
    } else if (typeof window !== 'undefined' && !isProduction && !isPWATest) {
      console.log('Service Worker registration skipped in development mode');
    }
  }, []);

  return null;
}