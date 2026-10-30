/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { TitleScreen } from './components/TitleScreen';
import { QuestionCard } from './components/QuestionCard';
import { TimerBar } from './components/TimerBar';
import { BankruptcyScreen } from './components/BankruptcyScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { ReviewModal } from './components/ReviewModal';
import { QUIZ_QUESTIONS, Question, calculateDamage, getShuffledQuestions } from './data/quizData';
import { GameMode, GameState, PlayerAnswer } from './types/game';
import { 
  getMuted, 
  playCorrect, 
  playWrong, 
  playBankruptcyImpact, 
  playVictoryFanfare, 
  playTick 
} from './utils/audio';

const TOTAL_TIME = 100; // 100 seconds limit

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [gameMode, setMode] = useState<GameMode>('AUDIT_MODE');
  // Shuffled questions for the active game session
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(QUIZ_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [allPlayerAnswers, setAllPlayerAnswers] = useState<PlayerAnswer[]>([]);
  const [failedQuestion, setFailedQuestion] = useState<Question | undefined>(undefined);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | undefined>(undefined);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isMuted, setIsMuted] = useState(getMuted());
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Quick feedback state to show correct/incorrect on option buttons for 600ms before next question
  const [feedback, setFeedback] = useState<{
    selectedIndex: number;
    isCorrect: boolean;
    correctIndex: number;
  } | null>(null);

  // Sound tick tracking
  const lastTickSecond = useRef<number>(100);

  // Timer loop
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const nextTime = Math.max(0, prev - 0.1);
        const currentSecond = Math.floor(nextTime);

        // Play tick sound when time is under 20 seconds
        if (nextTime <= 20 && nextTime > 0 && currentSecond !== lastTickSecond.current) {
          lastTickSecond.current = currentSecond;
          playTick(nextTime <= 10);
        }

        if (nextTime <= 0) {
          clearInterval(interval);
          handleTimeExpired();
          return 0;
        }

        return nextTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Handle time expiry (100 seconds timeout)
  const handleTimeExpired = useCallback(() => {
    setIsTimerRunning(false);
    setTimeExpired(true);
    playBankruptcyImpact();

    const currentQ = activeQuestions[currentQuestionIndex];
    setFailedQuestion(currentQ);
    setGameState('BANKRUPT');
  }, [activeQuestions, currentQuestionIndex]);

  // Start new game with fresh shuffled questions and randomized options
  const handleStartGame = () => {
    const shuffled = getShuffledQuestions();
    setActiveQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setTimeLeft(TOTAL_TIME);
    setAllPlayerAnswers([]);
    setFailedQuestion(undefined);
    setSelectedOptionIndex(undefined);
    setTimeExpired(false);
    setFeedback(null);
    lastTickSecond.current = 100;
    setIsTimerRunning(true);
    setGameState('PLAYING');
  };

  // Answer option selection
  const handleSelectOption = (optionIndex: number) => {
    if (gameState !== 'PLAYING' || feedback !== null) return;

    const currentQ = activeQuestions[currentQuestionIndex];
    // In our questions, each asks "誤っているものを1つ選びなさい"
    // correctIndex is the index of that incorrect statement!
    const isCorrect = optionIndex === currentQ.correctIndex;

    const newAnswer: PlayerAnswer = {
      questionId: currentQ.id,
      selectedIndex: optionIndex,
      isCorrect,
      timeSpentSeconds: TOTAL_TIME - timeLeft,
      question: currentQ
    };

    const updatedAnswers = [...allPlayerAnswers, newAnswer];
    setAllPlayerAnswers(updatedAnswers);

    // Audio cue
    if (isCorrect) {
      playCorrect();
    } else {
      playWrong();
    }

    // Set immediate visual feedback on choices
    setFeedback({
      selectedIndex: optionIndex,
      isCorrect,
      correctIndex: currentQ.correctIndex,
    });

    // Proceed to next question after brief 500ms feedback pause so the user sees their move
    setTimeout(() => {
      setFeedback(null);

      if (currentQuestionIndex < activeQuestions.length - 1) {
        // Continue to next question (allows playing all 10 even when mistakes happen!)
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Reached end of all 10 questions!
        setIsTimerRunning(false);

        const wrongList = updatedAnswers.filter((a) => !a.isCorrect);

        if (wrongList.length === 0) {
          // 0 mistakes: Complete clean victory!
          playVictoryFanfare();
          setGameState('VICTORY');
        } else {
          // 1 or more mistakes: BANKRUPT!
          // The more mistakes, the more astronomical the damage amount!
          setFailedQuestion(wrongList[0].question);
          setSelectedOptionIndex(wrongList[0].selectedIndex);
          playBankruptcyImpact();
          setGameState('BANKRUPT');
        }
      }
    }, 550);
  };

  // Reset to title
  const handleResetToTitle = () => {
    setIsTimerRunning(false);
    setGameState('TITLE');
    setTimeLeft(TOTAL_TIME);
    setAllPlayerAnswers([]);
    setFailedQuestion(undefined);
    setSelectedOptionIndex(undefined);
    setTimeExpired(false);
    setFeedback(null);
  };

  // Calculate damage for current game result
  const wrongQuestions = allPlayerAnswers
    .filter((a) => !a.isCorrect)
    .map((a) => a.question);

  // If time expired and no wrong answered yet, include current
  if (timeExpired && wrongQuestions.length === 0 && failedQuestion) {
    wrongQuestions.push(failedQuestion);
  }

  const damageData = calculateDamage(wrongQuestions);

  // Live damage calculation while playing
  const liveWrongQuestions = allPlayerAnswers
    .filter((a) => !a.isCorrect)
    .map((a) => a.question);
  const liveDamage = calculateDamage(liveWrongQuestions).totalDamage;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Contract */}
      <Header
        gameState={gameState}
        onOpenReview={() => setIsReviewOpen(true)}
        onResetGame={handleResetToTitle}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col items-center justify-center">
        {gameState === 'TITLE' && (
          <TitleScreen
            mode={gameMode}
            setMode={setMode}
            onStartGame={handleStartGame}
            onOpenReview={() => setIsReviewOpen(true)}
          />
        )}

        {gameState === 'PLAYING' && (
          <div className="w-full max-w-3xl mx-auto space-y-4">
            {/* 100-Second Countdown Timer with Live Damage & Progress */}
            <TimerBar 
              timeLeft={timeLeft} 
              totalTime={TOTAL_TIME}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={activeQuestions.length}
              answers={allPlayerAnswers}
              currentDamage={liveDamage}
            />

            {/* Active Question Card (Shuffled questions & options) */}
            <QuestionCard
              question={activeQuestions[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalQuestions={activeQuestions.length}
              onSelectOption={handleSelectOption}
              disabled={false}
              selectedOptionFeedback={feedback}
            />
          </div>
        )}

        {gameState === 'BANKRUPT' && (
          <BankruptcyScreen
            failedQuestion={failedQuestion}
            selectedOptionIndex={selectedOptionIndex}
            allPlayerAnswers={allPlayerAnswers}
            totalDamage={damageData.totalDamage}
            stockDropPercent={damageData.stockDropPercent}
            timeExpired={timeExpired}
            onRetry={handleStartGame}
            onOpenReview={() => setIsReviewOpen(true)}
          />
        )}

        {gameState === 'VICTORY' && (
          <VictoryScreen
            timeLeft={timeLeft}
            onRetry={handleStartGame}
            onOpenReview={() => setIsReviewOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <span>倒産セキュリティクイズ · 全10問（シャッフル出題・IPAセキュリティガイドライン準拠）</span>
      </footer>

      {/* Security Handbook & Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </div>
  );
}
