import { useEffect, useState } from 'react';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export default function LevelUpModal({ isOpen, newLevel, onClose }: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                <div className={`w-2 h-2 rounded-full ${
                  ['bg-yellow-400', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][
                    Math.floor(Math.random() * 5)
                  ]
                }`} />
              </div>
            ))}
          </div>
        )}

        {/* Level Up Content */}
        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
            <span className="text-3xl font-bold text-white">🎉</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-bounce">
            레벨업!
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            축하합니다! <span className="font-bold text-indigo-600">레벨 {newLevel}</span>이 되었습니다!
          </p>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              새로운 레벨에서 더 많은 습관을 만들어보세요!
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            계속하기
          </button>
        </div>
      </div>
    </div>
  );
} 