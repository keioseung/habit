import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTodayHabits } from '../features/habits/hooks/useTodayHabits';
import { useCharacter } from '../features/habits/hooks/useCharacter';
import TodayHabitsList from '../features/habits/components/TodayHabitsList';
import CharacterCard from '../features/character/components/CharacterCard';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { habits, habitLogs, loading: habitsLoading } = useTodayHabits(user?.id);
  const { character, loading: characterLoading } = useCharacter(user?.id);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // 습관 완료 시 축하 애니메이션
    const completedCount = habitLogs.filter(log => log.checked).length;
    if (completedCount > 0 && completedCount === habits.length && habits.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [habitLogs, habits]);

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

  const completedHabits = habitLogs.filter(log => log.checked).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* 축하 애니메이션 */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">축하합니다!</h2>
            <p className="text-gray-600">오늘의 모든 습관을 완료했습니다!</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">HabitFlow</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 hidden sm:block">안녕하세요, {user.username}님!</span>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 환영 메시지 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            안녕하세요, {user.username}님! 👋
          </h1>
          <p className="text-gray-600 mb-4">
            오늘도 습관을 만들어보세요.
          </p>
          
          {/* 진행률 바 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">오늘의 진행률</span>
              <span className="text-sm font-bold text-indigo-600">{completedHabits}/{totalHabits}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* 성취 메시지 */}
          {completionRate === 100 && totalHabits > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🎉</span>
                <span className="text-green-800 font-medium">오늘의 모든 습관을 완료했습니다!</span>
              </div>
            </div>
          )}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 오늘의 습관 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">오늘의 습관</h2>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    {completedHabits} / {totalHabits} 완료
                  </div>
                  <a 
                    href="/habits" 
                    className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {habitsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">습관을 불러오는 중...</p>
                </div>
              ) : (
                <TodayHabitsList
                  habits={habits}
                  habitLogs={habitLogs}
                  userId={user.id}
                />
              )}
            </div>
          </div>

          {/* 캐릭터 정보 */}
          <div className="lg:col-span-1">
            <CharacterCard 
              character={character} 
              loading={characterLoading} 
            />
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">총 습관</h3>
            <p className="text-2xl font-bold text-indigo-600">{totalHabits}개</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">완료한 습관</h3>
            <p className="text-2xl font-bold text-green-600">{completedHabits}개</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center md:col-span-1 col-span-2">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">완료율</h3>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(completionRate)}%
            </p>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          <a 
            href="/dashboard" 
            className="flex flex-col items-center justify-center flex-1 h-full text-indigo-600 border-t-2 border-indigo-600"
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
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-indigo-600"
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