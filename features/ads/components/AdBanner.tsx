import { useEffect, useState } from 'react';

interface AdBannerProps {
  adUnit: string;
  className?: string;
}

export default function AdBanner({ adUnit, className = '' }: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Google AdSense 로드
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        (window as any).adsbygoogle.push({});
        setIsLoaded(true);
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  return (
    <div className={`ad-banner ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // 실제 AdSense 클라이언트 ID로 변경
        data-ad-slot={adUnit}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {!isLoaded && (
        <div className="bg-gray-100 h-32 flex items-center justify-center rounded">
          <p className="text-gray-500 text-sm">광고 로딩 중...</p>
        </div>
      )}
    </div>
  );
} 