import { Show, createSignal, onMount, onCleanup } from "solid-js"
import { CONTROLS, CANVAS_ID } from "./mini-game.const"

export const HUD = () => {
  const [isPortrait, setIsPortrait] = createSignal(false)

  const checkOrientation = () => {
    if (typeof window === 'undefined') return
    setIsPortrait(window.innerWidth < window.innerHeight && window.innerWidth < 768)
  }

  onMount(() => {
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
  })

  onCleanup(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', checkOrientation)
    window.removeEventListener('orientationchange', checkOrientation)
  })

  const triggerKeyEvent = (key: string, type: 'keydown' | 'keyup' | 'keypress') => {
    if (typeof window === 'undefined') return

    // Mapper les touches aux codes corrects pour Kaplay
    const keyMap: Record<string, { key: string, code: string }> = {
      'space': { key: ' ', code: 'Space' },
      'up': { key: 'ArrowUp', code: 'ArrowUp' },
      'left': { key: 'ArrowLeft', code: 'ArrowLeft' },
      'right': { key: 'ArrowRight', code: 'ArrowRight' },
      'a': { key: 'a', code: 'KeyA' },
      'q': { key: 'q', code: 'KeyQ' },
      'd': { key: 'd', code: 'KeyD' },
      'w': { key: 'w', code: 'KeyW' },
      'z': { key: 'z', code: 'KeyZ' },
      'x': { key: 'x', code: 'KeyX' },
      'e': { key: 'e', code: 'KeyE' },
      'f': { key: 'f', code: 'KeyF' },
      'interact': { key: 'e', code: 'KeyE' },
    }

    const keyInfo = keyMap[key.toLowerCase()] || { key: key.toLowerCase(), code: key }

    // Dispatcher sur plusieurs cibles pour s'assurer que Kaplay reçoit l'événement
    const canvas = document.getElementById(CANVAS_ID)?.querySelector('canvas')
    const targets = [canvas, document, window].filter(Boolean) as (HTMLElement | Document | Window)[]

    targets.forEach(target => {
      const event = new KeyboardEvent(type, {
        key: keyInfo.key,
        code: keyInfo.code,
        bubbles: true,
        cancelable: true,
      })
      target.dispatchEvent(event)
    })
  }

  const handleLeftDown = () => {
    CONTROLS.MOVE_LEFT.forEach(key => triggerKeyEvent(key, 'keydown'))
  }

  const handleLeftUp = () => {
    CONTROLS.MOVE_LEFT.forEach(key => triggerKeyEvent(key, 'keyup'))
  }

  const handleRightDown = () => {
    CONTROLS.MOVE_RIGHT.forEach(key => triggerKeyEvent(key, 'keydown'))
  }

  const handleRightUp = () => {
    CONTROLS.MOVE_RIGHT.forEach(key => triggerKeyEvent(key, 'keyup'))
  }

  const handleJump = () => {
    // Simuler keypress avec keydown puis keyup rapidement
    // Kaplay onKeyPress détecte keydown suivi de keyup rapidement
    CONTROLS.JUMP.forEach(key => {
      triggerKeyEvent(key, 'keydown')
      // Utiliser requestAnimationFrame pour s'assurer que keydown est traité avant keyup
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          triggerKeyEvent(key, 'keyup')
        })
      })
    })
  }

  const handleAction = () => {
    // Simuler keypress avec keydown puis keyup rapidement
    CONTROLS.INTERACT.forEach(key => {
      triggerKeyEvent(key, 'keydown')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          triggerKeyEvent(key, 'keyup')
        })
      })
    })
  }

  return (
    <Show when={isPortrait()}>
      <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-40 md:hidden">
        {/* Boutons gauche/droite en bas à gauche (discrets) */}
        <div class="flex gap-6 pointer-events-auto opacity-30">
          <button
            class="bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all active:scale-95 opacity-70"
            onTouchStart={handleLeftDown}
            onTouchEnd={handleLeftUp}
            onMouseDown={handleLeftDown}
            onMouseUp={handleLeftUp}
            onMouseLeave={handleLeftUp}
            aria-label="Gauche"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            class="bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all active:scale-95 opacity-70"
            onTouchStart={handleRightDown}
            onTouchEnd={handleRightUp}
            onMouseDown={handleRightDown}
            onMouseUp={handleRightUp}
            onMouseLeave={handleRightUp}
            aria-label="Droite"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bouton saut à gauche du centre */}
        <div class="flex gap-6">
          <button
            class="bg-primary/80 hover:bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center border-2 border-white/50 backdrop-blur-sm transition-all active:scale-95 pointer-events-auto opacity-10"
            onTouchStart={handleJump}
            onMouseDown={handleJump}
            aria-label="Sauter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>

          {/* Bouton action à droite */}
          <button
            class="bg-secondary/80 hover:bg-secondary text-white rounded-full w-14 h-14 flex items-center justify-center border-2 border-white/50 backdrop-blur-sm transition-all active:scale-95 pointer-events-auto opacity-10"
            onTouchStart={handleAction}
            onMouseDown={handleAction}
            aria-label="Action"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>
    </Show>
  )
}

