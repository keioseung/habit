import { useRouter } from 'next/router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useStats } from '../../features/stats/hooks/useStats';

export default function StatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { stats, loading: statsLoading } = useStats(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (statsLoading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">습관 통계</h1>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">총 습관</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalHabits}개</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">오늘 완료</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedToday}개</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">현재 연속</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.currentStreak}일</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">최고 연속</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.longestStreak}일</p>
          </div>
        </div>

        {/* 주간 진행률 */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">이번 주 진행률</h2>
          <div className="grid grid-cols-7 gap-4">
            {Object.entries(stats.weeklyProgress).map(([day, count]) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">{day}</div>
                <div className="w-full bg-gray-200 rounded-full h-24 flex items-end justify-center p-1">
                  <div
                    className="bg-indigo-500 rounded-full w-full transition-all duration-300"
                    style={{ height: `${Math.min((count / Math.max(...Object.values(stats.weeklyProgress))) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{count}개</div>
              </div>
            ))}
          </div>
        </div>

        {/* 월간 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">이번 달 완료</h2>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600 mb-2">
                {stats.completedThisMonth}개
              </p>
              <p className="text-gray-500">이번 달에 완료한 습관</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">전체 완료</h2>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">
                {stats.totalCompleted}개
              </p>
              <p className="text-gray-500">지금까지 완료한 습관</p>
            </div>
          </div>
        </div>

        {/* 성취 배지 */}
        <div className="bg-white rounded-lg p-6 shadow-sm mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">성취 배지</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`text-center p-4 rounded-lg ${
              stats.currentStreak >= 7 ? 'bg-yellow-100' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-medium">1주 연속</div>
              <div className="text-xs text-gray-500">{stats.currentStreak}/7일</div>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${
              stats.currentStreak >= 30 ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-medium">1개월 연속</div>
              <div className="text-xs text-gray-500">{stats.currentStreak}/30일</div>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${
              stats.totalCompleted >= 100 ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-sm font-medium">100회 완료</div>
              <div className="text-xs text-gray-500">{stats.totalCompleted}/100회</div>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${
              stats.totalHabits >= 10 ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm font-medium">습관 마스터</div>
              <div className="text-xs text-gray-500">{stats.totalHabits}/10개</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 