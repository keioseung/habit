import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useStats } from '../../features/stats/hooks/useStats';

export default function StatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { stats, loading: statsLoading } = useStats(user?.id);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // 성취 배지 획득 시 애니메이션
    if (stats && stats.currentStreak >= 7) {
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (statsLoading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* 성취 애니메이션 */}
      {showAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">축하합니다!</h2>
            <p className="text-gray-600">7일 연속 달성 배지를 획득했습니다!</p>
          </div>
        </div>
      )}

      {/* 상단 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">통계</span>
            </div>
            
            <a 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            나의 습관 통계 📊
          </h1>
          <p className="text-gray-600">
            습관 형성 과정을 한눈에 확인해보세요.
          </p>
        </div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">총 습관</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats.totalHabits}개</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">오늘 완료</h3>
            <p className="text-2xl font-bold text-green-600">{stats.completedToday}개</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">현재 연속</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.currentStreak}일</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">최고 연속</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.longestStreak}일</p>
          </div>
        </div>

        {/* 기간 선택 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              월간
            </button>
          </div>

          {/* 주간 진행률 */}
          <h2 className="text-xl font-semibold text-gray-900 mb-6">이번 주 진행률</h2>
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {Object.entries(stats.weeklyProgress).map(([day, count]) => (
              <div key={day} className="text-center">
                <div className="text-xs sm:text-sm font-medium text-gray-500 mb-2">{day}</div>
                <div className="w-full bg-gray-200 rounded-full h-16 sm:h-24 flex items-end justify-center p-1">
                  <div
                    className="bg-gradient-to-t from-indigo-500 to-purple-600 rounded-full w-full transition-all duration-500 ease-out"
                    style={{ 
                      height: `${Math.min((count / Math.max(...Object.values(stats.weeklyProgress))) * 100, 100)}%`,
                      minHeight: count > 0 ? '8px' : '0'
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{count}개</div>
              </div>
            ))}
          </div>
        </div>

        {/* 월간 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">이번 달 완료</h2>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600 mb-2">
                {stats.completedThisMonth}개
              </p>
              <p className="text-gray-500">이번 달에 완료한 습관</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">전체 완료</h2>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">
                {stats.totalCompleted}개
              </p>
              <p className="text-gray-500">지금까지 완료한 습관</p>
            </div>
          </div>
        </div>

        {/* 성취 배지 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">성취 배지</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`text-center p-4 rounded-2xl transition-all duration-300 ${
              stats.currentStreak >= 7 
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-lg scale-105' 
                : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-sm font-medium">1주 연속</div>
              <div className="text-xs text-gray-500">{stats.currentStreak}/7일</div>
              {stats.currentStreak >= 7 && (
                <div className="text-xs text-yellow-700 font-medium mt-1">획득!</div>
              )}
            </div>
            
            <div className={`text-center p-4 rounded-2xl transition-all duration-300 ${
              stats.currentStreak >= 30 
                ? 'bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-300 shadow-lg scale-105' 
                : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-sm font-medium">1개월 연속</div>
              <div className="text-xs text-gray-500">{stats.currentStreak}/30일</div>
              {stats.currentStreak >= 30 && (
                <div className="text-xs text-orange-700 font-medium mt-1">획득!</div>
              )}
            </div>
            
            <div className={`text-center p-4 rounded-2xl transition-all duration-300 ${
              stats.totalCompleted >= 100 
                ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 shadow-lg scale-105' 
                : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-sm font-medium">100회 완료</div>
              <div className="text-xs text-gray-500">{stats.totalCompleted}/100회</div>
              {stats.totalCompleted >= 100 && (
                <div className="text-xs text-purple-700 font-medium mt-1">획득!</div>
              )}
            </div>
            
            <div className={`text-center p-4 rounded-2xl transition-all duration-300 ${
              stats.totalHabits >= 10 
                ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300 shadow-lg scale-105' 
                : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">📚</div>
              <div className="text-sm font-medium">습관 마스터</div>
              <div className="text-xs text-gray-500">{stats.totalHabits}/10개</div>
              {stats.totalHabits >= 10 && (
                <div className="text-xs text-blue-700 font-medium mt-1">획득!</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          <a 
            href="/dashboard" 
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-indigo-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <span className="text-xs font-medium">홈</span>
          </a>
          
          <a 
            href="/habits" 
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-indigo-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs font-medium">습관</span>
          </a>
          
          <a 
            href="/stats" 
            className="flex flex-col items-center justify-center flex-1 h-full text-indigo-600 border-t-2 border-indigo-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium">통계</span>
          </a>
          
          <a 
            href="/profile" 
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-indigo-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">프로필</span>
          </a>
        </div>
      </div>
    </div>
  );
} 