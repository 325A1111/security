import React, { useEffect } from 'react';
import { Question } from '../data/quizData';
import { AlertCircle } from 'lucide-react';
import { playClick } from '../utils/audio';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onSelectOption: (optionIndex: number) => void;
  disabled: boolean;
  selectedOptionFeedback: {
    selectedIndex: number;
    isCorrect: boolean;
    correctIndex: number;
  } | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onSelectOption,
  disabled,
  selectedOptionFeedback
}) => {
  // Listen for keys 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || selectedOptionFeedback) return;
      if (e.key === '1') {
        playClick();
        onSelectOption(0);
      } else if (e.key === '2') {
        playClick();
        onSelectOption(1);
      } else if (e.key === '3') {
        playClick();
        onSelectOption(2);
      } else if (e.key === '4') {
        playClick();
        onSelectOption(3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, selectedOptionFeedback, onSelectOption]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
      {/* Question metadata */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
            QUESTION {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-sm font-medium text-slate-300">
            分野：{question.category}
          </span>
        </div>
        
        <div className="text-xs text-slate-500 hidden sm:block">
          キーボード [1] ~ [4] キーでも回答可能
        </div>
      </div>

      {/* Main question prompt */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          {question.question}
        </h2>
        <p className="mt-2 text-xs md:text-sm text-rose-400 font-medium flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>「誤っているもの」を1つ選択してください。（全10問回答後、1つでもミスがあれば倒産確定）</span>
        </p>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-1 gap-3.5">
        {question.options.map((option, idx) => {
          let optionStyle = "border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-slate-700 text-slate-200 group-hover:text-white";
          let badgeStyle = "bg-slate-800 text-slate-300 group-hover:bg-rose-500/20 group-hover:text-rose-400";
          let statusTag = null;

          if (selectedOptionFeedback) {
            const isUserPick = selectedOptionFeedback.selectedIndex === idx;
            const isCorrectAnswer = selectedOptionFeedback.correctIndex === idx;

            if (isUserPick && selectedOptionFeedback.isCorrect) {
              // User picked correct (safe)
              optionStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-100 ring-2 ring-emerald-500/40";
              badgeStyle = "bg-emerald-500 text-white font-bold";
              statusTag = <span className="text-xs text-emerald-400 font-bold ml-2">✓ 防衛成功（正解）</span>;
            } else if (isUserPick && !selectedOptionFeedback.isCorrect) {
              // User picked wrong (breach!)
              optionStyle = "border-rose-500 bg-rose-950/40 text-rose-100 ring-2 ring-rose-500/40 animate-pulse";
              badgeStyle = "bg-rose-500 text-white font-bold";
              statusTag = <span className="text-xs text-rose-400 font-bold ml-2">✕ 誤答（インシデント発生！）</span>;
            } else if (isCorrectAnswer) {
              // Show what was the correct answer
              optionStyle = "border-emerald-500/60 bg-emerald-950/20 text-emerald-200";
              badgeStyle = "bg-emerald-500/30 text-emerald-300";
              statusTag = <span className="text-xs text-emerald-400 font-bold ml-2">← 正解（この記述が誤り）</span>;
            } else {
              optionStyle = "opacity-40 border-slate-800 bg-slate-950/30 text-slate-500";
            }
          }

          return (
            <button
              key={idx}
              disabled={disabled || selectedOptionFeedback !== null}
              onClick={() => {
                playClick();
                onSelectOption(idx);
              }}
              className={`group relative flex items-start text-left p-4 md:p-5 rounded-xl border transition-all duration-150 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${optionStyle}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-lg font-mono font-bold text-sm flex items-center justify-center mr-3.5 transition-colors ${badgeStyle}`}>
                {idx + 1}
              </div>
              <div className="flex-1 text-sm md:text-base leading-relaxed font-medium pt-0.5">
                <span>{option}</span>
                {statusTag}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
