import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { DailyQNA } from './components/DailyQNA';
import { DailyTest } from './components/DailyTest';
import { DailyGK } from './components/DailyGK';
import { Notifications } from './components/Notifications';
import { AuthModal } from './components/AuthModal';
import { UpgradePage } from './components/UpgradePage';
import { HomePage } from './components/HomePage';
import { AdminPage } from './components/AdminPage';

export type Tab = 'qna' | 'test' | 'gk' | 'notifications' | 'upgrade' | 'admin';

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('qna');
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #1e429f, #1a56db)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛡️</div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>TGCOP</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '4px' }}>Loading...</div>
      </div>
    );
  }

  // Admin page — standalone, no Layout wrapper
  if (activeTab === 'admin') {
    return (
      <>
        <AdminPage />
        <div style={{ textAlign: 'center', padding: '12px', background: '#0f172a' }}>
          <button onClick={() => setActiveTab('qna')} style={{
            background: 'none', border: 'none', color: '#475569',
            fontSize: '12px', cursor: 'pointer'
          }}>← Back to App</button>
        </div>
      </>
    );
  }

  // Not logged in → show home page
  if (!user) {
    return (
      <>
        <HomePage onLoginClick={() => setShowAuth(true)} />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        {/* Hidden admin trigger */}
        <div
          onClick={() => setActiveTab('admin')}
          style={{
            position: 'fixed', bottom: 8, right: 12,
            fontSize: '10px', color: 'transparent',
            userSelect: 'none', cursor: 'default', zIndex: 9999
          }}
        >
          TGCOP
        </div>
      </>
    );
  }

  // Logged in → show main app
  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        onAdminClick={() => setActiveTab('admin')}
      >
        {activeTab === 'qna' && <DailyQNA />}
        {activeTab === 'test' && <DailyTest />}
        {activeTab === 'gk' && <DailyGK />}
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'upgrade' && <UpgradePage />}
      </Layout>
    </>
  );
}