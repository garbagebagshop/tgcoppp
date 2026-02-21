import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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

export type Tab = 'qna' | 'test' | 'gk' | 'notifications' | 'upgrade';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('qna');
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleAdminTrigger = () => {
    const enteredPassword = window.prompt('Enter admin password');
    if (enteredPassword === 'TGCOP_ADMIN_123') {
      navigate('/admin');
    }
  };

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

  if (!user) {
    return (
      <>
        <HomePage onLoginClick={() => setShowAuth(true)} onAdminTrigger={handleAdminTrigger} />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </>
    );
  }

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as Tab)}
    >
      {activeTab === 'qna' && <DailyQNA />}
      {activeTab === 'test' && <DailyTest />}
      {activeTab === 'gk' && <DailyGK />}
      {activeTab === 'notifications' && <Notifications />}
      {activeTab === 'upgrade' && <UpgradePage />}
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
