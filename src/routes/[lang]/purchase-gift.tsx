import { Show, createSignal, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { clientEnv } from "~/env/client";
import { toast } from "~/ui/Toast";
import { PurchaseGift as PurchaseGiftView } from "~/features/gift-codes/purchase-gift";
import { translate } from "~/utils/translate";
import { txt } from "./purchase-gift.txt";

const PurchaseGiftRoute = () => {
  const { t } = translate(txt)
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = createSignal(false);
  const [confirmationError, setConfirmationError] = createSignal<string | null>(
    null,
  );
  const [confirmationDone, setConfirmationDone] = createSignal(false);

  const status = () =>
    (searchParams.status as "success" | "cancel" | undefined) ?? undefined;

  const confirmPurchase = async () => {
    const checkoutId =
      typeof window !== "undefined"
        ? window.localStorage.getItem("museum_gift_codes_checkout_id")
        : null;

    if (!checkoutId) {
      setConfirmationError(t.missingCheckout);
      return;
    }

    setIsConfirming(true);
    try {
      const response = await fetch(
        `${clientEnv.VITE_API_URL}/museum/gift-codes/purchase/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ checkout_id: checkoutId }),
        },
      );

      const data: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "FAILED_TO_CONFIRM_PURCHASE");
      }

      setConfirmationDone(true);
      try {
        window.localStorage.removeItem("museum_gift_codes_checkout_id");
      } catch {
        // ignore
      }
      const { t: successTxt } = translate({
        fr: { success: "Votre paiement a bien été confirmé." },
        en: { success: "Your payment has been successfully confirmed." },
      });
      toast.success(successTxt.success);
    } catch (error) {
      console.error(
        "Erreur lors de la confirmation d'achat de codes cadeaux",
        error,
      );
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t.confirmError);
      }
      setConfirmationError(t.confirmError);
    } finally {
      setIsConfirming(false);
    }
  };

  onMount(() => {
    if (status() === "success") {
      void confirmPurchase();
    }
    if (status() === "cancel") {
      try {
        window.localStorage.removeItem("museum_gift_codes_checkout_id");
      } catch {
        // ignore
      }
    }
  });

  return (
    <main class="items-center justify-center relative overflow-y-auto flex flex-col gap-6 p-6 text-text">
      <Show when={status() === "success"}>
        <section class="max-w-xl mx-auto mb-4 p-4 border border-secondary rounded-md bg-black/30">
          <h2 class="text-xl font-bold text-secondary mb-2">
            {t.successTitle}
          </h2>
          <Show when={isConfirming()}>
            <p class="text-sm text-text">{t.confirming}</p>
          </Show>
          <Show when={confirmationDone() && !confirmationError()}>
            <p class="text-sm text-text">{t.successDescription}</p>
          </Show>
          <Show when={confirmationError()}>
            <p class="text-sm text-error">{confirmationError()}</p>
          </Show>
        </section>
      </Show>

      <Show when={status() === "cancel"}>
        <section class="max-w-xl mx-auto mb-4 p-4 border border-error rounded-md bg-black/30">
          <h2 class="text-xl font-bold text-error mb-2">
            {t.cancelTitle}
          </h2>
          <p class="text-sm text-text">{t.cancelDescription}</p>
        </section>
      </Show>

      <PurchaseGiftView />
    </main>
  );
};

export default PurchaseGiftRoute;
