import { useEffect } from 'react';
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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

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
    return null;
  }

  const completedHabits = habitLogs.filter(log => log.checked).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">HabitFlow</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/habits" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                습관 관리
              </a>
              <a href="/stats" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                통계
              </a>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">안녕하세요, {user.username}님!</span>
                <button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            안녕하세요, {user.username}님!
          </h1>
          <p className="text-gray-600">
            오늘도 습관을 만들어보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 오늘의 습관 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">오늘의 습관</h2>
                <div className="text-sm text-gray-600">
                  {completedHabits} / {totalHabits} 완료
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">총 습관</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalHabits}개</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">완료한 습관</h3>
            <p className="text-3xl font-bold text-green-600">{completedHabits}개</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">완료율</h3>
            <p className="text-3xl font-bold text-purple-600">
              {totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 