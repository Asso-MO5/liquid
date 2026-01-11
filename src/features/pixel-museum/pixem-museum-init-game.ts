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

export const pixelMuseumInitGame = async () => {
  const ignition = async () => {

    const containerRef = document.getElementById(
      CANVAS_ID
    ) as HTMLDivElement | null

    if (!containerRef) {
      console.error(`Container ${CANVAS_ID} non trouvé`)
      return
    }

    const containerWidth = containerRef.clientWidth || 800
    const containerHeight = containerRef.clientHeight || 600
    const pixelHeight = Math.round(containerHeight / (32 * 6))

    let kaplayModule
    try {
      kaplayModule = await import('kaplay')
    } catch (error) {
      console.error('Erreur lors du chargement de kaplay:', error)
      return
    }

    const kaplay = kaplayModule?.default
    if (typeof kaplay !== 'function') {
      console.error('kaplay n\'est pas une fonction valide')
      return
    }

    try {
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

      if (!k || typeof k !== 'object' || !k.scene || !k.go) {
        console.error('kaplay n\'a pas été correctement initialisé')
        k = null
        return
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de kaplay:', error)
      k = null
      return
    }

    if (import.meta.env.DEV) {
      //k.debug.inspect = true;
    }

    const canvas = containerRef.querySelector('canvas')

    if (!canvas || !k) {
      console.error('Canvas ou kaplay non trouvé')
      return
    }


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

    const BASE_URL = `${window.location.protocol}//${window.location.host}/pixel-museum`

    if (k) await pixelMuseumRessources(k, BASE_URL)


    k.scene(LEVELS.MUSEUM, async () => {
      museumLevel(k)
    })

    let ColyseusClient
    try {
      const colyseusModule = await import('colyseus.js')
      ColyseusClient = colyseusModule?.Client
      if (!ColyseusClient) {
        console.error('Colyseus Client non trouvé')
        gameRoom = null
      } else {
        const client = new ColyseusClient(clientEnv.VITE_KITANA_URL)

        await client
          .joinOrCreate(ROOM_NAME, {
            name: 'Pixel Museum',
          })
          .then((room) => {
            gameRoom = room
          })
          .catch((error) => {
            console.error('Erreur lors de la connexion à Colyseus:', error)
            gameRoom = null
          })
      }
    } catch (error) {
      console.error('Erreur lors du chargement de Colyseus:', error)
      gameRoom = null
    }



    k.go(LEVELS.MUSEUM)


  }

  onMount(() => {
    if (typeof window === 'undefined') return
    ignition()
  })
}
