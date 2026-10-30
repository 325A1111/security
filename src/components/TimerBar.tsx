import React from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TimerBarProps {
  timeLeft: number;
  totalTime: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: { isCorrect: boolean }[];
  currentDamage: number;
}

export const TimerBar: React.FC<TimerBarProps> = ({ 
  timeLeft, 
  totalTime,
  currentQuestionIndex,
  totalQuestions,
  answers,
  currentDamage
}) => {
  const percentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  
  // Danger stage
  const isCritical = timeLeft <= 20;
  const isWarning = timeLeft <= 50 && !isCritical;

  let barColor = 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let riskText = '正常防衛中';
  let RiskIcon = ShieldCheck;

  const wrongCount = answers.filter((a) => !a.isCorrect).length;

  if (wrongCount > 0) {
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    riskText = `${wrongCount}件インシデント発生（倒産確定）`;
    RiskIcon = AlertTriangle;
  } else if (isCritical) {
    barColor = 'bg-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.8)] animate-pulse';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';
    riskText = '残り時間切迫！';
    RiskIcon = AlertTriangle;
  } else if (isWarning) {
    barColor = 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    riskText = '注意（時間経過警告）';
    RiskIcon = AlertTriangle;
  }

  // Format seconds with decimal when under 10 seconds for high tension
  const formattedTime = timeLeft <= 10 ? timeLeft.toFixed(1) : Math.ceil(timeLeft).toString();

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-5 shadow-lg space-y-3">
      {/* Top Row: Time & Damage status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isCritical ? 'text-rose-400 animate-spin' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span className="text-xs font-semibold text-slate-400 tracking-wide">
            制限時間 100秒
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}>
            <RiskIcon className="w-3 h-3" />
            <span>{riskText}</span>
          </div>

          <div className="flex items-baseline gap-1 font-mono-num">
            <span className={`text-xl font-extrabold ${isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formattedTime}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 100秒</span>
          </div>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-200 ease-linear rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Question Dots & Live Damage Meter */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
        {/* 10 Question Dots */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px] mr-1 hidden sm:inline">進捗:</span>
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const answer = answers[i];
            const isCurrent = i === currentQuestionIndex;
            
            let dotClass = 'bg-slate-800 text-slate-500 border-slate-700';
            let label = `${i + 1}`;

            if (answer) {
              if (answer.isCorrect) {
                dotClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-bold';
                label = '✓';
              } else {
                dotClass = 'bg-rose-500/20 text-rose-400 border-rose-500/50 font-bold';
                label = '✕';
              }
            } else if (isCurrent) {
              dotClass = 'bg-white text-slate-900 border-white font-bold animate-pulse';
            }

            return (
              <div
                key={i}
                className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-mono transition-colors ${dotClass}`}
                title={`第${i + 1}問`}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Live accumulated damage */}
        <div className="flex items-center gap-1.5 font-mono-num">
          <span className="text-slate-500 text-[11px]">現在被害額:</span>
          <span className={`font-bold ${currentDamage > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ¥{currentDamage.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
