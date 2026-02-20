import { Show, createSignal, onMount, onCleanup } from "solid-js"
import { pixelMuseumSoundCtrl } from "./pixel-museum-sound.ctrl"
import { translate } from "~/utils/translate"
import { hudTxt } from "./hud.txt"
import { CANVAS_ID, CONTROLS } from "./pixel-museum.const"

export const HUD = () => {
  const { t } = translate(hudTxt)
  const [isPortrait, setIsPortrait] = createSignal(false)
  const [showControlsMenu, setShowControlsMenu] = createSignal(false)
  const soundCtrl = pixelMuseumSoundCtrl()

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
          {/* D-pad en croix pour les directions */}
          <div class="relative pointer-events-auto">
            <div class="grid grid-cols-3 gap-2 w-32 h-32">
              {/* Ligne du haut - vide */}
              <div />
              <button
                class="bg-bg hover:border-primary hover:text-primary text-text rounded-t-lg border border-text backdrop-blur-sm transition-all active:scale-95 flex items-center justify-center  opacity-70 hover:opacity-100"
                onTouchStart={handleJump}
                onTouchEnd={handleJump}
                onMouseDown={handleJump}
                onMouseUp={handleJump}
                onMouseLeave={handleJump}
                title={t().altJump}
                aria-label={t().altJump}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 rotate-90"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15 19l-7-7 7-7v14z" />
                </svg>
              </button>
              <div />

              {/* Ligne du milieu - gauche, centre (menu), droite */}
              <button
                class="bg-bg hover:border-primary hover:text-primary text-text rounded-l-lg border border-text backdrop-blur-sm transition-all active:scale-95 flex items-center justify-center  opacity-70 hover:opacity-100"
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
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15 19l-7-7 7-7v14z" />
                </svg>
              </button>
              <button
                class="bg-bg/90 hover:border-primary hover:text-primary text-text border border-text backdrop-blur-sm transition-all active:scale-95 flex items-center justify-center  opacity-70 hover:opacity-100"
                onClick={() => setShowControlsMenu(!showControlsMenu())}
                title="Afficher les contrôles"
                aria-label="Afficher les contrôles"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                class="bg-bg hover:border-primary hover:text-primary text-text rounded-r-lg border border-text backdrop-blur-sm transition-all active:scale-95 flex items-center justify-center  opacity-70 hover:opacity-100"
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
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 5l7 7-7 7V5z" />
                </svg>
              </button>

              {/* Ligne du bas - vide */}
              <div />
              <button
                class="bg-bg hover:border-primary hover:text-primary text-text rounded-b-lg border border-text backdrop-blur-sm transition-all active:scale-95 flex items-center justify-center  opacity-70 hover:opacity-100 "
                onTouchStart={handleAction}
                onTouchEnd={handleAction}
                onMouseDown={handleAction}
                onMouseUp={handleAction}
                onMouseLeave={handleAction}
                title={t().altAction}
                aria-label={t().altAction}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 rotate-90"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 5l7 7-7 7V5z" />
                </svg>
              </button>
              <div />
            </div>

            {/* Menu des contrôles */}
            <Show when={showControlsMenu()}>
              <div class="absolute bottom-full left-0 mb-2 bg-bg/95 backdrop-blur-sm border border-text rounded-lg p-3 pointer-events-auto min-w-[200px]">
                <div class="space-y-2 text-xs">
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-semibold">{t().moveLeft}</span>
                    <span class="opacity-70">{t().left}</span>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-semibold">{t().moveRight}</span>
                    <span class="opacity-70">{t().right}</span>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-semibold">{t().jumpAction}</span>
                    <div class="flex items-center gap-2 opacity-70">
                      <span>{t().jump}</span>
                      <span class="text-sm font-bold">Σ</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-semibold">{t().interactAction}</span>
                    <div class="flex items-center gap-2 opacity-70">
                      <span>{t().action}</span>
                      <span class="text-sm font-bold">Ω</span>
                    </div>
                  </div>
                </div>
              </div>
            </Show>
          </div>

          {/* Boutons d'actions */}
          <div class="flex gap-3 pointer-events-auto">
            <button
              class="bg-primary hover:bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center border-2 border-white/50 backdrop-blur-sm transition-all active:scale-95"
              onTouchStart={handleJump}
              onMouseDown={handleJump}
              title={t().altJump}
              aria-label={t().altJump}
            >
              {/* Lettre grecque Sigma pour action 1 (saut) */}
              <span class="text-xl font-bold">Σ</span>
            </button>

            <button
              class="bg-secondary hover:bg-secondary text-white rounded-full w-14 h-14 flex items-center justify-center border-2 border-white/50 backdrop-blur-sm transition-all active:scale-95"
              onTouchStart={handleAction}
              onMouseDown={handleAction}
              title={t().altAction}
              aria-label={t().altAction}
            >
              {/* Lettre grecque Omega pour action 2 (interaction) */}
              <span class="text-xl font-bold">Ω</span>
            </button>
          </div>
        </div>
      </Show>

      {/* Version Desktop */}
      <Show when={!isPortrait()}>
        <div class="absolute top-6 left-6 pointer-events-auto z-40">
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
        <div id="game-hud" class="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none z-40">
          {/* Section explications */}
          <div class="bg-bg/90 backdrop-blur-sm rounded-lg p-4 pointer-events-auto">
            <div class="grid grid-cols-2 gap-4 text-xs whitespace-nowrap">
              <div class="flex items-center justify-between gap-4">
                <span class="font-semibold">{t().moveLeft}</span>
                <div class="flex items-center gap-3 text-xs opacity-70">
                  <span>{t().left}</span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="font-semibold">{t().moveRight}</span>
                <div class="flex items-center gap-3 text-xs opacity-70">
                  <span>{t().right}</span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="font-semibold">{t().jumpAction}</span>
                <div class="flex items-center gap-3 text-xs opacity-70">
                  <span>{t().jump}</span>
                  <span class="text-base font-bold">Σ</span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="font-semibold">{t().interactAction}</span>
                <div class="flex items-center gap-3 text-xs opacity-70">
                  <span>{t().action}</span>
                  <span class="text-base font-bold">Ω</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contrôles */}
          <div class="">
            <div class="grid grid-cols-2 gap-2 pointer-events-auto">
              <button
                class="bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center justify-center border border-text backdrop-blur-sm transition-all active:scale-95 text-sm font-mono w-10 h-10"
                onMouseDown={handleLeftDown}
                onMouseUp={handleLeftUp}
                onMouseLeave={handleLeftUp}
                title={t().altLeft}
                aria-label={t().altLeft}
              >
                {/* Triangle plein vers la gauche */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15 19l-7-7 7-7v14z" />
                </svg>
              </button>
              <button
                class="bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center justify-center border border-text backdrop-blur-sm transition-all active:scale-95 text-sm font-mono w-10 h-10"
                onMouseDown={handleRightDown}
                onMouseUp={handleRightUp}
                onMouseLeave={handleRightUp}
                title={t().altRight}
                aria-label={t().altRight}
              >
                {/* Triangle plein vers la droite */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 5l7 7-7 7V5z" />
                </svg>
              </button>

              <button
                class="bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center justify-center border border-text backdrop-blur-sm transition-all active:scale-95 text-sm font-mono w-10 h-10"
                onMouseDown={handleJump}
                title={t().altJump}
                aria-label={t().altJump}
              >
                {/* Lettre grecque Sigma pour action 1 (saut) */}
                <span class="text-base font-bold">Σ</span>
              </button>
              <button
                class="bg-bg hover:border-primary hover:text-primary text-text rounded-lg px-3 py-2 flex items-center justify-center border border-text backdrop-blur-sm transition-all active:scale-95 text-sm font-mono w-10 h-10"
                onMouseDown={handleAction}
                title={t().altAction}
                aria-label={t().altAction}
              >
                {/* Lettre grecque Omega pour action 2 (interaction) */}
                <span class="text-base font-bold">Ω</span>
              </button>
            </div>
          </div>
        </div>

      </Show>
    </>
  )
}

