import React from 'react';
import { ShieldAlert, Skull, Timer, Award, AlertTriangle, Play, BookOpen, Flame } from 'lucide-react';
import { GameMode } from '../types/game';
import { playClick } from '../utils/audio';

interface TitleScreenProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenReview: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  mode,
  setMode,
  onStartGame,
  onOpenReview,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Warning Box */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold tracking-wider uppercase">
            <Skull className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>1ミスで会社が吹き飛ぶ極限サバイバル</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            倒産セキュリティ<span className="text-rose-500">クイズ</span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            全10問の4択セキュリティ問題（出題順・選択肢は毎回完全ランダム）。
            <br className="hidden sm:block" />
            <span className="text-rose-400 font-bold">間違えても10問すべてに挑戦可能！</span>
            <br className="hidden sm:block" />
            ただし1つでも誤答があると会社は倒産。誤答が多いほど被害額が跳ね上がります。
          </p>

          {/* Key Rule Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">ルール 1</span>
                <span className="text-sm font-bold text-white">1ミス以上で倒産</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">ルール 2</span>
                <span className="text-sm font-bold text-white">制限時間 100秒</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">シャッフル機能</span>
                <span className="text-sm font-bold text-white">問題・選択肢ランダム</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                playClick();
                onStartGame();
              }}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-rose-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>防衛戦を開始する (制限時間100秒)</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onOpenReview();
              }}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-2xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>公式セキュリティ解説を読む</span>
            </button>
          </div>
        </div>
      </div>

      {/* 20 Topic Categories Overview preview */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          出題分野プール（実務で必須のセキュリティ 20大分野より毎回ランダム抽出）
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 text-xs text-slate-300">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q1</span>
            <span className="font-medium">アカウント・認証</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q2</span>
            <span className="font-medium">メール・PPAP廃止</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q3</span>
            <span className="font-medium">拡張機能・Web閲覧</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q4</span>
            <span className="font-medium">生成AI・機密情報</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q5</span>
            <span className="font-medium">PC運用・EDR常時</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q6</span>
            <span className="font-medium">端末紛失・即時報告</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q7</span>
            <span className="font-medium">なりすまし・CEO詐欺</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q8</span>
            <span className="font-medium">同期クラウド・世代退避</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q9</span>
            <span className="font-medium">事故初動・証拠保全</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q10</span>
            <span className="font-medium">裏紙禁止・物理廃棄</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q11</span>
            <span className="font-medium">代理ログイン・貸借禁止</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q12</span>
            <span className="font-medium">チャット誤爆・APIキー</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q13</span>
            <span className="font-medium">ClickFix・コマンド偽装</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q14</span>
            <span className="font-medium">プロンプト注入・AI指示</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q15</span>
            <span className="font-medium">スマートスピーカー・音声</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q16</span>
            <span className="font-medium">充電スポット・JuiceJacking</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q17</span>
            <span className="font-medium">バックアップ3-2-1ルール</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q18</span>
            <span className="font-medium">感染時外付け接続の禁止</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q19</span>
            <span className="font-medium">私用自動転送・共有権限</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 truncate">
            <span className="text-[10px] text-slate-500 block">Q20</span>
            <span className="font-medium">訓練メール・ペナルティ禁止</span>
          </div>
        </div>
      </div>
    </div>
  );
};
