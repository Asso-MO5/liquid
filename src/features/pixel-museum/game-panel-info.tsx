import { Show, createMemo } from "solid-js"
import { translate } from "~/utils/translate"
import { GamePanelInfoCtrl, closeGamePanelInfo } from "./game-panel-info.ctrl"
import { gamePanelInfoTxt } from "./game-panel-info.texts"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { isMuted } from "./pixel-museum-sound.ctrl"

export const GamePanelInfo = () => {
  const { t } = translate(gamePanelInfoTxt)
  const gamePanelInfo = GamePanelInfoCtrl()
  const lang = langCtrl()

  const item = createMemo(() => gamePanelInfo.open())
  const description = createMemo(() => gamePanelInfo.getDescription(lang() === 'fr' ? 'fr' : 'en'))
  const coverImage = createMemo(() => gamePanelInfo.getCoverImage())
  const audioUrl = createMemo(() => gamePanelInfo.getAudio())
  const youTubeVideoUrl = createMemo(() => gamePanelInfo.getYouTubeVideo())

  return (
    <Show when={item()}>
      <div
        id="game-panel-info-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-panel-info-title"
        onKeyDown={gamePanelInfo.handleEscapeKey}
        ref={(el) => gamePanelInfo.setPanelRef(el)}
        class="fixed bg-white rounded-lg shadow-2xl border-2 border-primary max-w-sm w-full max-h-[80vh] flex flex-col z-50 transition-shadow data-[is-dragging=true]:shadow-4xl data-[is-dragging=false]:shadow-2xl"
        data-is-dragging={gamePanelInfo.isDragging()}
        style={{
          left: `${gamePanelInfo.position().x}px`,
          top: `${gamePanelInfo.position().y}px`,
          cursor: gamePanelInfo.isDragging() ? 'grabbing' : 'default',
        }}
      >
        {/* Header */}
        <div
          ref={(el) => gamePanelInfo.setHeaderRef(el)}
          class="bg-primary text-white px-4 py-2 rounded-t-lg flex flex-row-reverse items-center justify-between cursor-grab active:cursor-grabbing select-none"
          onMouseDown={gamePanelInfo.handleMouseDown}
          onTouchStart={gamePanelInfo.handleTouchStart}
        >
          {/* Close button is placed first, so one can quickly close it if opened by mistake or after a focus loop */}
          <button
            id="game-panel-info-close"
            onClick={closeGamePanelInfo}
            class="text-text bg-black/20 transition-colors p-1 rounded border-transparent hover:bg-white hover:text-secondary focus:border-secondary"
            title={t().closeTitle}
            aria-label={t().closeLabel}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 id="game-panel-info-title" class="text-xl m-0 text-white">{item()?.name || 'Information'}</h3>
        </div>

        {/* Content */}
        <div class="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Cover Image */}
          <Show when={coverImage()}>
            <img
              src={coverImage()}
              alt={item()?.name || ''}
              class="w-full h-auto rounded-md object-cover"
              onError={(e) => {
                console.error('Erreur lors du chargement de l\'image:', coverImage())
                e.currentTarget.style.display = 'none'
              }}
            />
          </Show>

          {/* Audio Player */}
          <Show when={audioUrl()}>
            <div class="w-full h-10 ">
              <audio
                controls
                class="w-full h-10"
                src={audioUrl()}
                autoplay={!isMuted()}
                muted={isMuted()}
                onError={(e) => {
                  console.error('Erreur lors du chargement de l\'audio:', audioUrl())
                  e.currentTarget.style.display = 'none'
                }}
              >
                <source src={audioUrl()} />
                Votre navigateur ne supporte pas l'élément audio.
              </audio>
            </div>
          </Show>
          <Show when={youTubeVideoUrl()}>
            <div class="w-full">
              <iframe id="ytplayer" width="340" height="
              240" allowfullscreen class="w-full aspect-video"
                src={youTubeVideoUrl()} />
            </div>
          </Show>

          {/* Description */}
          <Show when={description()}>
            <div
              class="text-sm text-gray-800 prose prose-sm max-w-none"
              // eslint-disable-next-line solid/no-innerhtml
              innerHTML={description()}
            />
          </Show>
        </div>
      </div>
      {/* Focus trap, when tabbing through the interactive elements in the modal, users should go back to the first element and not go outside the modal */}
      <div id="game-info-panel-end" tabindex="0" class="sr-only" onFocus={() => document.getElementById('game-panel-info-close')?.focus()} />
    </Show>
  )
}