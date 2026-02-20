import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Target, Clock, Play, CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchDailyTest, saveTestResult, type TestData } from '../data/dataService';

const FREE_Q_LIMIT = 25;

interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeTakenSeconds: number;
  answers: Record<number, string>;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
}

export function DailyTest() {
  const { isSubscriptionActive } = useAuth();
  const isPaid = isSubscriptionActive();

  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'intro' | 'test' | 'results'>('intro');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<TestResults | null>(null);

  useEffect(() => {
    fetchDailyTest().then(data => {
      setTestData(data);
      setTimeRemaining(data.time_limit_minutes * 60);
      setLoading(false);
    });
  }, []);

  const visibleQ = useMemo(
    () =>
      testData
        ? isPaid
          ? testData.questions
          : testData.questions.slice(0, FREE_Q_LIMIT)
        : [],
    [testData, isPaid]
  );

  const handleSubmit = useCallback(() => {
    if (!testData || !visibleQ.length) return;
    let correct = 0;
    const breakdown: Record<string, { correct: number; total: number }> = {};

    visibleQ.forEach(q => {
      if (!breakdown[q.subject]) breakdown[q.subject] = { correct: 0, total: 0 };
      breakdown[q.subject].total++;
      if (selectedAnswers[q.id] === q.correct_answer) {
        correct++;
        breakdown[q.subject].correct++;
      }
    });

    const timeTaken = testData.time_limit_minutes * 60 - timeRemaining;
    const r: TestResults = {
      totalQuestions: visibleQ.length,
      correctAnswers: correct,
      score: Math.round((correct / visibleQ.length) * 100),
      timeTakenSeconds: timeTaken,
      answers: selectedAnswers,
      subjectBreakdown: breakdown,
    };
    setResults(r);
    setPhase('results');
    saveTestResult({ totalQuestions: r.totalQuestions, correctAnswers: r.correctAnswers, score: r.score, timeTakenSeconds: timeTaken });
  }, [testData, visibleQ, selectedAnswers, timeRemaining]);

  // Timer
  useEffect(() => {
    if (phase !== 'test') return;
    if (timeRemaining <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeRemaining(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeRemaining, handleSubmit]);


  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleRestart = () => {
    setPhase('intro');
    setSelectedAnswers({});
    setCurrentIdx(0);
    setResults(null);
    if (testData) setTimeRemaining(testData.time_limit_minutes * 60);
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#1e3a5f] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading today's test...</p>
      </div>
    );
  }

  if (!testData) return <div className="card p-8 text-center text-gray-500">No test available today.</div>;

  // ── RESULTS ──
  if (phase === 'results' && results) {
    const grade =
      results.score >= 80 ? { label: 'Excellent!', color: 'text-green-600', emoji: '🏆' } :
        results.score >= 60 ? { label: 'Good Job!', color: 'text-blue-600', emoji: '👍' } :
          results.score >= 40 ? { label: 'Keep Practicing', color: 'text-yellow-600', emoji: '📚' } :
            { label: 'Needs Work', color: 'text-red-600', emoji: '💪' };
    const mins = Math.floor(results.timeTakenSeconds / 60);
    const secs = results.timeTakenSeconds % 60;

    return (
      <div className="space-y-4 animate-fade-up">
        {/* Score card */}
        <div className="card p-6 text-center">
          <div className="text-5xl mb-2">{grade.emoji}</div>
          <h2 className={`font-heading font-bold text-2xl mb-1 ${grade.color}`}>{grade.label}</h2>
          <p className="text-gray-500 text-sm mb-5">Your performance summary</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Score', value: `${results.score}%`, color: 'bg-blue-50 text-blue-700' },
              { label: 'Correct', value: results.correctAnswers, color: 'bg-green-50 text-green-700' },
              { label: 'Wrong', value: results.totalQuestions - results.correctAnswers, color: 'bg-red-50 text-red-700' },
              { label: 'Time', value: `${mins}m ${secs}s`, color: 'bg-amber-50 text-amber-700' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 ${s.color}`}>
                <div className="font-heading font-bold text-xl">{s.value}</div>
                <div className="text-xs font-medium opacity-80">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 mb-1">
            <div className="h-3 bg-gradient-to-r from-[#1e3a5f] to-[#2589e8] rounded-full transition-all" style={{ width: `${results.score}%` }} />
          </div>
          <p className="text-xs text-gray-400">{results.correctAnswers} / {results.totalQuestions} correct</p>
        </div>

        {/* Subject breakdown */}
        <div className="card p-4">
          <h3 className="font-heading font-semibold text-gray-900 mb-3">Subject Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(results.subjectBreakdown).map(([subj, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={subj}>
                  <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                    <span>{subj}</span>
                    <span>{data.correct}/{data.total} ({pct}%)</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className={`progress-bar-fill ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Q-by-Q review */}
        <div className="card p-4">
          <h3 className="font-heading font-semibold text-gray-900 mb-3">Question Review</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {visibleQ.map((q, i) => {
              const ua = results.answers[q.id];
              const ok = ua === q.correct_answer;
              return (
                <div key={q.id} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm border ${ok ? 'border-green-200 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                  {ok ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 truncate">Q{i + 1}: {q.question.slice(0, 60)}…</p>
                    <p className="text-xs text-gray-400">Your: {ua || '—'} | Correct: {q.correct_answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={handleRestart} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Retake Test
        </button>
      </div>
    );
  }

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="space-y-4 animate-fade-up">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="font-heading font-bold text-gray-900 text-lg">{testData.test_title}</h2>
          </div>
          <p className="text-sm text-gray-500 mb-5">Daily timed exam — test your speed and accuracy</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Questions', value: isPaid ? testData.questions.length : `${FREE_Q_LIMIT} (Free)` },
              { label: 'Time Limit', value: `${testData.time_limit_minutes} min` },
              { label: 'Marks', value: '1 per Q' },
              { label: 'Negative', value: 'None' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="font-heading font-bold text-[#1e3a5f]">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Instructions</h3>
            <ul className="space-y-1.5">
              {testData.instructions.map((instr, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-[#1e3a5f] font-bold mt-0.5">•</span>
                  {instr}
                </li>
              ))}
            </ul>
          </div>

          {!isPaid && (
            <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <Lock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Free mode: first {FREE_Q_LIMIT} questions only.{' '}
                <strong>Upgrade to Pro</strong> for the full {testData.questions.length}-question test.
              </p>
            </div>
          )}

          <button
            onClick={() => setPhase('test')}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            <Play className="w-5 h-5" /> Start Test
          </button>
        </div>
      </div>
    );
  }

  // ── TEST ──
  const currentQ = visibleQ[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = ((currentIdx + 1) / visibleQ.length) * 100;
  const isLowTime = timeRemaining < 300;

  return (
    <div className="space-y-3 animate-fade-up">
      {/* Test header */}
      <div className="card p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{testData.test_title}</span>
          <div className={`flex items-center gap-1.5 font-mono text-lg font-bold px-3 py-1 rounded-xl ${isLowTime ? 'bg-red-50 text-red-600 animate-pulse-soft' : 'bg-blue-50 text-[#1e3a5f]'
            }`}>
            {isLowTime && <AlertCircle className="w-4 h-4" />}
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Q {currentIdx + 1} / {visibleQ.length}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Current question */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-start gap-2 mb-4">
          <span className="flex-shrink-0 w-7 h-7 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center text-xs font-bold">
            {currentIdx + 1}
          </span>
          <div>
            <span className="badge badge-blue mb-1">{currentQ.subject}</span>
            <p className="text-gray-900 font-medium leading-snug text-sm sm:text-base">{currentQ.question}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {(Object.entries(currentQ.options) as [string, string][]).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedAnswers(p => ({ ...p, [currentQ.id]: key }))}
              className={`option-btn ${selectedAnswers[currentQ.id] === key ? 'option-selected' : 'option-default'}`}
            >
              <span className="font-bold mr-2">{key}.</span>{value}
            </button>
          ))}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between gap-2">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(i => i - 1)}
            className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {currentIdx === visibleQ.length - 1 ? (
            <button onClick={handleSubmit} className="btn-primary flex items-center gap-1 text-sm bg-green-700 hover:bg-green-600">
              <CheckCircle className="w-4 h-4" /> Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(i => i + 1)}
              className="btn-primary flex items-center gap-1 text-sm"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question grid navigator */}
      <div className="card p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Question Map</h4>
          <button onClick={handleSubmit} className="text-xs text-red-600 font-semibold hover:underline">
            Submit Test
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {visibleQ.map((q, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${i === currentIdx
                ? 'bg-[#1e3a5f] text-white'
                : selectedAnswers[q.id]
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#1e3a5f] rounded" /> Current</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded" /> Answered</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 rounded" /> Skipped</div>
        </div>
      </div>
    </div>
  );
}