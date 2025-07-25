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
        // 레벨업 알림 (나중에 토스트나 모달로 구현 가능)
        console.log(`🎉 레벨업! 레벨 ${result.newLevel}이 되었습니다!`);
      }

      onHabitChecked?.();
    } catch (error) {
      console.error('Error checking habit:', error);
    } finally {
      setChecking(null);
    }
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-600">오늘은 습관이 없습니다.</p>
        <p className="text-sm text-gray-500 mt-1">새로운 습관을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map(habit => {
        const isChecked = isHabitChecked(habit.id);
        const isProcessing = checking === habit.id;

        return (
          <div
            key={habit.id}
            className={`flex items-center p-4 bg-white rounded-lg border-2 transition-all duration-200 ${
              isChecked 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <button
              onClick={() => handleCheck(habit)}
              disabled={isChecked || isProcessing}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isChecked
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-indigo-500'
              } ${isProcessing ? 'animate-pulse' : ''}`}
            >
              {isChecked && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {isProcessing && (
                <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>

            <div className="ml-4 flex-1">
              <h3 className={`font-medium ${
                isChecked ? 'text-green-800 line-through' : 'text-gray-900'
              }`}>
                {habit.title}
              </h3>
              {isChecked && (
                <p className="text-sm text-green-600 mt-1">
                  ✅ 완료! +10 경험치 획득
                </p>
              )}
            </div>

            {isChecked && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  완료
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 