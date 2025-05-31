import { useState, useEffect } from 'react';
import { AIPipeAuth } from '../utils/aipipe';

interface AIPipeAuthProps {
  children: React.ReactNode;
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export function AIPipeAuthProvider({ children, onAuthChange }: AIPipeAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<{ email: string; token: string } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const userProfile = AIPipeAuth.getProfile();
      setProfile(userProfile);
      setIsAuthenticated(!!userProfile);
      setIsLoading(false);
      onAuthChange?.(!!userProfile);
    };

    checkAuth();
  }, [onAuthChange]);

  const handleLogin = () => {
    AIPipeAuth.redirectToLogin();
  };

  const handleLogout = () => {
    AIPipeAuth.clearProfile();
    setProfile(null);
    setIsAuthenticated(false);
    onAuthChange?.(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              AI Pipe Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              To use the TDS Virtual Teaching Assistant, you need to authenticate with AI Pipe to access LLM APIs.
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login with AI Pipe
            </button>
            <p className="text-sm text-gray-500 mt-4">
              You'll be redirected to AI Pipe for secure authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">TDS Virtual TA</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {profile?.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
