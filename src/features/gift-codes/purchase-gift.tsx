import { Show } from "solid-js";
import { langCtrl } from "~/features/lang-selector/lang.ctrl";
import { purchaseGiftCTRL } from "./purchase-gift.ctrl";

const txt = {
  fr: {
    title: "Offrir une carte cadeau",
    intro:
      "Achetez ici une carte cadeau pour le musée. Vous recevrez par email un ou plusieurs codes cadeaux à offrir, utilisables lors d'une réservation de billets en ligne.",
    add_gift_code: "Ajouter un code cadeau",
    remove_gift_code: "Retirer un code cadeau",
    quantityLabel: "Nombre de codes cadeaux",
    quantityHelp: "Maximum 5 codes cadeaux par commande.",
    emailLabel: "Email de réception des codes",
    emailPlaceholder: "vous@example.com",
    unitPriceLoading: "Chargement du prix...",
    unitPrice: "Prix unitaire",
    totalLabel: "Total",
    payButton: "Payer les cartes cadeaux",
    invalidEmail: "Veuillez saisir un email valide.",
    invalidQuantity: "Veuillez choisir une quantité entre 1 et 5.",
    validityDateMsg: "Les codes cadeaux sont valables jusqu'au {date}.",
  },
  en: {
    title: "Buy a gift card",
    intro:
      "Buy here a gift card for the museum. You will receive by email one or several gift codes to offer, usable when booking tickets online.",
    add_gift_code: "Add a gift code",
    remove_gift_code: "Remove a gift code",
    quantityLabel: "Number of gift codes",
    quantityHelp: "Maximum 5 gift codes per order.",
    emailLabel: "Email to receive the codes",
    emailPlaceholder: "you@example.com",
    unitPriceLoading: "Loading price...",
    unitPrice: "Unit price",
    totalLabel: "Total",
    payButton: "Pay gift cards",
    invalidEmail: "Please enter a valid email address.",
    invalidQuantity: "Please choose a quantity between 1 and 5.",
    validityDateMsg: "The gift codes are valid until {date}.",
  },
};

export const PurchaseGift = () => {
  const lang = langCtrl();
  const ctrl = purchaseGiftCTRL();

  const t = () => txt[lang() as keyof typeof txt];

  return (
    <section class="max-w-xl mx-auto flex flex-col gap-6 p-4">
      <header class="flex flex-col gap-2 text-center">
        <h1 class="text-2xl font-bold">{t().title}</h1>
        <p class="text-sm text-text">{t().intro}</p>
      </header>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3">
          <label for="gift_quantity" class="text-primary font-semibold text-center">
            {t().quantityLabel}
          </label>

          <div class="flex flex-col gap-4">
            <div class="flex h-full text-xl items-center justify-center gap-2">
              <button onClick={() => ctrl.setQuantity(ctrl.quantity() - 1)} type="button"
                aria-label={t().remove_gift_code}
                class="text-xl"
              >
                {"\u2212"}
              </button>
              <div class="text-xl">{ctrl.quantity()}</div>
              <button
                type="button"
                aria-label={t().add_gift_code}
                onClick={() => ctrl.setQuantity(ctrl.quantity() + 1)} disabled={ctrl.quantity() >= ctrl.maxQuantity}>
                {"\u002B"}
              </button>
            </div>
          </div>
          <p class="text-xs text-text/80 text-center">{t().quantityHelp}</p>
          <Show when={!ctrl.quantityValid()}>
            <p class="text-xs text-error">{t().invalidQuantity}</p>
          </Show>
        </div>

        <Show when={ctrl.validityDate()}>
          <p class="text-sm text-center text-accent">{t().validityDateMsg.replace("{date}", ctrl.validityDate())}</p>
        </Show>

        <div class="flex flex-col gap-1">
          <label for="gift_email" class="text-primary font-semibold">
            {t().emailLabel}
          </label>
          <input
            id="gift_email"
            type="email"
            placeholder={t().emailPlaceholder}
            value={ctrl.email()}
            class="bg-white/10 text-text border border-primary rounded-md px-3 py-2"
            onInput={(e) => ctrl.setEmail(e.currentTarget.value)}
          />
          <Show when={ctrl.email() !== "" && !ctrl.emailValid()}>
            <p class="text-xs text-error">{t().invalidEmail}</p>
          </Show>
        </div>

        <div class="flex flex-col gap-2 mt-2 border-t border-primary pt-4 text-sm">
          <Show
            when={!ctrl.isFetchingPrice() && ctrl.unitPrice() != null}
            fallback={
              <p class="italic text-text/80">{t().unitPriceLoading}</p>
            }
          >
            <p>
              <span class="font-semibold text-primary">
                {t().unitPrice}
                {": "}
              </span>
              <span>{ctrl.unitPrice()?.toFixed(2)}€</span>
            </p>
            <Show when={ctrl.totalPrice() != null}>
              <p class="text-lg">
                <span class="font-semibold text-primary">
                  {t().totalLabel}
                  {": "}
                </span>
                <span class="font-bold text-secondary">
                  {ctrl.totalPrice()?.toFixed(2)}€
                </span>
              </p>
            </Show>
          </Show>
        </div>

        <button
          type="button"
          class="btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!ctrl.canSubmit()}
          onClick={() => ctrl.preparePurchase()}
        >
          <Show when={ctrl.isSubmitting()} fallback={t().payButton}>
            <span>{t().payButton}</span>
          </Show>
        </button>

        <Show when={!ctrl.email()}>
          <p class="text-xs text-error text-center">{t().invalidEmail}</p>
        </Show>
      </div>
    </section>
  );
};
