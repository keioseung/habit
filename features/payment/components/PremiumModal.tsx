import { useState } from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREMIUM_FEATURES = [
  '광고 제거',
  '고급 통계',
  '무제한 습관',
  '커스텀 테마',
  '우선 지원',
];

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const plans = {
    monthly: { price: 2900, originalPrice: 3900, period: '월' },
    yearly: { price: 19900, originalPrice: 46800, period: '년', discount: '57%' },
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Stripe 결제 로직 구현
      console.log('구독 시작:', selectedPlan);
      // 실제 결제 로직은 Stripe 연동 후 구현
    } catch (error) {
      console.error('결제 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">프리미엄 업그레이드</h2>
          <p className="text-gray-600">더 나은 습관 형성을 위한 프리미엄 기능</p>
        </div>

        {/* 기능 목록 */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">프리미엄 기능</h3>
          <ul className="space-y-2">
            {PREMIUM_FEATURES.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* 요금제 선택 */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {(['monthly', 'yearly'] as const).map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedPlan === plan
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {plans[plan].price.toLocaleString()}원
                  </div>
                  <div className="text-sm text-gray-500">
                    / {plans[plan].period}
                  </div>
                  {'discount' in plans[plan] && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {(plans[plan] as any).discount} 할인
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            나중에
          </button>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? '처리 중...' : '구독하기'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          언제든지 구독을 취소할 수 있습니다
        </p>
      </div>
    </div>
  );
} 