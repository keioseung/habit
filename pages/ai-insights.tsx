import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useHabitAI } from '../features/ai/hooks/useHabitAI';

export default function AIInsightsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { 
    patternAnalysis, 
    recommendations, 
    loading: aiLoading, 
    error, 
    analyzePattern, 
    getRecommendations,
    getMotivationalMessage 
  } = useHabitAI();
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      analyzePattern();
      getRecommendations();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      {/* 상단 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">AI 인사이트</span>
            </div>
            
            <a 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🤖 AI 인사이트 & 추천
          </h1>
          <p className="text-gray-600">
            당신의 습관 데이터를 분석하여 개인화된 인사이트와 추천을 제공합니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-2xl shadow-lg p-1 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'insights'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📊 인사이트
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'recommendations'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🎯 추천
            </button>
          </div>
        </div>

        {aiLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">AI가 데이터를 분석하고 있습니다...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'insights' && patternAnalysis && (
              <div className="space-y-6">
                {/* 동기부여 메시지 */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">💬 오늘의 메시지</h3>
                  <p className="text-indigo-100">{getMotivationalMessage()}</p>
                </div>

                {/* AI 인사이트 */}
                {patternAnalysis.insights.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 AI 인사이트</h3>
                    <div className="space-y-4">
                      {patternAnalysis.insights.map((insight, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border-l-4 ${
                            insight.type === 'success'
                              ? 'bg-green-50 border-green-400'
                              : insight.type === 'warning'
                              ? 'bg-yellow-50 border-yellow-400'
                              : 'bg-blue-50 border-blue-400'
                          }`}
                        >
                          <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-gray-600 text-sm">{insight.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 습관별 통계 */}
                {patternAnalysis.habitStats.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 습관별 성과</h3>
                    <div className="space-y-4">
                      {patternAnalysis.habitStats.map((habit, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: habit.color }}
                            ></div>
                            <div>
                              <h4 className="font-medium text-gray-900">{habit.title}</h4>
                              <p className="text-sm text-gray-500">
                                {habit.totalChecks}회 완료 • {habit.totalDays}일 중
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{habit.completionRate}%</div>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                style={{ width: `${habit.completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 시간대별 패턴 */}
                {patternAnalysis.timePatterns.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ 최적 시간대</h3>
                    <div className="space-y-3">
                      {patternAnalysis.timePatterns.slice(0, 3).map((pattern, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="font-medium text-gray-900">{pattern.time}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                style={{ width: `${pattern.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{pattern.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 연속 달성 통계 */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 연속 달성</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">{patternAnalysis.streakPatterns.currentStreak}</div>
                      <div className="text-sm text-gray-600">현재 연속</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600">{patternAnalysis.streakPatterns.longestStreak}</div>
                      <div className="text-sm text-gray-600">최고 기록</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">{patternAnalysis.streakPatterns.averageStreak}</div>
                      <div className="text-sm text-gray-600">평균 연속</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && recommendations && (
              <div className="space-y-6">
                {/* 인기 습관 */}
                {recommendations.popularHabits.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 인기 습관</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.popularHabits.slice(0, 4).map((habit, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{habit.icon}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{habit.title}</h4>
                              <p className="text-sm text-gray-500">{habit.category}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              habit.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              habit.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {habit.difficulty === 'easy' ? '쉬움' : habit.difficulty === 'medium' ? '보통' : '어려움'}
                            </span>
                            {habit.popularity && (
                              <span className="text-xs text-gray-500">{habit.popularity}명이 선택</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 개인화된 추천 */}
                {recommendations.personalizedRecommendations.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 개인화 추천</h3>
                    <div className="space-y-4">
                      {recommendations.personalizedRecommendations.map((habit, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{habit.icon}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{habit.title}</h4>
                              <p className="text-sm text-gray-500">{habit.category}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                          <p className="text-sm text-indigo-600 font-medium">{habit.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 습관 조합 추천 */}
                {recommendations.habitCombinations.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🎪 습관 조합</h3>
                    <div className="space-y-4">
                      {recommendations.habitCombinations.map((combination, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-xl">
                          <h4 className="font-medium text-gray-900 mb-2">{combination.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{combination.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {combination.habits.map((habit, habitIndex) => (
                              <span key={habitIndex} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                {habit.icon} {habit.title}
                              </span>
                            ))}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            combination.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            combination.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {combination.difficulty === 'easy' ? '쉬움' : combination.difficulty === 'medium' ? '보통' : '어려움'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 