import { translate } from "~/utils/translate"
import { onMount, onCleanup } from "solid-js"

const txt = {
  // \xa0 = non-breaking space
  fr: {
    pause1: "Chers amis,",
    pause2:
      "Depuis le 8 mars, le musée du jeu vidéo de l’association MO5 est entré dans une phase de transition. Des travaux de mise en conformité et de réaménagement du bâtiment, prévus de longue date, doivent débuter prochainement et s’étaler sur plusieurs mois.",
    pause3: "Durant cette période, le musée est fermé au public.",
    pause4: "À ce stade, une date de réouverture ne peut être communiquée.",
    pause5: "Nous reviendrons rapidement vers vous avec de nouvelles informations.",
    pause6: "D’ici là, l’association MO5 poursuit ses activités\xa0:",
    pause7: "retrouvez-nous lors d’événements extérieurs (festivals, conventions, etc.)\xa0;",
    pause8: "suivez nos actualités et les coulisses de nos collections sur nos réseaux sociaux\xa0;",
    pause9: "soutenez l’association en adhérant.",
    pause10: "Nous vous remercions pour votre compréhension.",
    pause11: "L’équipe MO5",
    close: "OK",
    closeAria: "OK, cacher ce message et accéder au site",
  },
  en: {
    pause1: "Dear friends,",
    pause2:
      "Since March 8th, the MO5 association's video game museum has entered a transition phase. Long-planned renovations and upgrades to the building are scheduled to begin soon and will last for several months.",
    pause3: "During this period, the museum will be closed to the public.",
    pause4: "At this time, we are unable to communicate on a reopening date.",
    pause5: "We will be in touch with you soon with more information.",
    pause6: "In the meantime, the MO5 association continues its activities:",
    pause7: "Come see us at external events (festivals, conventions, etc.)",
    pause8: "Follow our news and behind-the-scenes glimpses of our collections on our social media channels",
    pause9: "Support the association by becoming a member",
    pause10: "We are grateful for your patience.",
    pause11: "The MO5 team",
    close: "OK",
    closeAria: "OK, hide this message and access the website",
  },
}

export const PauseModal = () => {
  const { t } = translate(txt)

  const showModal = (): void => {
    const modal = document.getElementById("dialog-pause") as HTMLDialogElement
    modal.showModal()
    // As the text is rather long for small devices, it requires scrolling through the modal to read.
    // We explicitly block the main window scroll to avoid the double scroll effect.
    const body = document.body
    body.classList.add("overflow-hidden")
  }

  const closeModal = (): void => {
    const body = document.body
    body.classList.remove("overflow-hidden")
    const modal = document.getElementById("dialog-pause") as HTMLDialogElement
    modal.close()
  }

  onMount(() => {
    showModal()
    document.addEventListener("keyup", (event) => (event.key === "Escape" ? closeModal() : null))
  })

  onCleanup(() => {
    if (typeof window === "undefined") return
    document.removeEventListener("keyup", (event) => (event.key === "Escape" ? closeModal() : null))
  })

  return (
    <dialog class="max-h-[90vh] w-[98vw] md:w-[60vw] md:text-xl m-auto p-4 border bg-bg text-text overflow-y-scroll" id="dialog-pause">
      {/*
          tabindex=0 to make sure the initial focus is at the top of the modal rather than on the button at the bottom on mobile devices
          outline-0 used here since the title itself is not interactive
      */}
      <p id="title-pause" class="outline-0" tabindex="0">
        {t().pause1}
      </p>
      <p>
        {t().pause2}
        <br />
        {t().pause3}
      </p>
      <p>
        {t().pause4}
        <br />
        {t().pause5}
      </p>
      <p class="mb-0">{t().pause6}</p>
      <ul class="list-disc m-4 mt-0">
        <li>{t().pause7}</li>
        <li>{t().pause8}</li>
        <li>{t().pause9}</li>
      </ul>
      <p>{t().pause10}</p>
      <p>{t().pause11}</p>
      <div class="text-center">
        <button id="dialog-pause-close" onClick={() => closeModal()} commandfor="dialog-pause" command="close" title={t().closeAria}>
          {t().close}
        </button>
      </div>

      {/* Focus trap, when tabbing through the interactive elements in the modal, users should go back to the first element and not go outside the modal */}
      <div id="dialog-pause-end" tabindex="0" class="sr-only" onFocus={() => document.getElementById("title-pause")?.focus()} />
    </dialog>
  )
}
