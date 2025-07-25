import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // 사용자의 습관 로그 데이터 가져오기
    const { data: habitLogs, error: logsError } = await supabase
      .from('habit_logs')
      .select(`
        *,
        habits (
          title,
          description,
          color
        )
      `)
      .eq('user_id', userId)
      .order('checked_at', { ascending: true });

    if (logsError) throw logsError;

    // 습관별 통계 계산
    const habitStats = calculateHabitStats(habitLogs || []);
    
    // 시간대별 패턴 분석
    const timePatterns = analyzeTimePatterns(habitLogs || []);
    
    // 요일별 패턴 분석
    const dayPatterns = analyzeDayPatterns(habitLogs || []);
    
    // 연속 달성 패턴 분석
    const streakPatterns = analyzeStreakPatterns(habitLogs || []);

    // AI 인사이트 생성
    const insights = generateInsights(habitStats, timePatterns, dayPatterns, streakPatterns);

    res.status(200).json({
      success: true,
      data: {
        habitStats,
        timePatterns,
        dayPatterns,
        streakPatterns,
        insights
      }
    });

  } catch (error) {
    console.error('AI 분석 에러:', error);
    res.status(500).json({ error: '분석 중 오류가 발생했습니다.' });
  }
}

function calculateHabitStats(habitLogs: any[]) {
  const habitMap = new Map();
  
  habitLogs.forEach(log => {
    const habitTitle = log.habits?.title || 'Unknown';
    if (!habitMap.has(habitTitle)) {
      habitMap.set(habitTitle, {
        title: habitTitle,
        totalChecks: 0,
        totalDays: 0,
        completionRate: 0,
        lastChecked: null,
        color: log.habits?.color || '#3B82F6'
      });
    }
    
    const habit = habitMap.get(habitTitle);
    habit.totalChecks++;
    habit.lastChecked = log.checked_at;
  });

  // 전체 일수 계산 (첫 로그부터 마지막 로그까지)
  if (habitLogs.length > 0) {
    const firstDate = new Date(habitLogs[0].checked_at);
    const lastDate = new Date(habitLogs[habitLogs.length - 1].checked_at);
    const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    habitMap.forEach(habit => {
      habit.totalDays = totalDays;
      habit.completionRate = Math.round((habit.totalChecks / totalDays) * 100);
    });
  }

  return Array.from(habitMap.values());
}

function analyzeTimePatterns(habitLogs: any[]) {
  const timeSlots = {
    '06:00-09:00': 0,
    '09:00-12:00': 0,
    '12:00-15:00': 0,
    '15:00-18:00': 0,
    '18:00-21:00': 0,
    '21:00-24:00': 0,
    '00:00-06:00': 0
  };

  habitLogs.forEach(log => {
    const hour = new Date(log.checked_at).getHours();
    
    if (hour >= 6 && hour < 9) timeSlots['06:00-09:00']++;
    else if (hour >= 9 && hour < 12) timeSlots['09:00-12:00']++;
    else if (hour >= 12 && hour < 15) timeSlots['12:00-15:00']++;
    else if (hour >= 15 && hour < 18) timeSlots['15:00-18:00']++;
    else if (hour >= 18 && hour < 21) timeSlots['18:00-21:00']++;
    else if (hour >= 21 && hour < 24) timeSlots['21:00-24:00']++;
    else timeSlots['00:00-06:00']++;
  });

  const total = Object.values(timeSlots).reduce((a, b) => a + b, 0);
  const timePatterns = Object.entries(timeSlots).map(([time, count]) => ({
    time,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }));

  return timePatterns.sort((a, b) => b.count - a.count);
}

function analyzeDayPatterns(habitLogs: any[]) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayCounts = days.map(day => ({ day, count: 0 }));

  habitLogs.forEach(log => {
    const dayOfWeek = new Date(log.checked_at).getDay();
    dayCounts[dayOfWeek].count++;
  });

  return dayCounts.sort((a, b) => b.count - a.count);
}

function analyzeStreakPatterns(habitLogs: any[]) {
  if (habitLogs.length === 0) return { currentStreak: 0, longestStreak: 0, averageStreak: 0 };

  const dates = [...new Set(habitLogs.map(log => log.checked_at.split('T')[0]))].sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffDays = Math.ceil((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);
  currentStreak = tempStreak;

  return {
    currentStreak,
    longestStreak,
    averageStreak: Math.round(longestStreak / 2) // 간단한 평균 계산
  };
}

function generateInsights(habitStats: any[], timePatterns: any[], dayPatterns: any[], streakPatterns: any) {
  const insights = [];

  // 가장 성공한 습관
  const bestHabit = habitStats.sort((a, b) => b.completionRate - a.completionRate)[0];
  if (bestHabit && bestHabit.completionRate > 70) {
    insights.push({
      type: 'success',
      title: '🎯 습관 형성의 달인!',
      message: `${bestHabit.title} 습관의 완료율이 ${bestHabit.completionRate}%로 매우 높습니다. 이 습관의 성공 요인을 다른 습관에도 적용해보세요.`
    });
  }

  // 가장 어려워하는 습관
  const worstHabit = habitStats.sort((a, b) => a.completionRate - b.completionRate)[0];
  if (worstHabit && worstHabit.completionRate < 30) {
    insights.push({
      type: 'warning',
      title: '⚠️ 도전이 필요한 습관',
      message: `${worstHabit.title} 습관의 완료율이 ${worstHabit.completionRate}%로 낮습니다. 이 습관을 더 작은 단위로 나누어 시도해보는 것을 추천합니다.`
    });
  }

  // 최적 시간대
  const bestTime = timePatterns[0];
  if (bestTime && bestTime.percentage > 30) {
    insights.push({
      type: 'info',
      title: '⏰ 최적의 습관 시간',
      message: `${bestTime.time} 시간대에 습관을 가장 잘 지키는 편입니다. 새로운 습관도 이 시간대에 계획해보세요.`
    });
  }

  // 요일 패턴
  const bestDay = dayPatterns[0];
  if (bestDay && bestDay.count > 0) {
    insights.push({
      type: 'info',
      title: '📅 활발한 요일',
      message: `${bestDay.day}요일에 습관을 가장 활발하게 수행합니다. 이 요일을 활용하여 새로운 습관을 시작해보세요.`
    });
  }

  // 연속 달성
  if (streakPatterns.currentStreak > 0) {
    insights.push({
      type: 'success',
      title: '🔥 연속 달성 중!',
      message: `현재 ${streakPatterns.currentStreak}일 연속으로 습관을 달성하고 있습니다. 이 기세를 유지해보세요!`
    });
  }

  if (streakPatterns.longestStreak > 7) {
    insights.push({
      type: 'success',
      title: '🏆 최고 기록 달성',
      message: `최장 연속 달성 기록이 ${streakPatterns.longestStreak}일입니다. 이 기록을 갱신해보세요!`
    });
  }

  return insights;
} 