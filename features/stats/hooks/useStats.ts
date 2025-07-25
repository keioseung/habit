import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: { [key: string]: number };
  monthlyProgress: { [key: string]: number };
}

export function useStats(userId: string | undefined) {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      // 기본 습관 통계
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId);

      const totalHabits = habits?.length || 0;

      // 오늘 완료된 습관
      const today = new Date().toISOString().slice(0, 10);
      const { data: todayLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('date', today)
        .eq('checked', true);

      const completedToday = todayLogs?.length || 0;

      // 이번 주 완료된 습관
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekStartStr = weekStart.toISOString().slice(0, 10);
      
      const { data: weekLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .gte('date', weekStartStr)
        .eq('checked', true);

      const completedThisWeek = weekLogs?.length || 0;

      // 이번 달 완료된 습관
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthStartStr = monthStart.toISOString().slice(0, 10);
      
      const { data: monthLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .gte('date', monthStartStr)
        .eq('checked', true);

      const completedThisMonth = monthLogs?.length || 0;

      // 전체 완료된 습관
      const { data: allLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('checked', true);

      const totalCompleted = allLogs?.length || 0;

      // 연속 체크 스트릭 계산
      const currentStreak = calculateCurrentStreak(allLogs || []);
      const longestStreak = calculateLongestStreak(allLogs || []);

      // 주간/월간 진행률 계산
      const weeklyProgress = calculateWeeklyProgress(weekLogs || []);
      const monthlyProgress = calculateMonthlyProgress(monthLogs || []);

      setStats({
        totalHabits,
        completedToday,
        completedThisWeek,
        completedThisMonth,
        totalCompleted,
        currentStreak,
        longestStreak,
        weeklyProgress,
        monthlyProgress,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentStreak = (logs: any[]): number => {
    if (logs.length === 0) return 0;

    const sortedLogs = logs
      .map(log => log.date)
      .sort()
      .reverse();

    let streak = 0;
    let currentDate = new Date();

    for (const logDate of sortedLogs) {
      const logDateObj = new Date(logDate);
      const diffTime = currentDate.getTime() - logDateObj.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (logs: any[]): number => {
    if (logs.length === 0) return 0;

    const sortedLogs = logs
      .map(log => log.date)
      .sort();

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedLogs.length; i++) {
      const prevDate = new Date(sortedLogs[i - 1]);
      const currDate = new Date(sortedLogs[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(longestStreak, currentStreak);
  };

  const calculateWeeklyProgress = (logs: any[]): { [key: string]: number } => {
    const progress: { [key: string]: number } = {};
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - date.getDay() + i);
      const dateStr = date.toISOString().slice(0, 10);
      
      const dayLogs = logs.filter(log => log.date === dateStr);
      progress[days[i]] = dayLogs.length;
    }

    return progress;
  };

  const calculateMonthlyProgress = (logs: any[]): { [key: string]: number } => {
    const progress: { [key: string]: number } = {};
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const dateStr = date.toISOString().slice(0, 10);
      
      const dayLogs = logs.filter(log => log.date === dateStr);
      progress[day.toString()] = dayLogs.length;
    }

    return progress;
  };

  return { stats, loading, refetch: fetchStats };
} 