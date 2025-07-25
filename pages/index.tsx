import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTodayHabits } from '../features/habits/hooks/useTodayHabits';
import { useCharacter } from '../features/habits/hooks/useCharacter';
import TodayHabitsList from '../features/habits/components/TodayHabitsList';
import CharacterCard from '../features/character/components/CharacterCard';

export default function HomePage() {
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/40 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">습관 형성 앱</h1>
          <p className="text-lg text-gray-600 mb-8">로그인하고 습관을 만들어보세요</p>
          <div className="flex space-x-4">
            <a href="/auth/login" className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold shadow-lg hover:scale-105 hover:bg-indigo-600 transition-all duration-200">로그인</a>
            <a href="/auth/signup" className="px-6 py-3 rounded-xl bg-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:bg-pink-600 transition-all duration-200">회원가입</a>
          </div>
        </div>
      </div>
    );
  }

  const completedHabits = habitLogs.filter(log => log.checked).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            안녕하세요, {user.email}님!
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