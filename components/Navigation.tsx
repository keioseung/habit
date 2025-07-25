import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="text-xl font-bold text-indigo-600">
            습관 형성 앱
          </Link>

          {/* 네비게이션 링크 */}
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              홈
            </Link>
            <Link
              href="/habits"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/habits')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              습관 관리
            </Link>
            <Link
              href="/stats"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/stats')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              통계
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 