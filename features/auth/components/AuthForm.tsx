import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { signUp, signIn, signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (type === 'login') {
        console.log('로그인 시도:', username);
        const user = await signIn(username, password);
        setMessage('로그인 성공!');
        // 로그인 성공 시 관리자 여부에 따라 다른 페이지로 이동
        if (user?.is_admin) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        console.log('회원가입 시도:', username);
        await signUp(username, password);
        setMessage('회원가입이 완료되었습니다!');
        // 회원가입 성공 시 일반 대시보드로 이동
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error('인증 에러:', error);
      setError(error.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === 'login' ? '로그인' : '회원가입'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            아이디
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {message && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? '처리중...' : type === 'login' ? '로그인' : '회원가입'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          로그아웃
        </button>
        {type === 'login' ? (
          <div className="mt-2">
            <span className="text-sm text-gray-500">계정이 없으신가요? </span>
            <a href="/auth/signup" className="text-indigo-600 hover:underline font-medium transition-colors">회원가입</a>
          </div>
        ) : (
          <div className="mt-2">
            <span className="text-sm text-gray-500">이미 계정이 있으신가요? </span>
            <a href="/auth/login" className="text-indigo-600 hover:underline font-medium transition-colors">로그인</a>
          </div>
        )}
      </div>
    </div>
  );
} 