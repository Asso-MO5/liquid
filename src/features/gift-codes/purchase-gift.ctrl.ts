import { createMemo, createSignal, onMount } from "solid-js";
import { clientEnv } from "~/env/client";
import { langCtrl } from "~/features/lang-selector/lang.ctrl";
import { toast } from "~/ui/Toast";

type GiftCodePriceSetting = {
  id: string;
  key: string;
  value: string;
  value_type: "number" | "string" | "boolean";
  description?: string;
};

export const purchaseGiftCTRL = () => {
  const lang = langCtrl();

  const [quantity, setQuantity] = createSignal(1);
  const [email, setEmail] = createSignal("");
  const [unitPrice, setUnitPrice] = createSignal<number | null>(null);
  const [isFetchingPrice, setIsFetchingPrice] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const maxQuantity = 5;

  const totalPrice = createMemo(() => {
    const price = unitPrice();
    if (price == null) return null;
    return price * quantity();
  });

  const emailValid = createMemo(() => {
    const value = email().trim();
    if (!value) return false;

    const testEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return testEmail;
  });

  const quantityValid = createMemo(
    () => quantity() >= 1 && quantity() <= maxQuantity,
  );

  const canSubmit = createMemo(
    () => !!unitPrice() && emailValid() && quantityValid() && !isSubmitting(),
  );

  const fetchPrice = async () => {
    setIsFetchingPrice(true);
    try {
      const response = await fetch(
        `${clientEnv.VITE_API_URL}/museum/settings/gift_code_price`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("FAILED_TO_FETCH_PRICE");
      }

      const data: GiftCodePriceSetting = await response.json();
      const price = Number.parseFloat(data.value);
      if (Number.isNaN(price)) {
        throw new Error("INVALID_PRICE_VALUE");
      }
      setUnitPrice(price);
    } catch (error) {
      console.error("Erreur lors de la récupération du prix du code cadeau", error);
      const messages = {
        fr: "Impossible de récupérer le prix du code cadeau. Merci de réessayer plus tard.",
        en: "Unable to retrieve gift code price. Please try again later.",
      };
      toast.error(messages[lang() as keyof typeof messages]);
    } finally {
      setIsFetchingPrice(false);
    }
  };

  const preparePurchase = async () => {
    if (!canSubmit()) {
      const messages = {
        fr: "Veuillez renseigner un email valide et une quantité entre 1 et 5.",
        en: "Please provide a valid email and a quantity between 1 and 5.",
      };
      toast.error(messages[lang() as keyof typeof messages]);
      return;
    }

    setIsSubmitting(true);
    try {
      const origin = window.location.origin;
      const langStr = String(lang());

      const successUrl = `${origin}/${langStr}/purchase-gift?status=success`;
      const cancelUrl = `${origin}/${langStr}/purchase-gift?status=cancel`;

      const body = {
        quantity: quantity(),
        email: email().trim(),
        language: langStr,
        success_url: successUrl,
        cancel_url: cancelUrl,
      };

      const response = await fetch(
        `${clientEnv.VITE_API_URL}/museum/gift-codes/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data: { checkout_id?: string; checkout_url?: string; error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "FAILED_TO_CREATE_CHECKOUT");
      }

      if (!data.checkout_url || !data.checkout_id) {
        const messages = {
          fr: "Réponse inattendue du serveur pour la création du paiement.",
          en: "Unexpected server response while creating payment.",
        };
        toast.error(messages[lang() as keyof typeof messages]);
        return;
      }

      // On stocke le checkout_id pour la confirmation sur la page de callback
      try {
        window.localStorage.setItem(
          "museum_gift_codes_checkout_id",
          data.checkout_id,
        );
      } catch {
        // stockage non bloquant
      }

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error("Erreur lors de la préparation de l'achat de codes cadeaux", error);
      if (error instanceof Error) {
        const msg =
          error.message === "FAILED_TO_CREATE_CHECKOUT"
            ? {
              fr: "Impossible de démarrer le paiement des codes cadeaux.",
              en: "Unable to start gift code payment.",
            }
            : null;

        if (msg) {
          toast.error(msg[lang() as keyof typeof msg]);
          return;
        }
        toast.error(error.message);
        return;
      }

      const messages = {
        fr: "Une erreur est survenue lors de la préparation du paiement.",
        en: "An error occurred while preparing the payment.",
      };
      toast.error(messages[lang() as keyof typeof messages]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuantitySafe = (value: number) => {
    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }
    if (value < 1) {
      setQuantity(1);
      return;
    }
    if (value > maxQuantity) {
      setQuantity(maxQuantity);
      return;
    }
    setQuantity(value);
  };


  const validityDate = createMemo(() => {
    const validityDate = new Date(2026, 2, 8);
    return validityDate.toLocaleDateString(lang(), { year: "numeric", month: "long", day: "numeric" });
  });

  onMount(() => {
    fetchPrice();
  });

  return {
    quantity,
    setQuantity: setQuantitySafe,
    email,
    setEmail,
    unitPrice,
    totalPrice,
    isFetchingPrice,
    isSubmitting,
    maxQuantity,
    emailValid,
    quantityValid,
    canSubmit,
    preparePurchase,
    validityDate,
  };
};


