import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ShieldCheck, RotateCcw, BookOpen, TrendingUp, CheckCircle2 } from 'lucide-react';
import { playClick } from '../utils/audio';

interface VictoryScreenProps {
  timeLeft: number;
  onRetry: () => void;
  onOpenReview: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  timeLeft,
  onRetry,
  onOpenReview,
}) => {
  useEffect(() => {
    // Fire confetti bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Victory Header Card */}
      <div className="bg-emerald-950/70 border-2 border-emerald-500 rounded-2xl p-6 md:p-10 shadow-[0_0_50px_rgba(16,185,129,0.25)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-widest uppercase mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CYBER DEFENSE MASTER · 完全防衛成功</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          10問完全突破！会社を防衛しました！
        </h1>

        <p className="text-sm md:text-base text-emerald-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
          1つのセキュリティミスも犯さず、100秒の制限時間内に全10分野の脅威を完璧に識別しました。会社は倒産の危機を免れ、最高ランクのセキュリティガバナンス体制が確立されました。
        </p>

        {/* Stats Grid */}
        <div className="mt-8 pt-8 border-t border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">
              サイバー損害賠償総額
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono-num">
              ¥0
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-0.5 block font-semibold">
              完全ゼロ被害（無傷）
            </span>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">
              残り防衛時間
            </span>
            <div className="text-3xl font-black text-white font-mono-num">
              {Math.ceil(timeLeft)}
              <span className="text-base text-slate-400 ml-1">秒</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              100秒制限時間クリア
            </span>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">
              株価反応・企業格付け
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono-num flex items-center justify-center gap-1">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span>ストップ高</span>
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-0.5 block font-semibold">
              最高格付 AAA（模範企業）
            </span>
          </div>
        </div>
      </div>

      {/* Certification Badge Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>情報セキュリティ模範企業 認定証</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              CISO（最高情報セキュリティ責任者）特賞授与
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              パスワード管理、PPAP廃止、拡張機能審査、生成AIの機密保持、EDR常時稼働、紛失時の即時報告、CEO詐欺見極め、オフラインバックアップ、初動証拠保全、裏紙禁止の全10項目において完全なセキュリティリテラシーを証明しました。
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => {
            playClick();
            onRetry();
          }}
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          <RotateCcw className="w-5 h-5" />
          <span>もう一度プレイする</span>
        </button>

        <button
          onClick={() => {
            playClick();
            onOpenReview();
          }}
          className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          <BookOpen className="w-5 h-5 text-slate-400" />
          <span>全10問の公式セキュリティ解説を復習する</span>
        </button>
      </div>
    </div>
  );
};
