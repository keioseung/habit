import { Character } from '../hooks/useCharacter';

interface CharacterCardProps {
  character: Character | null;
  loading: boolean;
}

export default function CharacterCard({ character, loading }: CharacterCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">캐릭터 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const progressPercentage = (character.exp / 100) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-4">
        {/* 캐릭터 아바타 */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {character.level}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900">
          레벨 {character.level}
        </h3>
        <p className="text-sm text-gray-600">
          {character.email}
        </p>
      </div>

      {/* 경험치 바 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>경험치</span>
          <span>{character.exp} / 100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 다음 레벨까지 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          다음 레벨까지 {100 - character.exp} 경험치 필요
        </p>
      </div>
    </div>
  );
} 