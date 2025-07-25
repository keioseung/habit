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
    // 사용자의 현재 습관들 가져오기
    const { data: userHabits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId);

    if (habitsError) throw habitsError;

    // 전체 사용자들의 인기 습관 분석
    const { data: allHabits, error: allHabitsError } = await supabase
      .from('habits')
      .select('*');

    if (allHabitsError) throw allHabitsError;

    // 인기 습관 추천
    const popularHabits = getPopularHabits(allHabits || []);
    
    // 개인화된 추천
    const personalizedRecommendations = getPersonalizedRecommendations(userHabits || [], allHabits || []);
    
    // 습관 조합 추천
    const habitCombinations = getHabitCombinations(userHabits || []);
    
    // 난이도별 추천
    const difficultyRecommendations = getDifficultyRecommendations(userHabits || []);

    res.status(200).json({
      success: true,
      data: {
        popularHabits,
        personalizedRecommendations,
        habitCombinations,
        difficultyRecommendations
      }
    });

  } catch (error) {
    console.error('AI 추천 에러:', error);
    res.status(500).json({ error: '추천 생성 중 오류가 발생했습니다.' });
  }
}

function getPopularHabits(allHabits: any[]) {
  const habitCounts = new Map();
  
  allHabits.forEach(habit => {
    const title = habit.title.toLowerCase();
    habitCounts.set(title, (habitCounts.get(title) || 0) + 1);
  });

  const popularHabits = [
    {
      title: '물 마시기',
      description: '하루 8잔의 물을 마시는 습관',
      category: '건강',
      difficulty: 'easy',
      icon: '💧',
      popularity: habitCounts.get('물 마시기') || 0
    },
    {
      title: '운동하기',
      description: '매일 30분 운동하는 습관',
      category: '건강',
      difficulty: 'medium',
      icon: '🏃‍♂️',
      popularity: habitCounts.get('운동하기') || 0
    },
    {
      title: '독서하기',
      description: '하루 30분 독서하는 습관',
      category: '학습',
      difficulty: 'easy',
      icon: '📚',
      popularity: habitCounts.get('독서하기') || 0
    },
    {
      title: '명상하기',
      description: '매일 10분 명상하는 습관',
      category: '정신건강',
      difficulty: 'easy',
      icon: '🧘‍♀️',
      popularity: habitCounts.get('명상하기') || 0
    },
    {
      title: '일기 쓰기',
      description: '매일 일기를 쓰는 습관',
      category: '정신건강',
      difficulty: 'medium',
      icon: '✍️',
      popularity: habitCounts.get('일기 쓰기') || 0
    },
    {
      title: '영어 공부하기',
      description: '하루 20분 영어 공부하는 습관',
      category: '학습',
      difficulty: 'medium',
      icon: '🌍',
      popularity: habitCounts.get('영어 공부하기') || 0
    }
  ];

  return popularHabits.sort((a, b) => b.popularity - a.popularity);
}

function getPersonalizedRecommendations(userHabits: any[], allHabits: any[]) {
  const userCategories = new Set(userHabits.map(habit => getHabitCategory(habit.title)));
  const recommendations = [];

  // 사용자가 선호하는 카테고리 기반 추천
  if (userCategories.has('건강')) {
    recommendations.push({
      title: '스트레칭하기',
      description: '매일 아침 10분 스트레칭하는 습관',
      category: '건강',
      difficulty: 'easy',
      icon: '🤸‍♀️',
      reason: '건강 관련 습관을 선호하시는 것 같아요!'
    });
  }

  if (userCategories.has('학습')) {
    recommendations.push({
      title: '코딩 공부하기',
      description: '하루 1시간 코딩 공부하는 습관',
      category: '학습',
      difficulty: 'hard',
      icon: '💻',
      reason: '학습 습관을 잘 지키시는 것 같아요!'
    });
  }

  // 사용자가 아직 시도하지 않은 카테고리 추천
  if (!userCategories.has('정신건강')) {
    recommendations.push({
      title: '감사 일기 쓰기',
      description: '매일 감사한 일 3가지를 적는 습관',
      category: '정신건강',
      difficulty: 'easy',
      icon: '🙏',
      reason: '새로운 영역을 시도해보세요!'
    });
  }

  if (!userCategories.has('생산성')) {
    recommendations.push({
      title: '할 일 정리하기',
      description: '매일 저녁 내일 할 일을 정리하는 습관',
      category: '생산성',
      difficulty: 'easy',
      icon: '📝',
      reason: '생산성을 높이는 습관을 추천해요!'
    });
  }

  return recommendations;
}

function getHabitCategory(habitTitle: string): string {
  const healthKeywords = ['운동', '물', '스트레칭', '걷기', '달리기', '요가'];
  const learningKeywords = ['독서', '공부', '영어', '코딩', '학습', '강의'];
  const mentalKeywords = ['명상', '일기', '감사', '호흡', '마음'];
  const productivityKeywords = ['정리', '계획', '할일', '시간', '목표'];

  const title = habitTitle.toLowerCase();
  
  if (healthKeywords.some(keyword => title.includes(keyword))) return '건강';
  if (learningKeywords.some(keyword => title.includes(keyword))) return '학습';
  if (mentalKeywords.some(keyword => title.includes(keyword))) return '정신건강';
  if (productivityKeywords.some(keyword => title.includes(keyword))) return '생산성';
  
  return '기타';
}

