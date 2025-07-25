import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export interface Habit {
  id: string;
  name: string;
  repeat_days: string;
  user_id: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  checked: boolean;
  created_at: string;
}

export function useTodayHabits(userId: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchTodayHabits = async () => {
      try {
        // 오늘 요일 구하기
        const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }); // 'Mon', 'Tue' 등
        const todayDate = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

        // 사용자의 습관들 가져오기
        const { data: habitsData, error: habitsError } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', userId);

        if (habitsError) throw habitsError;

        // 오늘 요일에 해당하는 습관만 필터링
        const todayHabits = habitsData?.filter(habit => 
          habit.repeat_days?.includes(today)
        ) || [];

        setHabits(todayHabits);

        // 오늘의 습관 로그 가져오기
        if (todayHabits.length > 0) {
          const habitIds = todayHabits.map(habit => habit.id);
          const { data: logsData, error: logsError } = await supabase
            .from('habit_logs')
            .select('*')
            .in('habit_id', habitIds)
            .eq('date', todayDate);

          if (logsError) throw logsError;
          setHabitLogs(logsData || []);
        }

      } catch (error) {
        console.error('Error fetching today habits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayHabits();
  }, [userId]);

  return { habits, habitLogs, loading };
} 