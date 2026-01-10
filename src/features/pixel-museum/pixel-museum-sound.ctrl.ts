import { createSignal } from 'solid-js'
import type kaplay from 'kaplay'
import { pixelMuseumState } from './pixel-museum.state'

export const [soundIsSupport, setSoundIsSupport] = createSignal<boolean>(false)
export const [volume, setVolume] = createSignal<number>(0)
export const [isMuted, setIsMuted] = createSignal<boolean>(true)

export const pixelMuseumSoundCtrl = () => {
  const mute = () => {
    setIsMuted(true)
    setVolume(0)
  }

  const unmute = () => {
    setIsMuted(false)
    setVolume(0.5)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted())
    setVolume(isMuted() ? 0 : 0.5)
  }

  return {
    isMuted,
    soundIsSupport,
    volume,
    mute,
    unmute,
    toggleMute,
  }
}

export const playMusic = (k: ReturnType<typeof kaplay>, sound: string) => {
  if (!k || !k.play) {
    console.error('kaplay non trouvé ou méthode play indisponible')
    return
  }
  if (isMuted() || !soundIsSupport()) return
  try {
    pixelMuseumState.musicSound?.stop?.()
    pixelMuseumState.musicSound = k.play(sound, { loop: true, volume: volume() })
  } catch (error) {
    console.error('Erreur lors de la lecture de la musique:', error)
  }
}

export const playSound = (k: ReturnType<typeof kaplay>, sound: string) => {
  if (!k || !k.play) {
    console.error('kaplay non trouvé ou méthode play indisponible')
    return
  }
  if (isMuted() || !soundIsSupport()) return
  try {
    k.play(sound, { loop: false, volume: volume() })
  } catch (error) {
    console.error('Erreur lors de la lecture du son:', error)
  }
}
