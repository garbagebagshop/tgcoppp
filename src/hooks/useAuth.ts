import { useState, useEffect } from 'react';

const AUTH_KEY = 'tgcop_auth';
const USERS_KEY = 'tgcop_users';

export interface AuthUser {
  id: string;
  mobile: string;
  email: string;
  name: string;
  isPaid: boolean;
  planExpiry: number; // unix ms
}

interface StoredUser {
  id: string;
  mobile: string;
  email: string;
  name: string;
  planStart: number;
  planMonths: number;
  notes: string;
}

function getPlanExpiry(u: StoredUser): number {
  return u.planStart + u.planMonths * 30 * 24 * 60 * 60 * 1000;
}

function getStoredUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  /**
   * Login with mobile (ID) + email (password).
   * Also supports dev shortcut: any @pro email gets instant paid access.
   */
  const login = (mobile: string, emailOrPassword: string): { success: boolean; error?: string } => {
    // Dev shortcut: @pro in email = instant paid access
    if (emailOrPassword.includes('@pro') || emailOrPassword.includes('+pro')) {
      const devUser: AuthUser = {
        id: 'dev_pro',
        mobile: mobile || '9999999999',
        email: emailOrPassword,
        name: 'Pro Demo User',
        isPaid: true,
        planExpiry: Date.now() + 365 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(devUser));
      setUser(devUser);
      return { success: true };
    }

    // Standard: look up mobile in admin-created users
    const users = getStoredUsers();
    const found = users.find(
      u => u.mobile === mobile.trim() && u.email.toLowerCase() === emailOrPassword.trim().toLowerCase()
    );

    if (!found) {
      return { success: false, error: 'Invalid mobile or email. Check your credentials.' };
    }

    const expiry = getPlanExpiry(found);
    const isPaid = expiry > Date.now();

    const authUser: AuthUser = {
      id: found.id,
      mobile: found.mobile,
      email: found.email,
      name: found.name,
      isPaid,
      planExpiry: expiry,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const isSubscriptionActive = (): boolean => {
    if (!user) return false;
    return user.isPaid && user.planExpiry > Date.now();
  };

  return { user, loading, login, logout, isSubscriptionActive };
}