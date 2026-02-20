import React, { useState, useEffect } from 'react';
import { Shield, Plus, LogOut, Users, CheckCircle, XCircle, AlertCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';

const ADMIN_PASSWORD = 'TGCOP@2024';
const STORAGE_KEY = 'tgcop_users';

export interface TGUser {
    id: string;
    mobile: string;
    email: string;
    name: string;
    planStart: number;   // unix timestamp (ms)
    planMonths: number;
    notes: string;
}

function getPlanExpiry(user: TGUser): number {
    return user.planStart + user.planMonths * 30 * 24 * 60 * 60 * 1000;
}

function getDaysLeft(user: TGUser): number {
    return Math.ceil((getPlanExpiry(user) - Date.now()) / (1000 * 60 * 60 * 24));
}

function getUsers(): TGUser[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveUsers(users: TGUser[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [pw, setPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [pwError, setPwError] = useState('');
    const [users, setUsers] = useState<TGUser[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ mobile: '', email: '', name: '', planMonths: '1', notes: '' });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'expiring'>('all');

    useEffect(() => {
        if (authed) setUsers(getUsers());
    }, [authed]);

    const handleLogin = () => {
        if (pw === ADMIN_PASSWORD) {
            setAuthed(true);
            setPwError('');
        } else {
            setPwError('Incorrect password. Try again.');
        }
    };

    const handleAddUser = () => {
        setFormError('');
        setFormSuccess('');
        if (!form.mobile.match(/^[6-9]\d{9}$/)) {
            setFormError('Mobile must be a valid 10-digit Indian number.');
            return;
        }
        if (!form.email.includes('@')) {
            setFormError('Enter a valid email address.');
            return;
        }
        if (!form.name.trim()) {
            setFormError('Name is required.');
            return;
        }
        const existing = users.find(u => u.mobile === form.mobile);
        if (existing) {
            setFormError('A user with this mobile already exists.');
            return;
        }
        const newUser: TGUser = {
            id: `u_${Date.now()}`,
            mobile: form.mobile.trim(),
            email: form.email.trim().toLowerCase(),
            name: form.name.trim(),
            planStart: Date.now(),
            planMonths: parseInt(form.planMonths),
            notes: form.notes.trim(),
        };
        const updated = [...users, newUser];
        saveUsers(updated);
        setUsers(updated);
        setForm({ mobile: '', email: '', name: '', planMonths: '1', notes: '' });
        setShowForm(false);
        setFormSuccess(`✓ User ${newUser.name} added! Login: ${newUser.mobile} / ${newUser.email}`);
        setTimeout(() => setFormSuccess(''), 8000);
    };

    const handleRenew = (id: string, months: number) => {
        const updated = users.map(u =>
            u.id === id
                ? { ...u, planStart: Math.max(Date.now(), getPlanExpiry(u)), planMonths: months }
                : u
        );
        saveUsers(updated);
        setUsers(updated);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this user? This cannot be undone.')) return;
        const updated = users.filter(u => u.id !== id);
        saveUsers(updated);
        setUsers(updated);
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

    // Login Screen
    if (!authed) {
        return (
            <div style={{
                minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a, #1e1b4b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}>
                <div style={{
                    background: '#1e293b', borderRadius: '20px', padding: '40px',
                    width: '100%', maxWidth: '380px', border: '1px solid #334155',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: '14px',
                            background: 'linear-gradient(135deg, #1a56db, #7e3af2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <Shield size={28} color="#fff" />
                        </div>
                        <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', margin: '0 0 6px' }}>Admin Console</h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>TGCOP — Restricted Access</p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            ADMIN PASSWORD
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={pw}
                                onChange={e => setPw(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                placeholder="Enter admin password"
                                style={{
                                    width: '100%', padding: '12px 44px 12px 14px', borderRadius: '10px',
                                    background: '#0f172a', border: `1.5px solid ${pwError ? '#ef4444' : '#334155'}`,
                                    color: '#f8fafc', fontSize: '15px', outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <button onClick={() => setShowPw(!showPw)} style={{
                                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0
                            }}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {pwError && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{pwError}</div>}
                    </div>

                    <button onClick={handleLogin} style={{
                        width: '100%', padding: '13px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1a56db, #1e429f)',
                        color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer'
                    }}>
                        Access Admin Console
                    </button>
                </div>
            </div>
        );
    }

    // Main Admin Dashboard
    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>

            {/* Header */}
            <div style={{
                background: '#1e293b', borderBottom: '1px solid #334155',
                padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={22} color="#1a56db" />
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '16px' }}>TGCOP Admin</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>User Management Console</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setUsers(getUsers())} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '8px', background: '#334155',
                        color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '13px'
                    }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button onClick={() => setAuthed(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '8px', background: '#334155',
                        color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '13px'
                    }}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            <div style={{ padding: '20px', maxWidth: 1100, margin: '0 auto' }}>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    {[
                        { label: 'Total Users', value: stats.total, icon: Users, color: '#60a5fa' },
                        { label: 'Active', value: stats.active, icon: CheckCircle, color: '#34d399' },
                        { label: 'Expiring Soon', value: stats.expiring, icon: AlertCircle, color: '#fbbf24' },
                        { label: 'Expired', value: stats.expired, icon: XCircle, color: '#f87171' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} style={{
                            background: '#1e293b', borderRadius: '14px', padding: '18px',
                            border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '8px'
                        }}>
                            <Icon size={20} color={color} />
                            <div style={{ fontSize: '28px', fontWeight: 800, color }}>{value}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    {/* Filter chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(['all', 'active', 'expiring', 'expired'] as const).map(f => (
                            <button key={f} onClick={() => setFilterStatus(f)} style={{
                                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                cursor: 'pointer',
                                background: filterStatus === f ? '#1a56db' : '#1e293b',
                                color: filterStatus === f ? '#fff' : '#94a3b8',
                                border: filterStatus === f ? 'none' : '1px solid #334155'
                            } as React.CSSProperties}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {f === 'expiring' && stats.expiring > 0 && (
                                    <span style={{ marginLeft: '6px', background: '#f59e0b', color: '#000', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>
                                        {stats.expiring}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <button onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess(''); }} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 18px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1a56db, #1e429f)',
                        color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer'
                    }}>
                        <Plus size={16} /> {showForm ? 'Cancel' : 'Add New User'}
                    </button>
                </div>

                {/* Success message */}
                {formSuccess && (
                    <div style={{
                        background: '#064e3b', border: '1px solid #34d399', borderRadius: '10px',
                        padding: '12px 16px', marginBottom: '16px', color: '#34d399', fontSize: '13px'
                    }}>
                        {formSuccess}
                    </div>
                )}

                {/* Add User Form */}
                {showForm && (
                    <div style={{
                        background: '#1e293b', borderRadius: '16px', padding: '24px',
                        border: '1px solid #334155', marginBottom: '20px'
                    }}>
                        <h3 style={{ margin: '0 0 20px', color: '#f8fafc', fontSize: '16px', fontWeight: 700 }}>
                            ➕ Onboard New User
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                            {[
                                { key: 'name', label: 'Full Name', placeholder: 'e.g. Ramesh Kumar', type: 'text' },
                                { key: 'mobile', label: 'Mobile Number (Login ID)', placeholder: '10-digit number', type: 'tel' },
                                { key: 'email', label: 'Gmail (Password)', placeholder: 'user@gmail.com', type: 'email' },
                            ].map(({ key, label, placeholder, type }) => (
                                <div key={key}>
                                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        value={form[key as keyof typeof form]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        placeholder={placeholder}
                                        style={{
                                            width: '100%', padding: '10px 12px', borderRadius: '8px',
                                            background: '#0f172a', border: '1px solid #334155',
                                            color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
                                    Plan Duration
                                </label>
                                <select
                                    value={form.planMonths}
                                    onChange={e => setForm(f => ({ ...f, planMonths: e.target.value }))}
                                    style={{
                                        width: '100%', padding: '10px 12px', borderRadius: '8px',
                                        background: '#0f172a', border: '1px solid #334155',
                                        color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="1">1 Month — ₹299</option>
                                    <option value="3">3 Months — ₹799</option>
                                    <option value="6">6 Months — ₹1,499</option>
                                    <option value="12">12 Months — ₹2,499</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
                                Notes (optional)
                            </label>
                            <input
                                type="text"
                                value={form.notes}
                                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                placeholder="e.g. Paid via UPI on 20-Feb-2024"
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                                    background: '#0f172a', border: '1px solid #334155',
                                    color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        {formError && (
                            <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{formError}</div>
                        )}
                        <button onClick={handleAddUser} style={{
                            padding: '11px 28px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #059669, #047857)',
                            color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer'
                        }}>
                            ✓ Create User Account
                        </button>
                    </div>
                )}

                {/* Users Table */}
                <div style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
                            {filterStatus === 'all' ? 'All Users' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                            <span style={{ marginLeft: '10px', color: '#94a3b8', fontSize: '13px', fontWeight: 400 }}>
                                ({filteredUsers.length})
                            </span>
                        </h3>
                    </div>

                    {filteredUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                            <Users size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                            <div style={{ fontWeight: 600 }}>No users found</div>
                            <div style={{ fontSize: '13px', marginTop: '4px' }}>
                                {filterStatus === 'all' ? 'Add your first user using the button above.' : `No ${filterStatus} users.`}
                            </div>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#0f172a' }}>
                                        {['Name', 'Mobile (ID)', 'Email (Password)', 'Plan', 'Expires', 'Status', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '11px', letterSpacing: '0.5px' }}>
                                                {h.toUpperCase()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, i) => {
                                        const daysLeft = getDaysLeft(user);
                                        const expiry = new Date(getPlanExpiry(user));
                                        const isExpired = daysLeft <= 0;
                                        const isExpiring = daysLeft > 0 && daysLeft <= 7;
                                        const statusColor = isExpired ? '#f87171' : isExpiring ? '#fbbf24' : '#34d399';
                                        const statusLabel = isExpired ? 'Expired' : isExpiring ? `${daysLeft}d left` : 'Active';

                                        return (
                                            <tr key={user.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0f172a22' }}>
                                                <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 600 }}>
                                                    {user.name}
                                                    {user.notes && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{user.notes}</div>}
                                                </td>
                                                <td style={{ padding: '14px 16px', color: '#93c5fd', fontFamily: 'monospace' }}>{user.mobile}</td>
                                                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{user.email}</td>
                                                <td style={{ padding: '14px 16px', color: '#c4b5fd' }}>{user.planMonths}M</td>
                                                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>
                                                    {expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{
                                                        background: statusColor + '22', color: statusColor,
                                                        borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700
                                                    }}>{statusLabel}</span>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <select
                                                            onChange={e => { if (e.target.value) handleRenew(user.id, parseInt(e.target.value)); e.target.value = ''; }}
                                                            style={{
                                                                background: '#334155', border: 'none', borderRadius: '6px',
                                                                color: '#94a3b8', fontSize: '11px', padding: '5px 8px', cursor: 'pointer'
                                                            }}
                                                            defaultValue=""
                                                        >
                                                            <option value="" disabled>Renew</option>
                                                            <option value="1">+1 Month</option>
                                                            <option value="3">+3 Months</option>
                                                            <option value="6">+6 Months</option>
                                                            <option value="12">+12 Months</option>
                                                        </select>
                                                        <button onClick={() => handleDelete(user.id)} style={{
                                                            background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px',
                                                            color: '#f87171', fontSize: '11px', padding: '5px 10px', cursor: 'pointer'
                                                        }}>Delete</button>
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

                {/* Footer note */}
                <div style={{ textAlign: 'center', marginTop: '24px', color: '#475569', fontSize: '12px' }}>
                    All data stored locally in browser. Export to spreadsheet periodically for backup.
                </div>
            </div>
        </div>
    );
}
