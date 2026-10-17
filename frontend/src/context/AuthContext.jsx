import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCachedUser());
  const [token, setToken] = useState(() => localStorage.getItem('bookleaf_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and verify session on mount
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('bookleaf_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.user);
          localStorage.setItem('bookleaf_user', JSON.stringify(res.user));
        } catch {
          // Token expired or invalid
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    }

    verifySession();

    function handleAuthExpired() {
      setUser(null);
      setToken(null);
    }

    window.addEventListener('bookleaf_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('bookleaf_auth_expired', handleAuthExpired);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isAuthor: user?.role === 'author',
        isLoading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
