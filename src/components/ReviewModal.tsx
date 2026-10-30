import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { X, BookOpen, CheckCircle, ShieldAlert, DollarSign } from 'lucide-react';
import { playClick } from '../utils/audio';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS.find((q) => q.id === selectedQuestionId) || QUIZ_QUESTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              全20問 セキュリティ公式解説ハンドブック
            </h2>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split view on desktop */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Question selection sidebar */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/40 p-3 shrink-0 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 block">
              問題一覧 (全20問)
            </span>
            <div className="space-y-1 max-h-48 md:max-h-full overflow-y-auto">
              {QUIZ_QUESTIONS.map((q) => {
                const isSelected = q.id === selectedQuestionId;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      playClick();
                      setSelectedQuestionId(q.id);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="font-mono mr-1.5 opacity-70">Q{q.id}.</span>
                      <span>{q.category}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">正解：{q.correctIndex + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question detail panel */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  第{currentQ.id}問
                </span>
                <span className="text-xs text-rose-400 font-semibold">
                  分野：{currentQ.category}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Options with marked correct answer */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">
                選択肢一覧（正解：{currentQ.correctIndex + 1}）
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, i) => {
                  const isCorrect = i === currentQ.correctIndex;
                  return (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border text-xs md:text-sm flex items-start gap-3 ${
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 font-medium'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 pt-0.5 leading-relaxed">
                        {opt}
                      </div>
                      {isCorrect && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" />
                          正解（誤った記述）
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 md:p-5">
              <span className="text-xs font-bold text-emerald-400 mb-1.5 block">
                公式解説
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>
            </div>

            {/* Threat & Bankruptcy Simulation Details */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  誤答時に発生するインシデント：{currentQ.incidentName}
                </span>
                <span className="text-xs font-bold font-mono text-rose-300">
                  被害想定：¥{currentQ.baseDamage.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {currentQ.incidentDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentQ.breakdown.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center font-mono">
                    <span className="text-slate-400 font-sans truncate mr-2">{item.category}</span>
                    <span className="text-rose-400 font-bold shrink-0">¥{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end shrink-0">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
