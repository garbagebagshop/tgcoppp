import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Plus, LogOut, Users, CheckCircle, XCircle, AlertCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';

const ADMIN_PASSWORD = 'TGCOP@2024';
const STORAGE_KEY = 'tgcop_users'; // local cache

export interface TGUser {
    id: string;
    mobile: string;
    email: string;
    name: string;
    plan_start: number;
    plan_months: number;
    notes: string;
}

// For backward compat with any code that uses planStart/planMonths
function normalize(u: Record<string, unknown>): TGUser {
    return {
        id: String(u.id ?? u.id),
        mobile: String(u.mobile ?? ''),
        email: String(u.email ?? ''),
        name: String(u.name ?? ''),
        plan_start: Number(u.plan_start ?? (u as { planStart?: unknown }).planStart ?? 0),
        plan_months: Number(u.plan_months ?? (u as { planMonths?: unknown }).planMonths ?? 1),
        notes: String(u.notes ?? ''),
    };
}

function getPlanExpiry(u: TGUser): number {
    return u.plan_start + u.plan_months * 30 * 24 * 60 * 60 * 1000;
}
function getDaysLeft(u: TGUser): number {
    return Math.ceil((getPlanExpiry(u) - Date.now()) / (1000 * 60 * 60 * 24));
}
function saveLocal(users: TGUser[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

const adminHeaders = (pw: string) => ({
    'Content-Type': 'application/json',
    'x-admin-password': pw,
});

export function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [pw, setPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [pwError, setPwError] = useState('');
    const [users, setUsers] = useState<TGUser[]>([]);
    const [apiOnline, setApiOnline] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ mobile: '', email: '', name: '', planMonths: '1', notes: '' });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'expiring'>('all');
    const [syncing, setSyncing] = useState(false);

    const fetchUsers = useCallback(async (password: string) => {
        setSyncing(true);
        try {
            const res = await fetch('/api/admin/users', { headers: adminHeaders(password) });
            if (res.ok) {
                const data = await res.json();
                const normalized = (data.users as Record<string, unknown>[]).map(normalize);
                setUsers(normalized);
                saveLocal(normalized);
                setApiOnline(true);
            } else {
                throw new Error('API error');
            }
        } catch {
            // Fallback to localStorage
            setApiOnline(false);
            try {
                const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                setUsers((local as Record<string, unknown>[]).map(normalize));
            } catch { setUsers([]); }
        } finally {
            setSyncing(false);
        }
    }, []);

    const handleLogin = () => {
        if (pw === ADMIN_PASSWORD) {
            setAuthed(true);
            setPwError('');
            fetchUsers(pw);
        } else {
            setPwError('Incorrect password. Try again.');
        }
    };

    const handleAddUser = async () => {
        setFormError(''); setFormSuccess('');
        if (!form.mobile.match(/^[6-9]\d{9}$/)) { setFormError('Mobile must be a valid 10-digit Indian number.'); return; }
        if (!form.email.includes('@')) { setFormError('Enter a valid email address.'); return; }
        if (!form.name.trim()) { setFormError('Name is required.'); return; }

        try {
            if (apiOnline) {
                const res = await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: adminHeaders(ADMIN_PASSWORD),
                    body: JSON.stringify({ ...form, planMonths: Number(form.planMonths) }),
                });
                const data = await res.json();
                if (!res.ok) { setFormError(data.error || 'Failed to create user.'); return; }
            } else {
                // offline — save to localStorage only
                const existing = users.find(u => u.mobile === form.mobile);
                if (existing) { setFormError('A user with this mobile already exists.'); return; }
                const newUser: TGUser = {
                    id: `u_${Date.now()}`,
                    mobile: form.mobile.trim(),
                    email: form.email.trim().toLowerCase(),
                    name: form.name.trim(),
                    plan_start: Date.now(),
                    plan_months: Number(form.planMonths),
                    notes: form.notes.trim(),
                };
                const updated = [...users, newUser];
                saveLocal(updated);
                setUsers(updated);
            }
            setForm({ mobile: '', email: '', name: '', planMonths: '1', notes: '' });
            setShowForm(false);
            setFormSuccess(`✓ User ${form.name} added! Login: ${form.mobile} / ${form.email}`);
            setTimeout(() => setFormSuccess(''), 8000);
            fetchUsers(ADMIN_PASSWORD);
        } catch {
            setFormError('Network error. User saved locally.');
        }
    };

    const handleRenew = async (id: string, months: number) => {
        try {
            if (apiOnline) {
                await fetch(`/api/admin/user?id=${id}`, {
                    method: 'PUT',
                    headers: adminHeaders(ADMIN_PASSWORD),
                    body: JSON.stringify({ planMonths: months }),
                });
                fetchUsers(ADMIN_PASSWORD);
            } else {
                const updated = users.map(u =>
                    u.id === id ? { ...u, plan_start: Math.max(Date.now(), getPlanExpiry(u)), plan_months: months } : u
                );
                saveLocal(updated);
                setUsers(updated);
            }
        } catch { /* ignore */ }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this user? This cannot be undone.')) return;
        try {
            if (apiOnline) {
                await fetch(`/api/admin/user?id=${id}`, { method: 'DELETE', headers: adminHeaders(ADMIN_PASSWORD) });
                fetchUsers(ADMIN_PASSWORD);
            } else {
                const updated = users.filter(u => u.id !== id);
                saveLocal(updated);
                setUsers(updated);
            }
        } catch { /* ignore */ }
    };

    const filteredUsers = users.filter(u => {
        const days = getDaysLeft(u);
        if (filterStatus === 'active') return days > 7;
        if (filterStatus === 'expiring') return days <= 7 && days > 0;
        if (filterStatus === 'expired') return days <= 0;
        return true;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => getDaysLeft(u) > 7).length,
        expiring: users.filter(u => { const d = getDaysLeft(u); return d <= 7 && d > 0; }).length,
        expired: users.filter(u => getDaysLeft(u) <= 0).length,
    };

    if (!authed) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a, #1e1b4b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: '#1e293b', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '380px', border: '1px solid #334155', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '14px', background: 'linear-gradient(135deg, #1a56db, #7e3af2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <Shield size={28} color="#fff" />
                        </div>
                        <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', margin: '0 0 6px' }}>Admin Console</h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>TGCOP — Restricted Access</p>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>ADMIN PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Enter admin password"
                                style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: '10px', background: '#0f172a', border: `1.5px solid ${pwError ? '#ef4444' : '#334155'}`, color: '#f8fafc', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {pwError && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{pwError}</div>}
                    </div>
                    <button onClick={handleLogin} style={{ width: '100%', padding: '13px', borderRadius: '10px', background: 'linear-gradient(135deg, #1a56db, #1e429f)', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}>
                        Access Admin Console
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={22} color="#1a56db" />
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '16px' }}>TGCOP Admin</div>
                        <div style={{ fontSize: '11px', color: apiOnline ? '#34d399' : '#f59e0b' }}>
                            {apiOnline ? '● Turso DB connected' : '⚠ Offline — localStorage mode'}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => fetchUsers(ADMIN_PASSWORD)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: '#334155', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                        <RefreshCw size={14} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} /> Refresh
                    </button>
                    <button onClick={() => setAuthed(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: '#334155', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            <div style={{ padding: '20px', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    {[
                        { label: 'Total Users', value: stats.total, icon: Users, color: '#60a5fa' },
                        { label: 'Active', value: stats.active, icon: CheckCircle, color: '#34d399' },
                        { label: 'Expiring Soon', value: stats.expiring, icon: AlertCircle, color: '#fbbf24' },
                        { label: 'Expired', value: stats.expired, icon: XCircle, color: '#f87171' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} style={{ background: '#1e293b', borderRadius: '14px', padding: '18px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Icon size={20} color={color} />
                            <div style={{ fontSize: '28px', fontWeight: 800, color }}>{value}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['all', 'active', 'expiring', 'expired'] as const).map(f => (
                            <button key={f} onClick={() => setFilterStatus(f)} style={{
                                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                background: filterStatus === f ? '#1a56db' : '#1e293b',
                                color: filterStatus === f ? '#fff' : '#94a3b8',
                                border: filterStatus === f ? 'none' : '1px solid #334155',
                            }}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {f === 'expiring' && stats.expiring > 0 && (
                                    <span style={{ marginLeft: '6px', background: '#f59e0b', color: '#000', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>{stats.expiring}</span>
                                )}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess(''); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #1a56db, #1e429f)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                        <Plus size={16} /> {showForm ? 'Cancel' : 'Add New User'}
                    </button>
                </div>

                {formSuccess && <div style={{ background: '#064e3b', border: '1px solid #34d399', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#34d399', fontSize: '13px' }}>{formSuccess}</div>}

                {showForm && (
                    <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155', marginBottom: '20px' }}>
                        <h3 style={{ margin: '0 0 20px', color: '#f8fafc', fontSize: '16px', fontWeight: 700 }}>➕ Onboard New User</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                            {[
                                { key: 'name', label: 'Full Name', placeholder: 'e.g. Ramesh Kumar', type: 'text' },
                                { key: 'mobile', label: 'Mobile Number (Login ID)', placeholder: '10-digit number', type: 'tel' },
                                { key: 'email', label: 'Gmail (Password)', placeholder: 'user@gmail.com', type: 'email' },
                            ].map(({ key, label, placeholder, type }) => (
                                <div key={key}>
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>{label}</label>
                                    <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>Plan Duration</label>
                                <select value={form.planMonths} onChange={e => setForm(f => ({ ...f, planMonths: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                                    <option value="1">1 Month — ₹299</option>
                                    <option value="3">3 Months — ₹799</option>
                                    <option value="6">6 Months — ₹1,499</option>
                                    <option value="12">12 Months — ₹2,499</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>Notes (optional)</label>
                            <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. Paid via UPI on 20-Feb-2024"
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        {formError && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{formError}</div>}
                        <button onClick={handleAddUser} style={{ padding: '11px 28px', borderRadius: '10px', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                            ✓ Create User Account
                        </button>
                    </div>
                )}

                <div style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
                            {filterStatus === 'all' ? 'All Users' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                            <span style={{ marginLeft: '10px', color: '#94a3b8', fontSize: '13px', fontWeight: 400 }}>({filteredUsers.length})</span>
                        </h3>
                    </div>

                    {filteredUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                            <Users size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                            <div style={{ fontWeight: 600 }}>No users found</div>
                            <div style={{ fontSize: '13px', marginTop: '4px' }}>{filterStatus === 'all' ? 'Add your first user above.' : `No ${filterStatus} users.`}</div>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#0f172a' }}>
                                        {['Name', 'Mobile (ID)', 'Email (Password)', 'Plan', 'Expires', 'Status', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '11px', letterSpacing: '0.5px' }}>{h.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u, i) => {
                                        const daysLeft = getDaysLeft(u);
                                        const expiry = new Date(getPlanExpiry(u));
                                        const isExpired = daysLeft <= 0;
                                        const isExpiring = daysLeft > 0 && daysLeft <= 7;
                                        const statusColor = isExpired ? '#f87171' : isExpiring ? '#fbbf24' : '#34d399';
                                        const statusLabel = isExpired ? 'Expired' : isExpiring ? `${daysLeft}d left` : 'Active';
                                        return (
                                            <tr key={u.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0f172a22' }}>
                                                <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600 }}>
                                                    {u.name}
                                                    {u.notes && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{u.notes}</div>}
                                                </td>
                                                <td style={{ padding: '14px 16px', color: '#93c5fd', fontFamily: 'monospace' }}>{u.mobile}</td>
                                                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{u.email}</td>
                                                <td style={{ padding: '14px 16px', color: '#c4b5fd' }}>{u.plan_months}M</td>
                                                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{ background: statusColor + '22', color: statusColor, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>{statusLabel}</span>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <select onChange={e => { if (e.target.value) handleRenew(u.id, parseInt(e.target.value)); e.target.value = ''; }}
                                                            style={{ background: '#334155', border: 'none', borderRadius: '6px', color: '#94a3b8', fontSize: '11px', padding: '5px 8px', cursor: 'pointer' }} defaultValue="">
                                                            <option value="" disabled>Renew</option>
                                                            <option value="1">+1 Month</option>
                                                            <option value="3">+3 Months</option>
                                                            <option value="6">+6 Months</option>
                                                            <option value="12">+12 Months</option>
                                                        </select>
                                                        <button onClick={() => handleDelete(u.id)} style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#f87171', fontSize: '11px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px', color: '#475569', fontSize: '12px' }}>
                    {apiOnline ? 'Data synced with Turso DB ✓' : 'Offline mode — data saved locally. Will sync when online.'}
                </div>
            </div>
        </div>
    );
}
