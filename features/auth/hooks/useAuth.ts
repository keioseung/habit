import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export interface User {
  id: string;
  username: string;
  email?: string;
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 확인
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (username: string, password: string) => {
    try {
      // 비밀번호 해시 처리
      const hashedPassword = await hashPassword(password);
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          { username, password: hashedPassword }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // 회원가입 성공 시 바로 로그인
      return await signIn(username, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      // 사용자 조회
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 비밀번호 검증
      const isValidPassword = await verifyPassword(password, userData.password);
      if (!isValidPassword) {
        throw new Error('비밀번호가 올바르지 않습니다.');
      }

      // 로그인 성공
      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        created_at: userData.created_at
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 비밀번호 해시 함수 (간단한 구현)
  const hashPassword = async (password: string): Promise<string> => {
    // 실제로는 bcrypt나 더 안전한 해시 함수 사용 권장
    // 여기서는 간단한 예시로 구현
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // 비밀번호 검증 함수
  const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const hashedInput = await hashPassword(password);
    return hashedInput === hashedPassword;
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
} 