import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Habit } from './useTodayHabits';

export function useHabits(userId: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchHabits();
  }, [userId]);

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (name: string, repeatDays: string[]) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name,
          repeat_days: repeatDays.join(','),
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      setHabits(prev => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding habit:', error);
      return { success: false, error };
    }
  };

  const updateHabit = async (id: string, name: string, repeatDays: string[]) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update({
          name,
          repeat_days: repeatDays.join(','),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setHabits(prev => prev.map(habit => habit.id === id ? data : habit));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating habit:', error);
      return { success: false, error };
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHabits(prev => prev.filter(habit => habit.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting habit:', error);
      return { success: false, error };
    }
  };

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    refetch: fetchHabits,
  };
} 