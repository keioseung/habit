import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="습관 형성 앱" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="습관앱" />
        <meta name="description" content="습관을 만들고 캐릭터를 성장시키는 앱" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#4f46e5" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#4f46e5" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Splash Screen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="습관앱" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="습관 형성 앱" />
        <meta property="og:description" content="습관을 만들고 캐릭터를 성장시키는 앱" />
        <meta property="og:site_name" content="습관 형성 앱" />
        <meta property="og:url" content="https://your-domain.com" />
        <meta property="og:image" content="/icons/icon-512x512.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://your-domain.com" />
        <meta property="twitter:title" content="습관 형성 앱" />
        <meta property="twitter:description" content="습관을 만들고 캐릭터를 성장시키는 앱" />
        <meta property="twitter:image" content="/icons/icon-512x512.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 