import React, { useState, useEffect } from 'react';
import { Question } from '../data/quizData';
import { PlayerAnswer } from '../types/game';
import { AlertOctagon, RotateCcw, BookOpen, TrendingDown, DollarSign, FileWarning, ArrowRight } from 'lucide-react';
import { playClick } from '../utils/audio';

interface BankruptcyScreenProps {
  failedQuestion?: Question;
  selectedOptionIndex?: number;
  allPlayerAnswers: PlayerAnswer[];
  totalDamage: number;
  stockDropPercent: number;
  timeExpired: boolean;
  onRetry: () => void;
  onOpenReview: () => void;
}

export const BankruptcyScreen: React.FC<BankruptcyScreenProps> = ({
  failedQuestion,
  selectedOptionIndex,
  allPlayerAnswers,
  totalDamage,
  stockDropPercent,
  timeExpired,
  onRetry,
  onOpenReview,
}) => {
  // Animated ticker for damage
  const [displayedDamage, setDisplayedDamage] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (totalDamage - start) * ease);
      setDisplayedDamage(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [totalDamage]);

  // Format Japanese Yen
  const formatYen = (amount: number) => {
    if (amount >= 100000000) {
      const oku = (amount / 100000000).toFixed(1);
      return `約${oku}億円 (${amount.toLocaleString()}円)`;
    }
    const man = Math.round(amount / 10000);
    return `${man.toLocaleString()}万円 (${amount.toLocaleString()}円)`;
  };

  const wrongAnswers = allPlayerAnswers.filter((a) => !a.isCorrect);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Emergency Flash Banner */}
      <div className="bg-rose-950/80 border-2 border-rose-500 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(244,63,94,0.3)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-widest uppercase mb-4">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>EMERGENCY BREAKDOWN · 会社更生手続申請</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          {timeExpired ? "【時間切れ】全社システム崩壊により倒産！" : "【重大事故】セキュリティ違反により倒産！"}
        </h1>

        <p className="text-sm md:text-base text-rose-200/90 max-w-2xl mx-auto font-medium leading-relaxed">
          {timeExpired 
            ? "100秒の制限時間をオーバーしました。攻撃者による基幹DB完全暗号化とバックドア設置が完了し、事業継続が不可能となりました。"
            : (failedQuestion ? `第${failedQuestion.id}問「${failedQuestion.category}」の誤った判断が原因で大規模サイバーインシデントが発生。損害賠償と信用失墜に耐えきれず倒産しました。` : "誤ったセキュリティ判断により事業継続不能となりました。")
          }
        </p>

        {/* Damage Ticker Card */}
        <div className="mt-6 pt-6 border-t border-rose-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4 text-center">
            <span className="text-xs text-rose-300/80 font-bold block mb-1">
              負債・損害賠償総額
            </span>
            <div className="text-2xl md:text-3xl font-black text-rose-400 font-mono-num">
              ¥{displayedDamage.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {formatYen(displayedDamage)}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4 text-center">
            <span className="text-xs text-rose-300/80 font-bold block mb-1">
              株価下落率・企業信用格付け
            </span>
            <div className="text-2xl md:text-3xl font-black text-rose-400 font-mono-num flex items-center justify-center gap-1">
              <TrendingDown className="w-6 h-6 text-rose-500" />
              <span>-{stockDropPercent}%</span>
            </div>
            <span className="text-[11px] text-rose-300/80 mt-0.5 block font-semibold">
              ストップ安 破産等級 (D-)
            </span>
          </div>
        </div>
      </div>

      {/* List of All Violations & Damages (The more wrong, the higher the damage!) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg md:text-xl font-bold text-white">
              インシデント監査報告書（誤答数：{wrongAnswers.length}件 / 全10問）
            </h2>
          </div>
          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
            被害総額：¥{totalDamage.toLocaleString()}
          </span>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              ※間違えた問題が増えるごとに二次被害・信用失墜のペナルティ係数が累積し、損害総額が跳ね上がっています。
            </p>

            <div className="space-y-4">
              {wrongAnswers.map((answer, index) => {
                const q = answer.question;
                return (
                  <div key={index} className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 md:p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-rose-400">
                          {q.category}
                        </span>
                        <span className="text-xs text-slate-400">· {q.incidentName}</span>
                      </div>
                      <span className="font-mono-num font-bold text-rose-400 text-xs">
                        被害額：¥{q.baseDamage.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white">
                      Q. {q.question}
                    </div>

                    {/* Choices comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-200">
                        <span className="font-bold block text-rose-400 text-[11px] mb-1">あなたの選んだ選択肢（誤答）：</span>
                        <span>{q.options[answer.selectedIndex]}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-200">
                        <span className="font-bold block text-emerald-400 text-[11px] mb-1">正解（誤った記述）：</span>
                        <span>{q.options[q.correctIndex]}</span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-emerald-400 block mb-1">【解説】</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* If time expired with no specific wrong answer logged */}
        {timeExpired && wrongAnswers.length === 0 && (
          <div className="bg-slate-950/90 border border-rose-500/30 rounded-xl p-5 text-center space-y-2">
            <h3 className="text-base font-bold text-white">
              100秒タイムアウトによる全社強制シャットダウン
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              100秒以内に10問すべてのセキュリティ防衛を完了できなかったため、侵入した攻撃者によって全バックアップと重要基幹DBが完全破壊されました。
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => {
            playClick();
            onRetry();
          }}
          className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          <RotateCcw className="w-5 h-5" />
          <span>もう一度挑戦して倒産を回避する</span>
        </button>

        <button
          onClick={() => {
            playClick();
            onOpenReview();
          }}
          className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          <BookOpen className="w-5 h-5 text-slate-400" />
          <span>全10問の公式セキュリティ解説を見る</span>
        </button>
      </div>
    </div>
  );
};
