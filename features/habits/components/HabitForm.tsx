import { useState, useEffect } from 'react';
import { Habit } from '../hooks/useTodayHabits';

interface HabitFormProps {
  habit?: Habit | null;
  onSubmit: (name: string, repeatDays: string[]) => Promise<{ success: boolean; error?: any }>;
  onCancel: () => void;
  loading?: boolean;
}

const DAYS_OF_WEEK = [
  { key: 'Mon', label: '월' },
  { key: 'Tue', label: '화' },
  { key: 'Wed', label: '수' },
  { key: 'Thu', label: '목' },
  { key: 'Fri', label: '금' },
  { key: 'Sat', label: '토' },
  { key: 'Sun', label: '일' },
];

export default function HabitForm({ habit, onSubmit, onCancel, loading = false }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '');
  const [repeatDays, setRepeatDays] = useState<string[]>(
    habit?.repeat_days ? habit.repeat_days.split(',') : []
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('습관 이름을 입력해주세요.');
      return;
    }

    if (repeatDays.length === 0) {
      setError('최소 하나의 요일을 선택해주세요.');
      return;
    }

    const result = await onSubmit(name.trim(), repeatDays);
    if (!result.success) {
      setError('습관 저장에 실패했습니다.');
    }
  };

  const toggleDay = (day: string) => {
    setRepeatDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {habit ? '습관 수정' : '새 습관 추가'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 습관 이름 */}
        <div>
          <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 mb-2">
            습관 이름
          </label>
          <input
            id="habitName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 매일 운동하기"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* 반복 요일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            반복 요일
          </label>
          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleDay(key)}
                className={`py-2 px-1 text-sm rounded-md border transition-colors ${
                  repeatDays.includes(key)
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? '저장 중...' : (habit ? '수정' : '추가')}
          </button>
        </div>
      </form>
    </div>
  );
} 