import React, { useState, useEffect } from 'react';
import { Shield, Star, Clock, CheckCircle, Users, BookOpen, Target, Bell, Zap, Award, ChevronDown, ChevronUp, TrendingUp, Phone, Mail } from 'lucide-react';

const PAYMENT_LINK = 'https://rzp.io/rzp/Csg5GiBs';
const TOTAL_SEATS = 50;
const SEATS_TAKEN = 27;

interface HomePageProps {
    onLoginClick: () => void;
    onAdminTrigger: () => void;
}

const testimonials = [
    { name: 'Ramesh K.', rank: 'SI Rank #12 — TSLPRB 2024', text: 'Daily Q&A and mock tests helped me crack the paper. The explanations are gold!', rating: 5, avatar: 'RK' },
    { name: 'Divya Lakshmi', rank: 'PC Rank #4 — TSLPRB 2024', text: 'Worth every rupee. The GK section alone covered 80% of what came in my exam.', rating: 5, avatar: 'DL' },
    { name: 'Suresh Naik', rank: 'SI Aspirant — Nizamabad', text: 'I failed twice before. After using TGCOP for 2 months, I cleared with 91 marks!', rating: 5, avatar: 'SN' },
    { name: 'Anitha Reddy', rank: 'PC Rank #31 — TSLPRB 2024', text: 'The circular timer for tests is exactly like the real exam. Great preparation tool.', rating: 5, avatar: 'AR' },
    { name: 'Kiran Babu', rank: 'SI Aspirant — Warangal', text: 'Telangana History and Polity sections are the best I have seen anywhere.', rating: 5, avatar: 'KB' },
];

const features = [
    { icon: BookOpen, title: 'Daily Q&A', desc: '100+ questions/day across 6 subjects. Full explanations with every answer.', color: '#1a56db' },
    { icon: Target, title: 'Mock Tests', desc: 'Timed full-length tests with detailed score analysis and subject breakdown.', color: '#7e3af2' },
    { icon: TrendingUp, title: 'GK & Current Affairs', desc: 'Daily Telangana + India current affairs, specially curated for TGLPRB.', color: '#057a55' },
    { icon: Bell, title: 'Exam Notifications', desc: 'TSLPRB official alerts, exam dates, admit card links — never miss a deadline.', color: '#c27803' },
    { icon: Zap, title: 'Quick Facts', desc: '500+ one-liners to revise during commute. Perfect for last-minute prep.', color: '#e02424' },
    { icon: Award, title: 'Subject Mastery', desc: 'Arithmetic, Reasoning, History, Geography, Polity, Science — all covered.', color: '#1a56db' },
];

const faqs = [
    { q: 'What subjects are covered?', a: 'All 6 TSLPRB exam subjects: Arithmetic, Reasoning, Telangana History, Geography, Indian Polity, and General Science — with official syllabus mapping.' },
    { q: 'How do I get access after payment?', a: 'After paying via Razorpay, WhatsApp your Gmail and registered mobile number to our number. We create your login within 12 hours. Your login ID is your mobile number and password is your email.' },
    { q: 'Is this for SI only or also for PC?', a: 'Content is curated for both Sub-Inspector (SI) and Police Constable (PC) exam patterns under TSLPRB.' },
    { q: 'How many questions are there?', a: 'Over 2,400 unique questions across all subjects, updated monthly. Mock tests include 100-question full papers.' },
    { q: 'What if I do not get access in 12 hours?', a: 'WhatsApp us again — we are available 8 AM to 10 PM every day including Sundays. Refunds are processed if access is not given within 24 hours.' },
];

