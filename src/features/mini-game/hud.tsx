import { Show, createSignal, onMount, onCleanup } from "solid-js"
import { CONTROLS, CANVAS_ID } from "./mini-game.const"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"

const hudTxt = {
  fr: {
    left: '(Q / ←)',
    right: '(D / →)',
    jump: '(Espace / Up / Z)',
    action: '(E / F)',
    altLeft: '(Q)',
    altRight: '(D)',
    altJump: '(Espace)',
    altAction: '(E)',
  },
  en: {
    left: '(Q / ←)',
    right: '(D / →)',
    jump: '(Space / Up / Z)',
    action: '(E / F)',
    altLeft: 'Q',
    altRight: '(D)',
    altJump: '(Space)',
    altAction: '(E)',
  },
}

export const HUD = () => {

  const lang = langCtrl()
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
    CONTROLS.JUMP.forEach(key => {
      triggerKeyEvent(key, 'keydown')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          triggerKeyEvent(key, 'keyup')
        })
      })
    })
  }

  const handleAction = () => {
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
    <>
      {/* Version Mobile (Portrait) */}
      <Show when={isPortrait()}>
        <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-40 md:hidden">
          {/* Boutons gauche/droite en bas à gauche (discrets) */}
          <div class="flex gap-6 pointer-events-auto">
            <button
              class="bg-black/20 hover:bg-black/40 text-text rounded-full w-10 h-10 flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all active:scale-95"
              onTouchStart={handleLeftDown}
              onTouchEnd={handleLeftUp}
              onMouseDown={handleLeftDown}
              onMouseUp={handleLeftUp}
              onMouseLeave={handleLeftUp}
              title={hudTxt[lang()].altLeft}
              aria-label={hudTxt[lang()].altLeft}
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
              class="bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all active:scale-95"
              onTouchStart={handleRightDown}
              onTouchEnd={handleRightUp}
              onMouseDown={handleRightDown}
              onMouseUp={handleRightUp}
              onMouseLeave={handleRightUp}
              title={hudTxt[lang()].altRight}
              aria-label={hudTxt[lang()].altRight}
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
          <div class="flex gap-6 ">
            <button
              class="bg-primary hover:bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center border-2 border-white/50 backdrop-blur-sm transition-all active:scale-95 pointer-events-auto"
              onTouchStart={handleJump}
              onMouseDown={handleJump}
              title={hudTxt[lang()].altJump}
              aria-label={hudTxt[lang()].altJump}
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
              class="bg-secondary hover:bg-secondary text-white rounded-full w-14 h-14 flex items-center justify-center border-2 border-white/50 backdrop-blur-sm transition-all active:scale-95 pointer-events-auto"
              onTouchStart={handleAction}
              onMouseDown={handleAction}
              title={hudTxt[lang()].altAction}
              aria-label={hudTxt[lang()].altAction}
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

      {/* Version Desktop */}
      <Show when={!isPortrait()}>
        <div class="absolute bottom-6 right-6 flex flex-col gap-3 pointer-events-none z-40">
          {/* Contrôles de mouvement */}
          <div class="flex gap-2 pointer-events-auto">
            <button
              class="bg-black/30 hover:bg-black/50 text-white rounded-lg px-3 py-2 flex items-center gap-2 border border-white/20 backdrop-blur-sm transition-all active:scale-95 text-sm font-mono"
              onMouseDown={handleLeftDown}
              onMouseUp={handleLeftUp}
              onMouseLeave={handleLeftUp}
              title={hudTxt[lang()].altLeft}
              aria-label={hudTxt[lang()].altLeft}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="text-xs opacity-70">{hudTxt[lang()].left}</span>
            </button>
            <button
              class="bg-black/30 hover:bg-black/50 text-white rounded-lg px-3 py-2 flex items-center gap-2 border border-white/20 backdrop-blur-sm transition-all active:scale-95 text-sm font-mono"
              onMouseDown={handleRightDown}
              onMouseUp={handleRightUp}
              onMouseLeave={handleRightUp}
              title={hudTxt[lang()].altRight}
              aria-label={hudTxt[lang()].altRight}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span class="text-xs opacity-70">{hudTxt[lang()].right}</span>
            </button>
          </div>

          {/* Contrôles d'action */}
          <div class="flex gap-2 pointer-events-auto">
            <button
              class="bg-transparent text-white rounded-lg px-3 py-2 flex items-center gap-2 border border-white/30 backdrop-blur-sm transition-all active:scale-95 text-sm font-mono"
              onMouseDown={handleJump}
              title={hudTxt[lang()].altJump}
              aria-label={hudTxt[lang()].altJump}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span class="text-xs opacity-70">{hudTxt[lang()].jump}</span>
            </button>
            <button
              class="bg-transparent text-white rounded-lg px-3 py-2 flex items-center gap-2 border border-white/30 backdrop-blur-sm transition-all active:scale-95 text-sm font-mono"
              onMouseDown={handleAction}
              title={hudTxt[lang()].altAction}
              aria-label={hudTxt[lang()].altAction}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-xs opacity-70">{hudTxt[lang()].action}</span>
            </button>
          </div>
        </div>
      </Show>
    </>
  )
}

