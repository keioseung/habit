import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Habit, HabitLog } from '../hooks/useTodayHabits';
import { useCharacter } from '../hooks/useCharacter';

interface TodayHabitsListProps {
  habits: Habit[];
  habitLogs: HabitLog[];
  userId: string;
  onHabitChecked?: () => void;
}

export default function TodayHabitsList({ 
  habits, 
  habitLogs, 
  userId, 
  onHabitChecked 
}: TodayHabitsListProps) {
  const { addExperience } = useCharacter(userId);
  const [checking, setChecking] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);

  const isHabitChecked = (habitId: string) => {
    return habitLogs.some(log => log.habit_id === habitId && log.checked);
  };

  const handleCheck = async (habit: Habit) => {
    if (checking || isHabitChecked(habit.id)) return;

    setChecking(habit.id);
    const today = new Date().toISOString().slice(0, 10);

    try {
      // 습관 로그 생성/업데이트
      const { error: logError } = await supabase
        .from('habit_logs')
        .upsert({
          habit_id: habit.id,
          user_id: userId,
          checked_at: today,
          checked: true,
        });

      if (logError) throw logError;

      // 경험치 추가 (10점)
      const result = await addExperience(10);
      
      if (result?.levelUp) {
        // 레벨업 알림
        console.log(`🎉 레벨업! 레벨 ${result.newLevel}이 되었습니다!`);
      }

      // 축하 애니메이션 표시
      setShowCelebration(habit.id);
      setTimeout(() => setShowCelebration(null), 2000);

      onHabitChecked?.();
    } catch (error) {
      console.error('Error checking habit:', error);
    } finally {
      setChecking(null);
    }
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">오늘은 습관이 없습니다</h3>
        <p className="text-gray-600 mb-6">새로운 습관을 추가해보세요!</p>
        <a 
          href="/habits" 
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          습관 추가하기
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map(habit => {
        const isChecked = isHabitChecked(habit.id);
        const isProcessing = checking === habit.id;
        const isCelebrating = showCelebration === habit.id;

        return (
          <div
            key={habit.id}
            className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
              isChecked 
                ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                : 'border-gray-200 hover:border-indigo-200'
            } ${isCelebrating ? 'animate-pulse scale-105' : ''}`}
          >
            {/* 축하 효과 */}
            {isCelebrating && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-20 rounded-2xl animate-ping"></div>
            )}

            <div className="relative p-4 sm:p-6">
              <div className="flex items-start space-x-4">
                {/* 체크 버튼 */}
                <button
                  onClick={() => handleCheck(habit)}
                  disabled={isChecked || isProcessing}
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isChecked
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg'
                      : 'border-gray-300 hover:border-indigo-500 hover:shadow-md'
                  } ${isProcessing ? 'animate-pulse' : ''} ${isChecked ? 'scale-110' : 'hover:scale-105'}`}
                >
                  {isChecked && (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isProcessing && (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </button>

                {/* 습관 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-all duration-300 ${
                        isChecked ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {habit.title}
                      </h3>
                      
                      {habit.description && (
                        <p className={`text-sm sm:text-base mb-3 transition-all duration-300 ${
                          isChecked ? 'text-green-600 line-through' : 'text-gray-600'
                        }`}>
                          {habit.description}
                        </p>
                      )}

                      {/* 색상 태그 */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          habit.color === 'red' ? 'bg-red-100 text-red-800' :
                          habit.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          habit.color === 'green' ? 'bg-green-100 text-green-800' :
                          habit.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          habit.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {habit.color}
                        </span>
                      </div>

                      {/* 완료 메시지 */}
                      {isChecked && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">완료! +10 경험치 획득</span>
                        </div>
                      )}
                    </div>

                    {/* 완료 배지 */}
                    {isChecked && (
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 