import { createSignal } from 'solid-js'
import { getGameInstance } from './game.init'

const STORAGE_KEY = 'mini-game-sound-muted'

const getInitialMuted = () => {
  if (typeof window === 'undefined') return false
  const savedMuted = localStorage.getItem(STORAGE_KEY)
  return savedMuted === 'true'
}

const [isMuted, setIsMuted] = createSignal(getInitialMuted())

const applyMute = (muted: boolean) => {
  const game = getGameInstance()
  if (game) {
    if (muted) {
      game.setVolume(0)
    } else {
      game.setVolume(1)
    }
  }
}

if (typeof window !== 'undefined') {
  applyMute(getInitialMuted())
}

export const soundCtrl = {
  isMuted,
  toggleMute: () => {
    const newMuted = !isMuted()
    setIsMuted(newMuted)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(newMuted))
    }
    applyMute(newMuted)
  },
  applyMute,
}

export const getSoundCtrl = () => soundCtrl

