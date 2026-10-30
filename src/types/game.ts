import { Question } from '../data/quizData';

export type GameMode = 'SUDDEN_DEATH' | 'AUDIT_MODE';

export type GameState = 
  | 'TITLE'            // Initial screen with mode selection & rules
  | 'PLAYING'          // Active question screen
  | 'QUESTION_RESULT'  // Mid-question result (shown in Audit mode or brief feedback)
  | 'BANKRUPT'         // 倒産画面 (Game Over with damages & explanation)
  | 'VICTORY'          // 10問全問正解クリア画面 (完全防衛)
  | 'REVIEW';          // 全問解説・復習一覧画面

export interface PlayerAnswer {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  question: Question;
}
