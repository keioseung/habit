import { useState } from 'react';
import { Habit } from '../hooks/useTodayHabits';

interface HabitFormProps {
  habit?: Habit | null;
  onSubmit: (title: string, description: string, color: string) => Promise<{ success: boolean; error?: any }>;
  onCancel: () => void;
  loading?: boolean;
}

export default function HabitForm({ habit, onSubmit, onCancel, loading = false }: HabitFormProps) {
  const [title, setTitle] = useState(habit?.title || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [color, setColor] = useState(habit?.color || 'indigo');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('습관 이름을 입력해주세요.');
      return;
    }

    const result = await onSubmit(title.trim(), description.trim(), color);
    if (!result.success) {
      setError('습관 저장에 실패했습니다.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {habit ? '습관 수정' : '새 습관 추가'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 습관 이름 */}
        <div>
          <label htmlFor="habitTitle" className="block text-sm font-medium text-gray-700 mb-2">
            습관 이름
          </label>
          <input
            id="habitTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 매일 운동하기"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        {/* 습관 설명 */}
        <div>
          <label htmlFor="habitDescription" className="block text-sm font-medium text-gray-700 mb-2">
            설명 (선택)
          </label>
          <input
            id="habitDescription"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 하루 30분 운동하기"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {/* 색상 선택 */}
        <div>
          <label htmlFor="habitColor" className="block text-sm font-medium text-gray-700 mb-2">
            색상
          </label>
          <select
            id="habitColor"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="indigo">인디고</option>
            <option value="blue">블루</option>
            <option value="green">그린</option>
            <option value="yellow">옐로우</option>
            <option value="pink">핑크</option>
            <option value="purple">퍼플</option>
          </select>
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