import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useHabits } from '../../features/habits/hooks/useHabits';
import { Habit } from '../../features/habits/hooks/useTodayHabits';
import HabitForm from '../../features/habits/components/HabitForm';
import HabitList from '../../features/habits/components/HabitList';

export default function HabitsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { habits, loading: habitsLoading, addHabit, updateHabit, deleteHabit } = useHabits(user?.id);
  
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formLoading, setFormLoading] = useState(false);

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

  const handleAddHabit = async (name: string, repeatDays: string[]) => {
    setFormLoading(true);
    const result = await addHabit(name, repeatDays);
    setFormLoading(false);
    
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleUpdateHabit = async (name: string, repeatDays: string[]) => {
    if (!editingHabit) return { success: false };
    
    setFormLoading(true);
    const result = await updateHabit(editingHabit.id, name, repeatDays);
    setFormLoading(false);
    
    if (result.success) {
      setEditingHabit(null);
    }
    return result;
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">습관 관리</h1>
            <p className="text-gray-600 mt-2">습관을 추가하고 관리해보세요</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            새 습관 추가
          </button>
        </div>

        {/* 습관 폼 */}
        {showForm && (
          <div className="mb-8">
            <HabitForm
              habit={editingHabit}
              onSubmit={editingHabit ? handleUpdateHabit : handleAddHabit}
              onCancel={handleCancelForm}
              loading={formLoading}
            />
          </div>
        )}

        {/* 습관 목록 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            내 습관 목록 ({habits.length}개)
          </h2>
          <HabitList
            habits={habits}
            onEdit={handleEditHabit}
            onDelete={deleteHabit}
            loading={habitsLoading}
          />
        </div>
      </div>
    </div>
  );
} 