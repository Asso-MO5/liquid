import { createSignal } from "solid-js"

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