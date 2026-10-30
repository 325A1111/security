import React from 'react';
import { ShieldAlert, Volume2, VolumeX, RotateCcw, BookOpen } from 'lucide-react';
import { getMuted, setMuted, playClick } from '../utils/audio';
import { GameState } from '../types/game';

interface HeaderProps {
  gameState: GameState;
  onOpenReview: () => void;
  onResetGame: () => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  onOpenReview,
  onResetGame,
  isMuted,
  setIsMuted,
}) => {
  const toggleSound = () => {
    const next = !isMuted;
    setMuted(next);
    setIsMuted(next);
    if (!next) {
      playClick();
    }
  };

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button 
        onClick={onResetGame}
        className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
      >
        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          倒産セキュリティクイズ
        </span>
      </button>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <span className="text-slate-400 whitespace-nowrap shrink-0">
          制限時間 100秒
        </span>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <span className="text-slate-400 whitespace-nowrap shrink-0">
          ランダム10問 (全20問収録)
        </span>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <span className="text-rose-400/90 font-semibold whitespace-nowrap shrink-0">
          1ミス以上で倒産
        </span>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <button
          onClick={onOpenReview}
          className="hover:text-slate-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 text-slate-400"
        >
          <BookOpen className="w-3.5 h-3.5" />
          セキュリティ公式解説一覧
        </button>
      </nav>

      {/* Zone 3: 1 primary action / audio controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleSound}
          className="p-2 text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700/60 rounded-lg transition-colors"
          title={isMuted ? "音声ONにする" : "音声OFFにする"}
          aria-label={isMuted ? "音声ONにする" : "音声OFFにする"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {gameState !== 'TITLE' && (
          <button
            onClick={() => {
              playClick();
              onResetGame();
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            やり直す
          </button>
        )}
      </div>
    </header>
  );
};
