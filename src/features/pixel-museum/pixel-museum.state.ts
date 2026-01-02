import { LEVELS } from './levels/levels.const'
import type { AudioPlay } from 'kaplay'

export interface PixelMuseumState {
  level: (typeof LEVELS)[keyof typeof LEVELS]
  musicSound: AudioPlay | null
}

export const pixelMuseumState: PixelMuseumState = {
  level: LEVELS.MUSEUM,
  musicSound: null,
}
