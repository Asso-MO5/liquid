import { LEVEL_NAMES } from "./mini-game.const";
import type { MiniGameState } from "./mini-game.types";

export const gameState: MiniGameState = {
  score: 0,
  lives: 3,
  level: 1,
  currentLevel: LEVEL_NAMES.START as keyof typeof LEVEL_NAMES,
  isGameOver: false,
  isGameWon: false,
  isGamePaused: false,
  isGameStarted: false,
  isGameEnded: false,
}
