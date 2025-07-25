import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export interface Character {
  id: string;
  user_id: string;
  level: number;
  exp: number;
  created_at: string;
}

export function useCharacter(userId: string | undefined) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCharacter = async () => {
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setCharacter(data);
      } catch (error) {
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [userId]);

  const addExperience = async (expToAdd: number) => {
    if (!character) return;

    try {
      let newExp = character.exp + expToAdd;
      let newLevel = character.level;

      // 경험치 100마다 레벨업
      if (newExp >= 100) {
        newLevel += Math.floor(newExp / 100);
        newExp = newExp % 100;
      }

      const { error } = await supabase
        .from('characters')
        .update({ level: newLevel, exp: newExp })
        .eq('user_id', userId);

      if (error) throw error;

      setCharacter(prev => prev ? {
        ...prev,
        level: newLevel,
        exp: newExp
      } : null);

      return { levelUp: newLevel > character.level, newLevel, newExp };
    } catch (error) {
      console.error('Error adding experience:', error);
      return null;
    }
  };

  return { character, loading, addExperience };
} 