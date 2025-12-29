import { ticketTxt } from "./ticket.txt"
import { setTicketStore, ticketStore } from "./ticket.store"
import { translate } from "~/utils/translate";
import { onMount } from "solid-js";

export const PersonalInfos = () => {
  const { t } = translate(ticketTxt)

  let emailInputRef: HTMLInputElement | undefined;

  onMount(() => {
    // Retirer readonly au focus pour permettre la saisie
    emailInputRef?.addEventListener('focus', () => {
      if (emailInputRef) {
        emailInputRef.removeAttribute('readonly');
      }
    });
  });

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label for="first_name" class="text-primary">{t.first_name}</label>
        <input
          aria-label={t.first_name}
          aria-required="true"
          required
          auto-complete="given-name"
          id="first_name" type="text" class="bg-white/10 text-text" value={ticketStore.first_name} onInput={(e) => setTicketStore('first_name', e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-1">
        <label for="last_name" class="text-primary">{t.last_name}</label>
        <input
          aria-label={t.last_name}
          aria-required="true"
          required
          auto-complete="family-name"
          id="last_name" type="text" class="bg-white/10 text-text" value={ticketStore.last_name} onInput={(e) => setTicketStore('last_name', e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-1">
        <label for="email" class="text-primary">{t.email}</label>
        {/* Champ factice pour tromper l'autocomplétion */}
        <input
          type="email"
          name="email_fake"
          autocomplete="off"
          tabindex="-1"
          style={{ position: 'absolute', left: '-9999px', opacity: 0, 'pointer-events': 'none' }}
          aria-hidden="true"
        />
        <input
          ref={emailInputRef}
          aria-label={t.email}
          aria-required="true"
          required
          readonly
          autocomplete="new-password"
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          name="email_input"
          id="email"
          type="email"
          class="bg-white/10 text-text"
          value={ticketStore.email}
          onInput={(e) => {
            if (emailInputRef) {
              emailInputRef.removeAttribute('readonly');
            }
            setTicketStore('email', e.currentTarget.value);
          }}
        />
      </div>
      <p class="text-xs text-amber-500 italic">{t.warningEmail}</p>
    </div>
  )
}