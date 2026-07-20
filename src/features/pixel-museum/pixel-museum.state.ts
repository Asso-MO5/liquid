import type { AudioPlay } from 'kaplay'
import { LEVELS } from './levels/levels.const'

export interface PixelMuseumState {
  level: (typeof LEVELS)[keyof typeof LEVELS]
  musicSound: AudioPlay | null
}

export const pixelMuseumState: PixelMuseumState = {
  level: LEVELS.MUSEUM,
  musicSound: null,
}
