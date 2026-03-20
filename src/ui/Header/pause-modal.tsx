import { translate } from "~/utils/translate"
import { onMount, onCleanup } from 'solid-js'

const txt = {
  fr: {
    pause1: 'La première période d’ouverture du musée du jeu vidéo arrive à son terme.',
    pause2: 'Cette étape initiale a rencontré un accueil très encourageant, au-delà de nos espérances, et c’est en grande partie grâce à vous.',
    pause3: 'Comme indiqué dans nos précédentes communications, une période de transition s’ouvre et, à compter du 8 mars au soir, le musée marquera une interruption de son ouverture au public. Cette période doit permettre de faire un point administratif et technique sur le projet. Ce temps de pause sera également l’occasion de réfléchir à l’organisation des espaces et aux perspectives possibles pour la suite.',
    pause4: 'Nous ne manquerons pas de vous tenir informés des prochaines évolutions lorsque le calendrier sera précisé.',
    pause5: 'Merci à nos partenaires et bénévoles pour leur soutien dans cette aventure de préservation du patrimoine vidéoludique.',
    pause6: 'L’équipe MO5',
    close: 'OK',
    closeAria: 'OK, cacher ce message et accéder au site',
  },
  en: {
    pause1: 'The first phase of the video game museum\'s opening is coming to an end.',
    pause2: 'This initial phase has been met with a very encouraging reception, exceeding our expectations, and this is largely thanks to you.',
    pause3: 'As mentioned in our previous communications, a transition period is beginning, and starting the evening of March 8th, the museum will be temporarily closed to the public. This period will allow us to take stock of the project\'s administrative and technical aspects. This pause will also be an opportunity to consider the organization of the spaces and possible future directions.',
    pause4: 'We will keep you informed of further developments as soon as the schedule is finalized.',
    pause5: 'Thank you to our partners and volunteers for their support in this adventure of preserving video game heritage.',
    pause6: 'The MO5 team',
    close: 'OK',
    closeAria: 'OK, hide this message and access the website',
  }
}

export const PauseModal = () => {
  const { t } = translate(txt)

  const showModal = (): void => {
    const modal = document.getElementById('dialog-pause') as HTMLDialogElement
    modal.showModal()
    // As the text is rather long for small devices, it requires scrolling through the modal to read.
    // We explicitly block the main window scroll to avoid the double scroll effect.
    const body = document.body
    body.classList.add('overflow-hidden')
  }

  const closeModal = (): void => {
    const body = document.body
    body.classList.remove('overflow-hidden')
    const modal = document.getElementById('dialog-pause') as HTMLDialogElement
    modal.close()
  }

  onMount(() => {
    showModal()
    document.addEventListener('keyup', event => event.key === 'Escape' ? closeModal() : null)
  })

  onCleanup(() => {
    if (typeof window === 'undefined') return
    document.removeEventListener('keyup', event => event.key === 'Escape' ? closeModal() : null)
  })

  return (
    <dialog
        class="max-h-[90vh] w-[98vw] md:w-[60vw] md:text-xl m-auto p-4 border bg-bg text-text overflow-y-scroll"
        id="dialog-pause"
      >
      {/*
          tabindex=0 to make sure the initial focus is at the top of the modal rather than on the button at the bottom on mobile devices
          outline-0 used here since the title itself is not interactive
      */}
      <h1
        id="title-pause"
        class="text-text font-bold outline-0"
        tabindex="0"
      >{t().pause1}</h1>
      <p>{t().pause2}</p>
      <p>{t().pause3}</p>
      <p>{t().pause4}</p>
      <p>{t().pause5}</p>
      <p>{t().pause6}</p>
      <div class="text-center">
        <button
          id="dialog-pause-close"
          onClick={() => closeModal()}
          commandfor="dialog-pause"
          command="close"
          title={t().closeAria}
        >{t().close}</button>
      </div>

      {/* Focus trap, when tabbing through the interactive elements in the modal, users should go back to the first element and not go outside the modal */}
      <div id="dialog-pause-end" tabindex="0" class="sr-only" onFocus={() => document.getElementById('title-pause')?.focus()} />
    </dialog>
  )
}