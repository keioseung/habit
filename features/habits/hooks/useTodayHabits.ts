import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  checked: boolean;
  checked_at: string;
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
        const todayDate = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

        // 사용자의 모든 습관들 가져오기
        const { data: habitsData, error: habitsError } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', userId);

        if (habitsError) throw habitsError;

        setHabits(habitsData || []);

        // 오늘의 습관 로그 가져오기
        if (habitsData && habitsData.length > 0) {
          const habitIds = habitsData.map(habit => habit.id);
          const { data: logsData, error: logsError } = await supabase
            .from('habit_logs')
            .select('*')
            .in('habit_id', habitIds)
            .eq('checked_at', todayDate);

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