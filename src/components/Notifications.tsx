import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ExternalLink, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';
import { fetchNotifications, type Notification } from '../data/dataService';

const TYPE_CONFIG: Record<string, { border: string; badge: string; icon: React.ReactNode; label: string }> = {
  exam: { border: 'border-l-blue-500', badge: 'badge-blue', icon: <Calendar className="w-4 h-4 text-blue-600" />, label: 'Exam Update' },
  result: { border: 'border-l-green-500', badge: 'badge-green', icon: <CheckCircle className="w-4 h-4 text-green-600" />, label: 'Result' },
  urgent: { border: 'border-l-red-500', badge: 'badge-red', icon: <AlertCircle className="w-4 h-4 text-red-500" />, label: 'Urgent' },
  general: { border: 'border-l-gray-400', badge: 'badge-gray', icon: <Info className="w-4 h-4 text-gray-400" />, label: 'General' },
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications().then(data => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  const active = notifications.filter(n => n.is_active);
  const filters = [
    { key: 'all', label: 'All', count: active.length },
    { key: 'urgent', label: '🚨 Urgent', count: active.filter(n => n.type === 'urgent').length },
    { key: 'exam', label: '📅 Exam', count: active.filter(n => n.type === 'exam').length },
    { key: 'result', label: '✅ Results', count: active.filter(n => n.type === 'result').length },
    { key: 'general', label: '📢 General', count: active.filter(n => n.type === 'general').length },
  ];

  const filtered = filter === 'all' ? active : active.filter(n => n.type === filter);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-5 space-y-3 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-5 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Header */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="font-heading font-bold text-gray-900 text-lg">Notifications &amp; Updates</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scroll-x-smooth pb-1 -mx-1 px-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`subject-pill flex-shrink-0 flex items-center gap-1 ${filter === f.key ? 'subject-pill-active' : 'subject-pill-inactive'}`}
            >
              {f.label}
              {f.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === f.key ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification cards */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No {filter === 'all' ? '' : filter} notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => {
            const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.general;
            return (
              <div key={n.id} className={`card p-4 border-l-4 ${cfg.border}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">{cfg.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(n.created_at * 1000).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">{n.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{n.content}</p>
                    {n.external_link && (
                      <a
                        href={n.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-[#1e3a5f] text-sm font-semibold hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visit Official Portal
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Links */}
      <div className="card p-4 sm:p-5">
        <h3 className="font-heading font-semibold text-gray-900 mb-3">🔗 Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { title: 'TSLPRB Official Website', url: 'https://tslprb.in/', desc: 'Official exam portal' },
            { title: 'Apply Online', url: 'https://tslprb.in/', desc: 'Submit applications' },
            { title: 'Download Admit Card', url: 'https://tslprb.in/', desc: 'Hall tickets' },
            { title: 'Check Results', url: 'https://tslprb.in/', desc: 'Merit list & results' },
            { title: 'Official Syllabus', url: 'https://tslprb.in/', desc: 'Exam pattern & topics' },
            { title: 'Previous Papers', url: 'https://tslprb.in/', desc: 'Past question papers' },
          ].map(link => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-[#1e3a5f] hover:bg-blue-50 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#1e3a5f]">{link.title}</p>
                <p className="text-xs text-gray-400">{link.desc}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1e3a5f]" />
            </a>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500">
        <strong>Disclaimer:</strong> TGCOP is an independent exam preparation platform. Not affiliated with TSLPRB or Telangana Police. Always verify information through official channels at <a href="https://tslprb.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">tslprb.in</a>.
      </div>
    </div>
  );
}