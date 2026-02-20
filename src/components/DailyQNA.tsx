import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Clock, ChevronRight, CheckCircle, XCircle, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchDailyQNA, type Subject, type QNAData } from '../data/dataService';

const SUBJECTS: Subject[] = [
  'General Studies', 'Arithmetic', 'Reasoning',
  'Indian Constitution', 'Telangana History', 'Policing & Law',
];

const SUBJECT_EMOJIS: Record<Subject, string> = {
  'General Studies': '🌍',
  'Arithmetic': '🔢',
  'Reasoning': '🧩',
  'Indian Constitution': '⚖️',
  'Telangana History': '🏛️',
  'Policing & Law': '👮',
};

const FREE_LIMIT = 10;

export function DailyQNA() {
  const { isSubscriptionActive } = useAuth();
  const isPaid = isSubscriptionActive();

  const [subject, setSubject] = useState<Subject>('General Studies');
  const [qnaData, setQnaData] = useState<QNAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const subjectBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedAnswers({});
    setRevealed({});
    fetchDailyQNA(subject).then(data => {
      setQnaData(data);
      setLoading(false);
    });
  }, [subject]);

  const visible = qnaData
    ? isPaid ? qnaData.questions : qnaData.questions.slice(0, FREE_LIMIT)
    : [];

  const answered = Object.keys(selectedAnswers).length;
  const correct = qnaData
    ? Object.entries(selectedAnswers).filter(
      ([id, ans]) => qnaData.questions.find(q => q.id === Number(id))?.correct_answer === ans
    ).length
    : 0;

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Header card */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="font-heading font-bold text-gray-900 text-lg">Daily Q&amp;A</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>

        {/* Subject chips — horizontally scrollable on mobile */}
        <div
          ref={subjectBarRef}
          className="flex gap-2 overflow-x-auto scroll-x-smooth pb-1 -mx-1 px-1"
        >
          {SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`subject-pill flex-shrink-0 ${subject === s ? 'subject-pill-active' : 'subject-pill-inactive'
                }`}
            >
              {SUBJECT_EMOJIS[s]} {s}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        {!loading && qnaData && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{answered} answered</span>
              <span>{correct} correct</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${visible.length > 0 ? (answered / visible.length) * 100 : 0}%` }} />
            </div>
          </div>
        )}

        {/* Free limit notice */}
        {!isPaid && qnaData && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              <strong>Free Preview:</strong> Showing {FREE_LIMIT} of {qnaData.questions.length} questions.{' '}
              <button className="underline font-semibold text-amber-800">Upgrade to Pro</button>
            </p>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(j => <div key={j} className="h-10 bg-gray-100 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Questions */}
      {!loading && visible.map((q, idx) => {
        const sel = selectedAnswers[q.id];
        const show = revealed[q.id];
        const isCorrect = sel === q.correct_answer;

        return (
          <div key={q.id} className="card p-4 sm:p-5 animate-fade-up">
            {/* Q header */}
            <div className="flex items-start gap-2 mb-3">
              <span className="flex-shrink-0 w-7 h-7 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1 mb-1.5">
                  <span className="badge badge-blue">{q.subject}</span>
                  <span className={`badge ${q.difficulty === 'easy' ? 'badge-green' :
                      q.difficulty === 'medium' ? 'badge-yellow' : 'badge-red'
                    }`}>{q.difficulty}</span>
                </div>
                <p className="text-gray-900 font-medium leading-snug text-sm sm:text-base">{q.question}</p>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {(Object.entries(q.options) as [string, string][]).map(([key, value]) => {
                let cls = 'option-default';
                if (show) {
                  if (key === q.correct_answer) cls = 'option-correct';
                  else if (sel === key) cls = 'option-wrong';
                  else cls = 'option-missed';
                } else if (sel === key) {
                  cls = 'option-selected';
                }
                return (
                  <button
                    key={key}
                    disabled={!!show}
                    onClick={() => setSelectedAnswers(p => ({ ...p, [q.id]: key }))}
                    className={`option-btn ${cls}`}
                  >
                    <span className="font-bold mr-2">{key}.</span>
                    {value}
                    {show && key === q.correct_answer && (
                      <CheckCircle className="w-4 h-4 text-green-500 float-right mt-0.5" />
                    )}
                    {show && sel === key && key !== q.correct_answer && (
                      <XCircle className="w-4 h-4 text-red-400 float-right mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Actions / Explanation */}
            {!show && sel && (
              <button
                onClick={() => setRevealed(p => ({ ...p, [q.id]: true }))}
                className="btn-primary text-sm flex items-center gap-1"
              >
                Show Answer <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {show && (
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge ${isCorrect ? 'badge-green' : 'badge-red'}`}>
                    {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </span>
                  <span className="text-xs text-gray-500">Correct answer: <strong>{q.correct_answer}</strong></span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Upgrade CTA for free users after questions */}
      {!isPaid && qnaData && qnaData.questions.length > FREE_LIMIT && (
        <div className="card p-6 text-center bg-gradient-to-br from-[#1e3a5f] to-[#1a5fa8] text-white">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-heading font-bold text-lg mb-1">
            {qnaData.questions.length - FREE_LIMIT} More Questions Locked
          </h3>
          <p className="text-blue-200 text-sm mb-4">Get full access with TGCOP Pro — ₹299/month</p>
          <button className="btn-gold inline-flex items-center gap-2">
            <span className="line-through text-orange-200 text-xs">₹599</span>
            Upgrade to Pro — ₹299/mo
          </button>
        </div>
      )}
    </div>
  );
}