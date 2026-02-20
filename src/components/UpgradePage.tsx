import React from 'react';
import { Crown, CheckCircle, X, Shield, Star, Zap } from 'lucide-react';

interface UpgradePageProps {
    onClose?: () => void;
}

const FEATURES = [
    { free: '10 Q&A per subject', pro: '50 Q&A per subject (daily)', icon: '📚' },
    { free: '25-question test only', pro: '100-question full mock test', icon: '⏱️' },
    { free: '3 GK updates + 5 facts', pro: 'Full GK + all MCQs + facts', icon: '📰' },
    { free: 'All notifications', pro: 'All notifications + alerts', icon: '🔔' },
    { free: 'No explanations saved', pro: 'Detailed answer explanations', icon: '💡' },
    { free: '—', pro: 'Progress tracking (coming)', icon: '📊' },
];

export function UpgradePage({ onClose }: UpgradePageProps) {
    return (
        <div className="space-y-5 animate-fade-up max-w-lg mx-auto">
            {/* Hero */}
            <div className="card p-6 text-center bg-gradient-to-br from-[#1e3a5f] to-[#1a5fa8] text-white relative overflow-hidden">
                <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <X className="w-4 h-4" />
                </button>
                <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="font-heading font-bold text-2xl mb-1">TGCOP Pro</h2>
                <p className="text-blue-200 text-sm mb-5">Daily full access for serious aspirants</p>

                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-4xl font-heading font-bold">₹299</span>
                    <div className="text-left">
                        <div className="text-sm text-blue-200">per month</div>
                        <div className="text-xs line-through text-blue-400">₹599/month</div>
                    </div>
                </div>
                <div className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full inline-block mb-5">
                    🎯 Early Access Price — 50% Off
                </div>

                <button className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 text-base">
                    <Zap className="w-5 h-5" /> Upgrade to Pro — ₹299/mo
                </button>
                <p className="text-blue-300 text-xs mt-2">Cancel anytime · Instant access</p>
            </div>

            {/* Feature comparison */}
            <div className="card p-4 sm:p-5">
                <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" /> What's included
                </h3>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-3 py-2 text-xs text-gray-500 w-8"></th>
                                <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Free</th>
                                <th className="text-left px-3 py-2 text-xs font-semibold text-[#1e3a5f]">
                                    <Crown className="w-3 h-3 inline mr-1 text-amber-500" />Pro
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {FEATURES.map((f, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-3 py-2.5 text-base">{f.icon}</td>
                                    <td className="px-3 py-2.5 text-gray-400 text-xs">{f.free}</td>
                                    <td className="px-3 py-2.5 text-gray-800 font-medium text-xs flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{f.pro}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trust */}
            <div className="card p-4 border border-amber-200 bg-amber-50">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-900 text-sm mb-1">Simple & Safe</p>
                        <p className="text-amber-700 text-xs leading-relaxed">
                            We're in early access. Payment handled via Razorpay (secure). Once we add payment integration, you'll receive Pro access instantly on verification.
                            For now, use <code className="bg-amber-100 px-1 rounded">test@pro</code> as demo.
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={onClose}
                className="btn-secondary w-full text-sm"
            >
                Continue with Free Access
            </button>

            <p className="text-center text-xs text-gray-300">
                TGCOP — Independent exam prep platform. Not affiliated with TSLPRB.
            </p>
        </div>
    );
}
