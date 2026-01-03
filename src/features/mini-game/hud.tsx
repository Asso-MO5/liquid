import { Show, createSignal, onMount, onCleanup } from "solid-js"
import { CONTROLS, CANVAS_ID } from "./mini-game.const"
import { getSoundCtrl } from "./sound.ctrl"
import { translate } from "~/utils/translate"
import { hudTxt } from "./hud.txt"

export const HUD = () => {
  const { t } = translate(hudTxt)
  const [isPortrait, setIsPortrait] = createSignal(false)
  const soundCtrl = getSoundCtrl()

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
        {/* Bouton contrôle son en haut à droite */}
        <div class="absolute top-4 right-4 pointer-events-auto z-40 md:hidden">
          <button
            onClick={soundCtrl.toggleMute}
            class="bg-bg hover:border-primary hover:text-primary text-text rounded-full w-10 h-10 flex items-center justify-center border border-text backdrop-blur-sm transition-all active:scale-95"
            title={soundCtrl.isMuted() ? t().soundOn : t().soundOff}
            aria-label={soundCtrl.isMuted() ? t().soundOn : t().soundOff}
          >
            <Show
              when={soundCtrl.isMuted()}
              fallback={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </Show>
          </button>
        </div>
        <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-40 md:hidden">
          {/* Boutons gauche/droite en bas à gauche (discrets) */}
          <div class="flex gap-6 pointer-events-auto">
            <button
              class="bg-bg hover:border-primary hover:text-primary text-text rounded-full w-10 h-10 flex items-center justify-center border border-text backdrop-blur-sm transition-all active:scale-95"
              onTouchStart={handleLeftDown}
              onTouchEnd={handleLeftUp}
              onMouseDown={handleLeftDown}
              onMouseUp={handleLeftUp}
              onMouseLeave={handleLeftUp}
              title={t().altLeft}
              aria-label={t().altLeft}
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
              class="bg-bg hover:border-primary hover:text-primary text-text rounded-full w-10 h-10 flex items-center justify-center border border-text backdrop-blur-sm transition-all active:scale-95"
              onTouchStart={handleRightDown}
              onTouchEnd={handleRightUp}
              onMouseDown={handleRightDown}
              onMouseUp={handleRightUp}
              onMouseLeave={handleRightUp}
              title={t().altRight}
              aria-label={t().altRight}
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
              title={t().altJump}
              aria-label={t().altJump}
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
              title={t().altAction}
              aria-label={t().altAction}
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
        <div class="absolute bottom-6 left-6 pointer-events-auto z-40">
          <button
            onClick={soundCtrl.toggleMute}
            class="bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center gap-2 border border-text backdrop-blur-sm transition-all active:scale-95"
            title={soundCtrl.isMuted() ? t().soundOn : t().soundOff}
            aria-label={soundCtrl.isMuted() ? t().soundOn : t().soundOff}
          >
            <Show
              when={soundCtrl.isMuted()}
              fallback={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </Show>
          </button>
        </div>
        <div class="absolute bottom-6 right-6 flex flex-col gap-3 pointer-events-none z-40">
          {/* Contrôles de mouvement */}
          <div class="grid grid-cols-2 gap-2 pointer-events-auto">
            <button
              class="
              justify-between
              bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center gap-2 border border-text backdrop-blur-sm transition-all active:scale-95 text-sm font-mono"
              onMouseDown={handleLeftDown}
              onMouseUp={handleLeftUp}
              onMouseLeave={handleLeftUp}
              title={t().altLeft}
              aria-label={t().altLeft}
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
              <span class="text-xs opacity-70">{t().left}</span>
            </button>
            <button
              class="
              justify-between
              bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center gap-2 border border-text backdrop-blur-sm transition-all active:scale-95 text-sm font-mono"
              onMouseDown={handleRightDown}
              onMouseUp={handleRightUp}
              onMouseLeave={handleRightUp}
              title={t().altRight}
              aria-label={t().altRight}
            >
              <span class="text-xs opacity-70">{t().right}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>



            <button
              class="
              justify-between
              bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center gap-2 border border-text backdrop-blur-sm transition-all active:scale-95 text-sm font-mono"
              onMouseDown={handleJump}
              title={t().altJump}
              aria-label={t().altJump}
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
              <span class="text-xs opacity-70">{t().jump}</span>
            </button>
            <button
              class="
              justify-between
              bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center gap-2 border border-text backdrop-blur-sm transition-all active:scale-95 text-sm font-mono"
              onMouseDown={handleAction}
              title={t().altAction}
              aria-label={t().altAction}
            >

              <span class="text-xs opacity-70">{t().action}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
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
    </>
  )
}

