import type Kaplay from 'kaplay'
import { CANVAS_ID, ROOM_NAME } from './pixel-museum.const'
import { onMount } from 'solid-js'
import { museumLevel } from './levels/museum.level'
import { LEVELS } from './levels/levels.const'
import { pixelMuseumRessources } from './pixel-museum-ressources'
import type { Room } from 'colyseus.js'
import { clientEnv } from '~/env/client'

export let k: ReturnType<typeof Kaplay> | null = null

export const getGameInstance = () => k
export let gameRoom: Room | null = null

export const pixelMuseumInitGame = () => {
  const ignition = async () => {
    const containerRef = document.getElementById(
      CANVAS_ID
    ) as HTMLDivElement | null

    if (!containerRef) return console.error(`Container ${CANVAS_ID} non trouvé`)

    const containerWidth = containerRef.clientWidth || 800
    const containerHeight = containerRef.clientHeight || 600
    const pixelHeight = Math.round(containerHeight / (32 * 6))

    const kaplay = (await import('kaplay')).default

    k = kaplay({
      width: Math.floor(containerWidth / pixelHeight),
      height: Math.floor(containerHeight / pixelHeight),
      root: containerRef,
      scale: pixelHeight,
      background: [0, 0, 0],
      touchToMouse: true,
      crisp: true,
      pixelDensity: 1,
    })

    const ColyseusClient = await import('colyseus.js').then(
      (module) => module.Client
    )
    const client = new ColyseusClient(clientEnv.VITE_KITANA_URL)

    await client
      .joinOrCreate(ROOM_NAME, {
        name: 'Pixel Museum',
      })
      .then((room) => {
        gameRoom = room
      })
      .catch(() => {
        gameRoom = null
      })

    if (import.meta.env.DEV) {
      //k.debug.inspect = true;
    }

    const canvas = containerRef.querySelector('canvas')

    if (!canvas || !k) return console.error('Canvas ou kaplay non trouvé')

    canvas.style.imageRendering = 'pixelated'
    canvas.style.imageRendering = '-moz-crisp-edges'
    canvas.style.imageRendering = 'crisp-edges'
    canvas.style.touchAction = 'pan-y'
    canvas.style.pointerEvents = 'auto'

    let touchStartY = 0
    let touchStartX = 0
    let isScrolling = false

    // Desktop scroll
    canvas.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          window.scrollBy({
            top: e.deltaY,
          })
          return
        }
      },
      { passive: true }
    )

    // Mobile scroll
    canvas.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) {
          touchStartY = e.touches[0].clientY
          touchStartX = e.touches[0].clientX
          isScrolling = false
        }
      },
      { passive: true }
    )

    canvas.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length === 1 && !isScrolling) {
          const touchY = e.touches[0].clientY
          const touchX = e.touches[0].clientX
          const deltaY = touchStartY - touchY
          const deltaX = touchStartX - touchX

          if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
            isScrolling = true
            window.scrollBy({
              top: deltaY * 10,
              behavior: 'smooth',
            })
          }
        }
      },
      { passive: true }
    )

    canvas.addEventListener(
      'touchend',
      () => {
        isScrolling = false
        touchStartY = 0
        touchStartX = 0
      },
      { passive: true }
    )

    await pixelMuseumRessources(k)

    k.scene(LEVELS.MUSEUM, () => museumLevel(k))

    k.go(LEVELS.MUSEUM)
  }

  onMount(() => {
    if (typeof window === 'undefined') return
    ignition()
  })
}