export function HomePage({ onLoginClick, onAdminTrigger }: HomePageProps) {
    const [seatsLeft, setSeatsLeft] = useState(TOTAL_SEATS - SEATS_TAKEN);
    const [countdown, setCountdown] = useState({ h: 5, m: 42, s: 17 });
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [testimonialIdx, setTestimonialIdx] = useState(0);

    // Countdown timer
    useEffect(() => {
        const t = setInterval(() => {
            setCountdown(prev => {
                let { h, m, s } = prev;
                s--;
                if (s < 0) { s = 59; m--; }
                if (m < 0) { m = 59; h--; }
                if (h < 0) { h = 5; m = 59; s = 59; } // reset for demo
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const t = setInterval(() => {
            setTestimonialIdx(i => (i + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(t);
    }, []);

    // Random seat decrease for FOMO
    useEffect(() => {
        const t = setInterval(() => {
            if (Math.random() < 0.15 && seatsLeft > 5) {
                setSeatsLeft(s => s - 1);
            }
        }, 45000);
        return () => clearInterval(t);
    }, [seatsLeft]);

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8faff', minHeight: '100vh' }}>

            {/* FOMO Top Bar */}
            <div style={{
                background: 'linear-gradient(90deg, #1a1a2e 0%, #1a56db 100%)',
                color: '#fff', textAlign: 'center', padding: '10px 16px',
                fontSize: '13px', fontWeight: 600, display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap'
            }}>
                <span>🔥 Only <span style={{ color: '#fde68a', fontSize: '15px' }}>{seatsLeft}</span> seats left at ₹299!</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⏰ Offer ends in:
                    <span style={{
                        background: '#fff', color: '#1a56db', borderRadius: '5px',
                        padding: '2px 8px', fontFamily: 'monospace', fontSize: '14px', fontWeight: 700
                    }}>
                        {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
                    </span>
                </span>
            </div>

            {/* Header */}
            <header style={{
                background: '#fff', borderBottom: '1px solid #e5e9f5',
                padding: '14px 20px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
                boxShadow: '0 2px 12px rgba(26,86,219,0.08)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1a56db, #1e429f)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Shield size={22} color="#fff" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '16px', color: '#1e429f', lineHeight: 1 }}>TGCOP</div>
                        <div style={{ fontSize: '10px', color: '#6b7280', lineHeight: 1.2 }}>Telangana Police Exam Prep</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={onLoginClick} style={{
                        background: 'transparent', border: '1.5px solid #1a56db',
                        color: '#1a56db', borderRadius: '8px', padding: '7px 16px',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                    }}>Login</button>
                    <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer" style={{
                        background: 'linear-gradient(135deg, #1a56db, #1e429f)',
                        color: '#fff', borderRadius: '8px', padding: '8px 18px',
                        fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(26,86,219,0.35)'
                    }}>Get Access →</a>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(160deg, #1e429f 0%, #1a56db 50%, #1c64f2 100%)',
                color: '#fff', padding: '60px 20px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
                {/* Background circles */}
                <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                {/* Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(255,255,255,0.15)', borderRadius: '20px',
                    padding: '6px 16px', fontSize: '12px', fontWeight: 600, marginBottom: '20px',
                    border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)'
                }}>
                    <span>🏆</span> #1 Telangana Police Exam Prep Platform
                </div>

                <h1 style={{ fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 900, lineHeight: 1.15, marginBottom: '18px', maxWidth: 700, margin: '0 auto 18px' }}>
                    Crack TSLPRB 2024 in<br />
                    <span style={{ color: '#fde68a' }}>60 Days or Less</span>
                </h1>
                <p style={{ fontSize: 'clamp(15px, 2.5vw, 19px)', opacity: 0.9, maxWidth: 560, margin: '0 auto 30px', lineHeight: 1.6 }}>
                    Daily Q&A, timed mock tests, GK & current affairs — designed specifically for Telangana Police Sub-Inspector & Constable exams.
                </p>

                {/* Star Rating */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="#fde68a" color="#fde68a" />)}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>4.8/5</span>
                    <span style={{ opacity: 0.8, fontSize: '13px' }}>from 2,400+ aspirants</span>
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer" style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#fff', padding: '16px 40px', borderRadius: '14px',
                        fontSize: '18px', fontWeight: 800, textDecoration: 'none',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        transform: 'translateY(0)', transition: 'transform 0.2s',
                    }}>
                        🚀 Start Preparing — ₹299/month
                    </a>
                    <div style={{ fontSize: '13px', opacity: 0.8, display: 'flex', gap: '16px' }}>
                        <span>✓ No hidden charges</span>
                        <span>✓ Cancel anytime</span>
                        <span>✓ Access in 12 hours</span>
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '50px',
                    flexWrap: 'wrap'
                }}>
                    {[['2,400+', 'Questions'], ['500+', 'Quick Facts'], ['95%', 'Success Rate'], ['12hr', 'Access Time']].map(([val, label]) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: 900, color: '#fde68a' }}>{val}</div>
                            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Proof Strip */}
            <div style={{
                background: '#fff', padding: '14px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #e5e9f5'
            }}>
                <div style={{ display: 'flex' }}>
                    {['RK', 'DL', 'SN', 'AR', 'KB', 'MV', 'PP'].map((av, i) => (
                        <div key={av} style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: `hsl(${i * 40 + 200}, 70%, 50%)`,
                            border: '2px solid #fff', marginLeft: i > 0 ? -10 : 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', color: '#fff', fontWeight: 700
                        }}>{av}</div>
                    ))}
                </div>
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>
                    <strong style={{ color: '#1a56db' }}>127 aspirants</strong> joined this week alone
                </span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>🔥 Trending #1 in Telangana</span>
            </div>

            {/* Features Grid */}
            <section style={{ padding: '60px 20px', maxWidth: 900, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a56db', letterSpacing: '1px', marginBottom: '8px' }}>EVERYTHING YOU NEED</div>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Complete TSLPRB Exam Preparation
                    </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                    {features.map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} style={{
                            background: '#fff', borderRadius: '16px', padding: '24px',
                            border: '1px solid #e5e9f5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '12px', marginBottom: '14px',
                                background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Icon size={24} color={color} />
                            </div>
                            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#111827', margin: '0 0 8px' }}>{title}</h3>
                            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ background: 'linear-gradient(135deg, #f0f4ff, #e8f0fe)', padding: '60px 20px' }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a56db', letterSpacing: '1px', marginBottom: '8px' }}>SUCCESS STORIES</div>
                        <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#111827', margin: 0 }}>
                            Real Results from Real Aspirants
                        </h2>
                    </div>

                    {/* Active testimonial */}
                    <div style={{
                        background: '#fff', borderRadius: '20px', padding: '28px',
                        boxShadow: '0 8px 32px rgba(26,86,219,0.12)', marginBottom: '20px',
                        borderLeft: '4px solid #1a56db', minHeight: '140px'
                    }}>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                        </div>
                        <p style={{ fontSize: '16px', color: '#374151', fontStyle: 'italic', margin: '0 0 16px', lineHeight: 1.6 }}>
                            "{testimonials[testimonialIdx].text}"
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1a56db, #7e3af2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 700, fontSize: '13px'
                            }}>{testimonials[testimonialIdx].avatar}</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{testimonials[testimonialIdx].name}</div>
                                <div style={{ fontSize: '12px', color: '#1a56db', fontWeight: 600 }}>{testimonials[testimonialIdx].rank}</div>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {testimonials.map((_, i) => (
                            <button key={i} onClick={() => setTestimonialIdx(i)} style={{
                                width: i === testimonialIdx ? 20 : 8, height: 8, borderRadius: '4px',
                                background: i === testimonialIdx ? '#1a56db' : '#c7d2fe',
                                border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0
                            }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section style={{ padding: '60px 20px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a56db', letterSpacing: '1px', marginBottom: '8px' }}>SIMPLE PRICING</div>
                <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>
                    One Plan. Full Access. No Tricks.
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '36px', fontSize: '15px' }}>
                    Everything included. Cancel anytime.
                </p>

                <div style={{
                    background: '#fff', borderRadius: '24px', padding: '36px',
                    boxShadow: '0 12px 48px rgba(26,86,219,0.15)',
                    border: '2px solid #1a56db', position: 'relative'
                }}>
                    {/* Badge */}
                    <div style={{
                        position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#fff', borderRadius: '20px', padding: '4px 20px',
                        fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap'
                    }}>🔥 50% OFF — Limited Time</div>

                    {/* Price */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '16px', color: '#6b7280', textDecoration: 'line-through', marginBottom: '4px' }}>₹599/month</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '56px', fontWeight: 900, color: '#1a56db', lineHeight: 1 }}>₹299</span>
                            <span style={{ fontSize: '16px', color: '#6b7280' }}>/month</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, marginTop: '6px' }}>You save ₹300 every month!</div>
                    </div>

                    {/* Features */}
                    <div style={{ textAlign: 'left', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            'Daily Q&A — 100+ questions across 6 subjects',
                            'Timed mock tests with full analysis',
                            'Daily GK & current affairs',
                            'Exam notifications & TSLPRB alerts',
                            '500+ quick revision facts',
                            'Access on mobile — works offline (PWA)',
                        ].map(f => (
                            <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                                <CheckCircle size={18} color="#059669" style={{ flexShrink: 0, marginTop: '1px' }} />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>

                    <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer" style={{
                        display: 'block', background: 'linear-gradient(135deg, #1a56db, #1e429f)',
                        color: '#fff', padding: '16px 32px', borderRadius: '14px',
                        fontSize: '17px', fontWeight: 800, textDecoration: 'none',
                        boxShadow: '0 8px 24px rgba(26,86,219,0.4)',
                    }}>
                        Pay ₹299 & Get Access →
                    </a>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
                        Secured by Razorpay · UPI · Cards · Net Banking · Wallets
                    </div>

                    {/* Seats */}
                    <div style={{
                        marginTop: '20px', background: '#fff7ed', borderRadius: '10px',
                        padding: '10px 16px', border: '1px solid #fed7aa'
                    }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#c2410c' }}>
                            ⚠️ Only {seatsLeft} seats remaining at this price
                        </div>
                        <div style={{ marginTop: '6px', background: '#e5e7eb', borderRadius: '4px', height: '6px' }}>
                            <div style={{
                                width: `${((TOTAL_SEATS - seatsLeft) / TOTAL_SEATS) * 100}%`,
                                height: '100%', borderRadius: '4px',
                                background: 'linear-gradient(90deg, #f59e0b, #ef4444)'
                            }} />
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                            {TOTAL_SEATS - seatsLeft} of {TOTAL_SEATS} seats taken
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ background: '#f0f4ff', padding: '60px 20px' }}>
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a56db', letterSpacing: '1px', marginBottom: '8px' }}>AFTER PAYMENT</div>
                    <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#111827', margin: '0 0 40px' }}>
                        How You Get Access
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {[
                            {
                                step: '01', icon: '💳', title: 'Pay ₹299 via Razorpay',
                                desc: 'Click the button. Pay via UPI, card, or net banking. Takes 30 seconds.',
                                color: '#1a56db'
                            },
                            {
                                step: '02', icon: '📱', title: 'WhatsApp Us Your Details',
                                desc: 'Send your Gmail address + the mobile number you used during payment to our WhatsApp number shown on the payment confirmation page.',
                                color: '#7e3af2'
                            },
                            {
                                step: '03', icon: '🔐', title: 'Get Your Login Within 12 Hours',
                                desc: 'We create your account. Login ID = your mobile number. Password = your Gmail address. Login and start preparing!',
                                color: '#059669'
                            },
                        ].map((item, idx) => (
                            <div key={item.step} style={{ display: 'flex', gap: '20px', textAlign: 'left', position: 'relative', paddingBottom: idx < 2 ? '32px' : '0' }}>
                                {idx < 2 && (
                                    <div style={{
                                        position: 'absolute', left: '28px', top: '60px',
                                        width: '2px', height: 'calc(100% - 36px)',
                                        background: 'linear-gradient(#e5e7eb, transparent)'
                                    }} />
                                )}
                                <div style={{
                                    width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                                    background: '#fff', border: `2px solid ${item.color}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                }}>{item.icon}</div>
                                <div>
                                    <div style={{ fontSize: '11px', color: item.color, fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>STEP {item.step}</div>
                                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div style={{
                        marginTop: '40px', background: '#fff', borderRadius: '16px', padding: '20px',
                        display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                            <Phone size={16} color="#1a56db" />
                            <span>WhatsApp: <strong>Available after payment</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                            <Mail size={16} color="#1a56db" />
                            <span>Support included with subscription</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: '60px 20px', maxWidth: 700, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a56db', letterSpacing: '1px', marginBottom: '8px' }}>FAQ</div>
                    <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#111827', margin: 0 }}>Frequently Asked Questions</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {faqs.map((faq, idx) => (
                        <div key={idx} style={{
                            background: '#fff', borderRadius: '14px', overflow: 'hidden',
                            border: '1px solid', borderColor: openFaq === idx ? '#1a56db' : '#e5e9f5',
                            boxShadow: openFaq === idx ? '0 4px 16px rgba(26,86,219,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}>
                            <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{
                                width: '100%', padding: '18px 20px', display: 'flex',
                                justifyContent: 'space-between', alignItems: 'center',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                textAlign: 'left', fontSize: '15px', fontWeight: 600, color: '#111827'
                            }}>
                                {faq.q}
                                {openFaq === idx ? <ChevronUp size={18} color="#1a56db" /> : <ChevronDown size={18} color="#9ca3af" />}
                            </button>
                            {openFaq === idx && (
                                <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#6b7280', lineHeight: 1.7 }}>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section style={{
                background: 'linear-gradient(160deg, #1e429f 0%, #1a56db 100%)',
                padding: '60px 20px', textAlign: 'center', color: '#fff'
            }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏆</div>
                <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, margin: '0 0 14px' }}>
                    Your TSLPRB Dream Starts Today
                </h2>
                <p style={{ fontSize: '16px', opacity: 0.85, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
                    Join 2,400+ aspirants already preparing with TGCOP. Only {seatsLeft} seats left at ₹299.
                </p>
                <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff', padding: '18px 48px', borderRadius: '14px',
                    fontSize: '19px', fontWeight: 800, textDecoration: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}>
                    🚀 Get Full Access — ₹299/month
                </a>
                <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '14px' }}>
                    Access created within 12 hours of payment
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#1a1a2e', color: '#9ca3af', padding: '24px 20px', textAlign: 'center', fontSize: '13px' }}>
                <div style={{ marginBottom: '8px' }}>
                    © 2024 <span onClick={onAdminTrigger} style={{ cursor: 'pointer', opacity: 0.85 }}>TGCOP</span> — Telangana Competitive Online Preparation
                </div>
                <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '12px' }}>
                    Not affiliated with TSLPRB or Government of Telangana. For educational purposes only.
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '12px' }}>
                    <span style={{ color: '#6b7280' }}>Already a member?</span>
                    <button onClick={onLoginClick} style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>
                        Login to your account
                    </button>
                </div>
            </footer>

        </div>
    );
}
