import type * as me from 'melonjs';

export interface MiniGameState {
  score: number;
  lives: number;
  level: number;
  texture: me.TextureAtlas | undefined;
  spriteData: JSON | undefined;
  isGameOver: boolean;
  isGameWon: boolean;
  isGamePaused: boolean;
  isGameStarted: boolean;
  isGameEnded: boolean;
} 