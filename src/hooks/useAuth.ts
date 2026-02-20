import { useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  mobile: string;
  email: string;
  name: string;
  isPaid: boolean;
  planExpiry: number;
}

const AUTH_KEY = 'tgcop_auth';

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as AuthUser;
    // Re-validate expiry on every load
    if (u.isPaid && u.planExpiry < Date.now()) {
      u.isPaid = false;
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    }
    return u;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
  }, []);

  const login = async (
    mobile: string,
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    const normalizedMobile = mobile.replace(/\D/g, '');

    // Dev shortcut — instant pro access for testing
    if (email.includes('@pro') || email.includes('+pro')) {
      const devUser: AuthUser = {
        id: 'dev',
        mobile: normalizedMobile,
        email,
        name: 'Dev User',
        isPaid: true,
        planExpiry: Date.now() + 365 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(devUser));
      setUser(devUser);
      return { success: true };
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: normalizedMobile, email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed. Check your credentials.' };
      }

      const authUser: AuthUser = data.user;
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    } catch {
      // Fallback to localStorage if API unreachable (offline / local dev without API)
      try {
        const localUsers = JSON.parse(localStorage.getItem('tgcop_users') || '[]');
        const found = localUsers.find(
          (u: { mobile: string; email: string; plan_start: number; plan_months: number; id: string; name: string }) =>
            u.mobile === normalizedMobile &&
            u.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (found) {
          const expiry = found.plan_start + found.plan_months * 30 * 24 * 60 * 60 * 1000;
          const authUser: AuthUser = {
            id: found.id,
            mobile: found.mobile,
            email: found.email,
            name: found.name,
            isPaid: expiry > Date.now(),
            planExpiry: expiry,
          };
          localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
          setUser(authUser);
          return { success: true };
        }
      } catch { /* ignore */ }
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, login, logout, loading };
}