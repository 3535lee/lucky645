export default function PWAHead() {
  return (
    <>
      {/* PWA Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Lucky645" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Touch Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Splash screens */}
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="apple-touch-startup-image" href="/icon-512x512.png" />
      
      {/* Prevent zoom on mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
    </>
  );
}