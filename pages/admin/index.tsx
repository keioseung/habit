import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';

interface AdminStats {
  totalUsers: number;
  totalHabits: number;
  totalHabitLogs: number;
  activeUsersToday: number;
}

interface User {
  id: string;
  username: string;
  email?: string;
  created_at: string;
  is_admin: boolean;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && !user.is_admin) {
      router.push('/dashboard');
      return;
    }

    if (user?.is_admin) {
      fetchStats();
      fetchUsers();
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      
      // 총 사용자 수
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // 총 습관 수
      const { count: totalHabits } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true });

      // 총 습관 로그 수
      const { count: totalHabitLogs } = await supabase
        .from('habit_logs')
        .select('*', { count: 'exact', head: true });

      // 오늘 활성 사용자 수
      const today = new Date().toISOString().slice(0, 10);
      const { count: activeUsersToday } = await supabase
        .from('habit_logs')
        .select('user_id', { count: 'exact', head: true })
        .eq('checked_at', today);

      setStats({
        totalUsers: totalUsers || 0,
        totalHabits: totalHabits || 0,
        totalHabitLogs: totalHabitLogs || 0,
        activeUsersToday: activeUsersToday || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers(); // 사용자 목록 새로고침
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    try {
      // 관련 데이터 삭제
      await supabase.from('habit_logs').delete().eq('user_id', userId);
      await supabase.from('habits').delete().eq('user_id', userId);
      await supabase.from('characters').delete().eq('user_id', userId);
      await supabase.from('users').delete().eq('id', userId);

      fetchUsers(); // 사용자 목록 새로고침
      fetchStats(); // 통계 새로고침
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">관리자 대시보드</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                일반 대시보드
              </a>
              <span className="text-sm text-gray-700">관리자: {user.username}</span>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            관리자 대시보드
          </h1>
          <p className="text-gray-600">
            시스템 전체 현황을 확인하고 관리하세요.
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">총 사용자</h3>
            <p className="text-3xl font-bold text-blue-600">
              {loadingStats ? '...' : stats?.totalUsers || 0}명
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">총 습관</h3>
            <p className="text-3xl font-bold text-green-600">
              {loadingStats ? '...' : stats?.totalHabits || 0}개
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">총 습관 로그</h3>
            <p className="text-3xl font-bold text-purple-600">
              {loadingStats ? '...' : stats?.totalHabitLogs || 0}개
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">오늘 활성 사용자</h3>
            <p className="text-3xl font-bold text-orange-600">
              {loadingStats ? '...' : stats?.activeUsersToday || 0}명
            </p>
          </div>
        </div>

        {/* 사용자 관리 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">사용자 관리</h2>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              새로고침
            </button>
          </div>
          
          {loadingUsers ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">사용자 목록을 불러오는 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가입일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_admin 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.is_admin ? '관리자' : '일반'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                          className={`px-3 py-1 rounded-md text-xs font-medium ${
                            user.is_admin
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {user.is_admin ? '관리자 해제' : '관리자 지정'}
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 