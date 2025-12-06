export const CANVAS_ID = "mini-game-container";

export const LEVEL_NAMES = {
  START: 'start',
  MOON_PATROL: 'moon-patrol',
  GAME_OVER: 'game-over',
} as const;

export const CONTROLS = {
  MOVE_LEFT: ['left', 'a', 'q'],
  MOVE_RIGHT: ['right', 'd'],
  JUMP: ['space', 'up', 'w', 'z', 'x'],
  INTERACT: ['e', 'f', 'interact'],
} as const;


export const FONTS = {
  SILKSCREEN: "Silkscreen",
  SILKSCREEN_BOLD: "Silkscreen-Bold",
}