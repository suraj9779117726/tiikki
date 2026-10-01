import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authApi from '../api/auth';
import { TOKEN_KEY } from '../constants/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    let ignore = false;
    authApi
      .me(token)
      .then((data) => {
        if (!ignore) setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        if (!ignore) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const persistSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login({ email, password });
      persistSession(data);
    },
    [persistSession],
  );

  const register = useCallback(
    async (name, email, password) => {
      const data = await authApi.register({ name, email, password });
      persistSession(data);
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
