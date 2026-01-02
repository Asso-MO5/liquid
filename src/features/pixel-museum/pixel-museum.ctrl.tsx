import { createSignal, onMount } from 'solid-js'
import { setSoundIsSupport } from './pixel-museum-sound.ctrl'

export const pixelMuseumCtrl = () => {
  const [gameIsReady, setGameIsReady] = createSignal<boolean>(false)
  const [webglIsSupported, setWebglIsSupported] = createSignal<boolean>(false)

  const checkWebglSupport = () => {
    if (typeof window === 'undefined') return false

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl')
    setWebglIsSupported(context !== null)
  }

  const checkSoundSupport = () => {
    if (typeof window === 'undefined') return
    const audio = document.createElement('audio')
    setSoundIsSupport(audio?.canPlayType('audio/mpeg') !== '')
  }

  onMount(() => {
    if (typeof window === 'undefined') return
    checkSoundSupport()
    checkWebglSupport()
    setGameIsReady(true)
  })

  return {
    isLoading: false,
    gameIsReady,
    webglIsSupported,
  }
}
