import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, CheckCircle, XCircle, Lock, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchDailyGK, type GKData } from '../data/dataService';

const CATEGORY_STYLES: Record<string, { border: string; badge: string; emoji: string }> = {
  'Telangana': { border: 'border-l-[#1e3a5f]', badge: 'bg-blue-100 text-blue-800', emoji: '🏛️' },
  'India': { border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-800', emoji: '🇮🇳' },
  'Government Schemes': { border: 'border-l-green-500', badge: 'bg-green-100 text-green-800', emoji: '📋' },
  'Police': { border: 'border-l-purple-500', badge: 'bg-purple-100 text-purple-800', emoji: '👮' },
  'Awards': { border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-800', emoji: '🏆' },
};

const getCategoryStyle = (cat: string) =>
  CATEGORY_STYLES[cat] ?? { border: 'border-l-gray-400', badge: 'bg-gray-100 text-gray-700', emoji: '📌' };

const FREE_GK_LIMIT = 3;
const FREE_MCQ_LIMIT = 2;
const FREE_FACT_LIMIT = 5;

export function DailyGK() {
  const { isSubscriptionActive } = useAuth();
  const isPaid = isSubscriptionActive();

  const [gkData, setGkData] = useState<GKData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    fetchDailyGK().then(data => {
      setGkData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-5 space-y-3 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }
  if (!gkData) return <div className="card p-8 text-center text-gray-400">No GK updates for today.</div>;

  const categories = ['All', ...Array.from(new Set(gkData.gk_points.map(p => p.category)))];
  const filteredPoints = categoryFilter === 'All' ? gkData.gk_points : gkData.gk_points.filter(p => p.category === categoryFilter);
  const visiblePoints = isPaid ? filteredPoints : filteredPoints.slice(0, FREE_GK_LIMIT);
  const visibleMCQs = isPaid ? gkData.mcqs : gkData.mcqs.slice(0, FREE_MCQ_LIMIT);
  const visibleFacts = isPaid ? gkData.quick_facts : gkData.quick_facts.slice(0, FREE_FACT_LIMIT);

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Header */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="font-heading font-bold text-gray-900 text-lg">Daily GK &amp; Current Affairs</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(gkData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scroll-x-smooth pb-1 -mx-1 px-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`subject-pill flex-shrink-0 ${categoryFilter === cat ? 'subject-pill-active' : 'subject-pill-inactive'}`}
            >
              {cat === 'All' ? '🌐' : getCategoryStyle(cat).emoji} {cat}
            </button>
          ))}
        </div>

        {!isPaid && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              <strong>Free:</strong> Showing limited content.{' '}
              <button className="underline font-semibold text-amber-800">Upgrade for full GK.</button>
            </p>
          </div>
        )}
      </div>

      {/* GK Points */}
      {visiblePoints.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-gray-700 text-sm px-1">📰 Key Updates</h3>
          {visiblePoints.map((point, idx) => {
            const style = getCategoryStyle(point.category);
            return (
              <div key={idx} className={`card p-4 border-l-4 ${style.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge text-xs ${style.badge}`}>{style.emoji} {point.category}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{point.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">{point.description}</p>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-yellow-800">
                    <strong>📌 Exam Tip:</strong> {point.exam_relevance}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paywalled content hint */}
      {!isPaid && gkData.gk_points.length > FREE_GK_LIMIT && (
        <div className="card p-4 border-2 border-dashed border-amber-200 text-center">
          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-1" />
          <p className="text-sm text-gray-600">{gkData.gk_points.length - FREE_GK_LIMIT} more updates locked</p>
        </div>
      )}

      {/* Quick Facts */}
      <div className="card p-4 sm:p-5">
        <h3 className="font-heading font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Quick Facts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {visibleFacts.map((fact, i) => (
            <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
              <p className="text-sm text-gray-700 leading-snug">{fact}</p>
            </div>
          ))}
          {!isPaid && gkData.quick_facts.length > FREE_FACT_LIMIT && (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-2.5 flex items-center justify-center gap-1 text-sm text-gray-400">
              <Lock className="w-3.5 h-3.5" /> +{gkData.quick_facts.length - FREE_FACT_LIMIT} more (Pro)
            </div>
          )}
        </div>
      </div>

      {/* Current Affairs MCQs */}
      {visibleMCQs.length > 0 && (
        <div className="card p-4 sm:p-5">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">📝 Practice MCQs</h3>
          <div className="space-y-5">
            {visibleMCQs.map((mcq, idx) => {
              const sel = selectedAnswers[idx];
              const show = revealed[idx];
              const isCorrect = sel === mcq.correct_answer;

              return (
                <div key={idx} className="border border-gray-100 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-green-100 text-green-800 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-medium text-gray-900 leading-snug">{mcq.question}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                    {(Object.entries(mcq.options) as [string, string][]).map(([key, value]) => {
                      let cls = 'option-default';
                      if (show) {
                        if (key === mcq.correct_answer) cls = 'option-correct';
                        else if (sel === key) cls = 'option-wrong';
                        else cls = 'option-missed';
                      } else if (sel === key) cls = 'option-selected';
                      return (
                        <button
                          key={key}
                          disabled={!!show}
                          onClick={() => setSelectedAnswers(p => ({ ...p, [idx]: key }))}
                          className={`option-btn text-xs ${cls}`}
                        >
                          <span className="font-bold mr-1.5">{key}.</span>{value}
                        </button>
                      );
                    })}
                  </div>

                  {!show && sel && (
                    <button
                      onClick={() => setRevealed(p => ({ ...p, [idx]: true }))}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      Check Answer
                    </button>
                  )}

                  {show && (
                    <div className="flex items-center gap-2 text-xs">
                      {isCorrect
                        ? <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-700 font-semibold">Correct!</span></>
                        : <><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-600 font-semibold">Incorrect — Ans: {mcq.correct_answer}</span></>
                      }
                      <span className="text-gray-400 ml-auto">📎 {mcq.source}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {!isPaid && (
        <div className="card p-6 text-center bg-gradient-to-br from-green-700 to-[#1e3a5f] text-white">
          <div className="text-3xl mb-2">📰</div>
          <h3 className="font-heading font-bold text-lg mb-1">Get Complete GK Coverage</h3>
          <p className="text-green-200 text-sm mb-4">Full daily GK, all current affairs MCQs, and unlimited quick facts</p>
          <button className="btn-gold inline-flex items-center gap-2">
            <span className="line-through text-orange-200 text-xs">₹599</span>
            Upgrade to Pro — ₹299/mo
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
        <strong>Note:</strong> All GK content is curated from verified sources (PIB, government portals, trusted news). We do not invent or fabricate facts. Content is processed specifically for exam preparation.
      </div>
    </div>
  );
}