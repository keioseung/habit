import { useState } from 'react';
import { Habit } from '../hooks/useTodayHabits';

interface HabitListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => Promise<{ success: boolean }>;
  loading?: boolean;
}

const DAYS_OF_WEEK = {
  'Mon': '월',
  'Tue': '화',
  'Wed': '수',
  'Thu': '목',
  'Fri': '금',
  'Sat': '토',
  'Sun': '일',
};

export default function HabitList({ habits, onEdit, onDelete, loading = false }: HabitListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 습관을 삭제하시겠습니까?')) {
      setDeletingId(id);
      const result = await onDelete(id);
      if (result.success) {
        // 삭제 성공
      }
      setDeletingId(null);
    }
  };

  const formatRepeatDays = (repeatDays: string) => {
    if (!repeatDays) return '설정 없음';
    return repeatDays.split(',').map(day => DAYS_OF_WEEK[day as keyof typeof DAYS_OF_WEEK]).join(', ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">습관이 없습니다</h3>
        <p className="text-gray-500">새로운 습관을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div key={habit.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {habit.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                반복: {formatRepeatDays(habit.repeat_days)}
              </p>
              <p className="text-xs text-gray-500">
                생성일: {new Date(habit.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(habit)}
                className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(habit.id)}
                disabled={deletingId === habit.id}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                {deletingId === habit.id ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 