import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

interface HabitStats {
  title: string;
  totalChecks: number;
  totalDays: number;
  completionRate: number;
  lastChecked: string | null;
  color: string;
}

interface TimePattern {
  time: string;
  count: number;
  percentage: number;
}

interface DayPattern {
  day: string;
  count: number;
}

interface StreakPattern {
  currentStreak: number;
  longestStreak: number;
  averageStreak: number;
}

interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

interface PatternAnalysis {
  habitStats: HabitStats[];
  timePatterns: TimePattern[];
  dayPatterns: DayPattern[];
  streakPatterns: StreakPattern;
  insights: Insight[];
}

interface HabitRecommendation {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  icon: string;
  popularity?: number;
  reason?: string;
}

interface HabitCombination {
  title: string;
  habits: { title: string; icon: string }[];
  description: string;
  difficulty: string;
}

interface DifficultyRecommendation {
  title: string;
  habits: { title: string; icon: string; difficulty: string }[];
  reason: string;
}

interface Recommendations {
  popularHabits: HabitRecommendation[];
  personalizedRecommendations: HabitRecommendation[];
  habitCombinations: HabitCombination[];
  difficultyRecommendations: DifficultyRecommendation[];
}

export const useHabitAI = () => {
  const { user } = useAuth();
  const [patternAnalysis, setPatternAnalysis] = useState<PatternAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePattern = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/analyze-pattern?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setPatternAnalysis(data.data);
      } else {
        setError(data.error || '패턴 분석에 실패했습니다.');
      }
    } catch (err) {
      setError('패턴 분석 중 오류가 발생했습니다.');
      console.error('패턴 분석 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/recommendations?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.data);
      } else {
        setError(data.error || '추천 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('추천 생성 중 오류가 발생했습니다.');
      console.error('추천 생성 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHabitPrediction = (habitTitle: string): number => {
    if (!patternAnalysis) return 0;

    const habit = patternAnalysis.habitStats.find(h => h.title === habitTitle);
    if (!habit) return 50; // 기본값

    // 완료율과 연속 달성 패턴을 기반으로 예측
    const baseRate = habit.completionRate;
    const streakBonus = patternAnalysis.streakPatterns.currentStreak * 2;
    const timeBonus = patternAnalysis.timePatterns[0]?.percentage > 30 ? 10 : 0;

    return Math.min(100, Math.max(0, baseRate + streakBonus + timeBonus));
  };

  const getOptimalTime = (): string => {
    if (!patternAnalysis || patternAnalysis.timePatterns.length === 0) {
      return '09:00-12:00'; // 기본값
    }
    return patternAnalysis.timePatterns[0].time;
  };

  const getOptimalDay = (): string => {
    if (!patternAnalysis || patternAnalysis.dayPatterns.length === 0) {
      return '월'; // 기본값
    }
    return patternAnalysis.dayPatterns[0].day;
  };

  const getMotivationalMessage = (): string => {
    if (!patternAnalysis) return '오늘도 좋은 하루 되세요!';

    const { streakPatterns, insights } = patternAnalysis;

    if (streakPatterns.currentStreak > 0) {
      return `🔥 ${streakPatterns.currentStreak}일 연속 달성 중입니다! 이 기세를 유지해보세요!`;
    }

    if (streakPatterns.longestStreak > 7) {
      return `🏆 최고 기록 ${streakPatterns.longestStreak}일을 달성하셨네요! 새로운 기록에 도전해보세요!`;
    }

    const successInsight = insights.find(insight => insight.type === 'success');
    if (successInsight) {
      return successInsight.message;
    }

    return '작은 습관이 큰 변화를 만듭니다. 오늘도 화이팅! 💪';
  };

  return {
    patternAnalysis,
    recommendations,
    loading,
    error,
    analyzePattern,
    getRecommendations,
    getHabitPrediction,
    getOptimalTime,
    getOptimalDay,
    getMotivationalMessage
  };
}; 