function getHabitCombinations(userHabits: any[]) {
  const combinations = [];

  // 아침 루틴 조합
  const hasMorningHabit = userHabits.some(habit => 
    habit.title.includes('물') || habit.title.includes('스트레칭') || habit.title.includes('명상')
  );
  
  if (!hasMorningHabit) {
    combinations.push({
      title: '아침 루틴 세트',
      habits: [
        { title: '물 마시기', icon: '💧' },
        { title: '스트레칭하기', icon: '🤸‍♀️' },
        { title: '명상하기', icon: '🧘‍♀️' }
      ],
      description: '하루를 시작하는 완벽한 아침 루틴',
      difficulty: 'medium'
    });
  }

  // 저녁 루틴 조합
  const hasEveningHabit = userHabits.some(habit => 
    habit.title.includes('일기') || habit.title.includes('정리') || habit.title.includes('독서')
  );
  
  if (!hasEveningHabit) {
    combinations.push({
      title: '저녁 루틴 세트',
      habits: [
        { title: '일기 쓰기', icon: '✍️' },
        { title: '할 일 정리하기', icon: '📝' },
        { title: '독서하기', icon: '📚' }
      ],
      description: '하루를 마무리하는 평화로운 저녁 루틴',
      difficulty: 'medium'
    });
  }

  // 건강 루틴 조합
  const hasHealthHabit = userHabits.some(habit => 
    habit.title.includes('운동') || habit.title.includes('걷기') || habit.title.includes('달리기')
  );
  
  if (!hasHealthHabit) {
    combinations.push({
      title: '건강 루틴 세트',
      habits: [
        { title: '운동하기', icon: '🏃‍♂️' },
        { title: '물 마시기', icon: '💧' },
        { title: '스트레칭하기', icon: '🤸‍♀️' }
      ],
      description: '건강한 삶을 위한 필수 습관들',
      difficulty: 'hard'
    });
  }

  return combinations;
}

function getDifficultyRecommendations(userHabits: any[]) {
  const easyHabits = userHabits.filter(habit => getHabitDifficulty(habit.title) === 'easy');
  const mediumHabits = userHabits.filter(habit => getHabitDifficulty(habit.title) === 'medium');
  const hardHabits = userHabits.filter(habit => getHabitDifficulty(habit.title) === 'hard');

  const recommendations = [];

  // 쉬운 습관이 많으면 중간 난이도 추천
  if (easyHabits.length >= 2 && mediumHabits.length < 2) {
    recommendations.push({
      title: '중간 난이도 도전',
      habits: [
        { title: '운동하기', icon: '🏃‍♂️', difficulty: 'medium' },
        { title: '영어 공부하기', icon: '🌍', difficulty: 'medium' },
        { title: '일기 쓰기', icon: '✍️', difficulty: 'medium' }
      ],
      reason: '쉬운 습관들을 잘 지키고 계시네요! 이제 조금 더 도전적인 습관을 시도해보세요.'
    });
  }

  // 중간 난이도 습관이 많으면 어려운 습관 추천
  if (mediumHabits.length >= 2 && hardHabits.length < 1) {
    recommendations.push({
      title: '고난이도 도전',
      habits: [
        { title: '코딩 공부하기', icon: '💻', difficulty: 'hard' },
        { title: '외국어 공부하기', icon: '🗣️', difficulty: 'hard' },
        { title: '프로젝트 진행하기', icon: '🚀', difficulty: 'hard' }
      ],
      reason: '중간 난이도 습관들을 잘 해내고 계시네요! 이제 큰 목표에 도전해보세요.'
    });
  }

  // 어려운 습관이 많으면 쉬운 습관으로 균형 맞추기
  if (hardHabits.length >= 2 && easyHabits.length < 2) {
    recommendations.push({
      title: '균형 잡기',
      habits: [
        { title: '명상하기', icon: '🧘‍♀️', difficulty: 'easy' },
        { title: '감사 일기 쓰기', icon: '🙏', difficulty: 'easy' },
        { title: '물 마시기', icon: '💧', difficulty: 'easy' }
      ],
      reason: '도전적인 습관들을 잘 해내고 계시네요! 쉬운 습관들로 균형을 맞춰보세요.'
    });
  }

  return recommendations;
}

function getHabitDifficulty(habitTitle: string): string {
  const easyKeywords = ['물', '명상', '감사', '스트레칭', '정리'];
  const hardKeywords = ['코딩', '프로젝트', '외국어', '운동', '독서'];
  
  const title = habitTitle.toLowerCase();
  
  if (easyKeywords.some(keyword => title.includes(keyword))) return 'easy';
  if (hardKeywords.some(keyword => title.includes(keyword))) return 'hard';
  
  return 'medium';
} 