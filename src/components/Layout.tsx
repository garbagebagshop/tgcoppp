import React from 'react';
import { Shield, BookOpen, Target, Newspaper, Bell, LogOut, Star, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAdminClick: () => void;
}

const tabs = [
  { id: 'qna', label: 'Daily Q&A', shortLabel: 'Q&A', icon: BookOpen },
  { id: 'test', label: 'Daily Test', shortLabel: 'Test', icon: Target },
  { id: 'gk', label: 'GK & Affairs', shortLabel: 'GK', icon: Newspaper },
  { id: 'notifications', label: 'Notifications', shortLabel: 'Alerts', icon: Bell },
];

export function Layout({ children, activeTab, onTabChange, onAdminClick }: LayoutProps) {
  const { user, logout } = useAuth();
  const isPaid = user?.isPaid ?? false;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      {/* ── HEADER ── */}
      <header className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-lg leading-none tracking-wide">TGCOP</div>
              <div className="text-[10px] text-blue-200 leading-none mt-0.5">Telangana Police Prep</div>
            </div>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                {isPaid ? (
                  <span className="hidden sm:flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full text-xs font-semibold">
                    <Crown className="w-3 h-3" /> PRO
                  </span>
                ) : (
                  <a
                    href="https://rzp.io/rzp/Csg5GiBs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-white px-3 py-1 rounded-full text-xs font-bold transition-colors"
                  >
                    <Star className="w-3 h-3" />
                    Upgrade ₹299
                  </a>
                )}
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── UPGRADE BANNER (free users) ── */}
      {user && !isPaid && (
        <div className="upgrade-banner px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <p className="text-sm text-blue-100">
              <strong className="text-white">Free Preview:</strong> Unlock full access — 50 Q/day, full tests, complete GK
            </p>
            <a
              href="https://rzp.io/rzp/Csg5GiBs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
            >
              <span className="line-through text-gray-600 mr-1">₹599</span>₹299/mo
            </a>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 mb-nav">
        {children}
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 pb-safe">
        <div className="grid grid-cols-4 h-16">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive ? 'text-[#1e3a5f]' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-[#eff6ff]' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium leading-none">{tab.shortLabel}</span>
                {isActive && <div className="absolute bottom-0 h-0.5 w-8 bg-[#1e3a5f] rounded-t-full" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── FOOTER (desktop only) ── */}
      <footer className="hidden md:block bg-[#1e3a5f] text-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="text-blue-200">
            <strong className="text-white">TGCOP</strong> – Keeping Telangana Police aspirants exam-ready every day.
          </div>
          <div className="text-blue-300 text-xs text-center">
            Independent platform. Not affiliated with TGLPRB or Telangana Police.
          </div>
        </div>
        {/* Admin link — visible but subtle */}
        <div className="text-center pb-3">
          <button
            onClick={onAdminClick}
            style={{ background: 'none', border: 'none', color: '#4a6fa5', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', opacity: 0.7 }}
          >
            Admin ↗
          </button>
        </div>
      </footer>
    </div>
  );
}