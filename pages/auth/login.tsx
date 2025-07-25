import AuthForm from '../../features/auth/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          습관 형성 앱
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          로그인하고 습관을 만들어보세요
        </p>
      </div>
      <AuthForm type="login" />
    </div>
  );
} 