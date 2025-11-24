import type { LEVEL_NAMES } from "./mini-game.const";

export interface MiniGameState {
  score: number;
  lives: number;
  level: number;

  currentLevel: keyof typeof LEVEL_NAMES;

  isGameOver: boolean;
  isGameWon: boolean;
  isGamePaused: boolean;
  isGameStarted: boolean;
  isGameEnded: boolean;
} 