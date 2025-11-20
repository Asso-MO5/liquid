import { createEffect, createSignal, onMount, createMemo } from "solid-js";
import type { SumUpCardInstance, SumUpResponseBody, PaymentApiWebhook } from "./sumup.types";
import { clientEnv } from "~/env/client";
import { scrollTo } from "~/utils/scroll-to";
import { locales } from "~/utils/langs";
import { useNavigate, useParams } from "@solidjs/router";

type SumUpCtrlProps = {
  checkoutId: string | null;
  checkoutReference: string | null;
  language?: string;
}

export const SumUpCtrl = (props: SumUpCtrlProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const lang = () => params.lang as keyof typeof locales;

  const checkoutId = createMemo(() => props.checkoutId);
  const checkoutReference = createMemo(() => props.checkoutReference);
  const language = createMemo(() => props.language || 'fr');

  createEffect(() => {
    checkoutReference();
  });

  const [sdkLoaded, setSdkLoaded] = createSignal<boolean>(false);
  let sumupCardInstance: SumUpCardInstance | null = null;
  let cardContainer: HTMLDivElement | undefined;

  const setCardContainer = (el: HTMLDivElement) => {
    cardContainer = el;
  };

  onMount(() => {

    if (window.SumUpCard) {
      setSdkLoaded(true);
      return;
    }

    if (document.querySelector('script[src*="sumup.com"]')) {
      const checkSdk = setInterval(() => {
        if (window.SumUpCard) {
          setSdkLoaded(true);
          clearInterval(checkSdk);
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js';
    script.async = true;
    script.onload = () => {
      console.log('SDK SumUp chargé');
      setSdkLoaded(true);
    };
    script.onerror = () => {
      console.error('Erreur lors du chargement du SDK SumUp');
    };
    document.head.appendChild(script);
  });


  createEffect(() => {
    const id = checkoutId();
    const loaded = sdkLoaded();

    if (!id && sumupCardInstance) {
      sumupCardInstance.unmount();
      sumupCardInstance = null;
      if (cardContainer) {
        cardContainer.innerHTML = '';
      }
      return;
    }

    if (!id || !cardContainer || !loaded) {
      return;
    }

    const mountWidget = () => {
      if (!window.SumUpCard || !cardContainer) {
        console.warn('SDK SumUp non disponible ou container manquant');
        return;
      }

      if (sumupCardInstance) {
        sumupCardInstance.unmount();
        sumupCardInstance = null;
      }
      cardContainer.innerHTML = '';

      try {
        sumupCardInstance = window.SumUpCard.mount({
          id: 'sumup-card',
          checkoutId: id,
          locale: locales[language() as keyof typeof locales],
          onResponse: (type: string, body: SumUpResponseBody) => {
            const ref = checkoutReference();
            if (type.match(/error|invalid|fail/)) {
              sendWebhook(type, body, id, ref).then(() => {
                navigate(`/${lang()}/ticket/error`);
              });
            } else if (type.match(/success/)) {
              sendWebhook(type, body, id, ref).then(() => {
                navigate(`/${lang()}/ticket/thanks`);
              });
            }
          },
        });
        scrollTo('ticket', 'step-5');
      } catch (error) {
        console.error('Erreur lors du montage du widget SumUp:', error);
      }
    };

    mountWidget();
  });

  const sendWebhook = async (type: string, body: SumUpResponseBody, checkoutId: string, checkoutReference: string | null) => {
    try {
      const timestamp = new Date().toISOString();
      const lang = language();
      const webhookData: PaymentApiWebhook = {
        id: (body.id as string) || checkoutId,
        type: type,
        timestamp: timestamp,
        checkout_id: checkoutId,
        checkout_reference: checkoutReference || '',
        amount: (body.amount as number) || 0,
        currency: (body.currency as string) || 'EUR',
        status: type === 'success' ? 'SUCCESS' : type === 'fail' ? 'FAILED' : type.toUpperCase(),
        payment_type: (body.payment_type as string) || 'CARD',
        transaction_code: (body.transaction_code as string) || '',
        merchant_code: (body.merchant_code as string) || '',
        language: lang,
        event: {
          id: (body.id as string) || checkoutId,
          type: type,
          timestamp: timestamp,
          checkout_id: checkoutId,
          checkout_reference: checkoutReference || '',
          amount: (body.amount as number) || 0,
          currency: (body.currency as string) || 'EUR',
          status: type === 'success' ? 'SUCCESS' : type === 'fail' ? 'FAILED' : type.toUpperCase(),
          payment_type: (body.payment_type as string) || 'CARD',
          transaction_code: (body.transaction_code as string) || '',
        }
      };

      const response = await fetch(`${clientEnv.VITE_API_URL}/pay/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        console.error('Erreur lors de l\'envoi du webhook:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du webhook:', error);
    }
  };



  return {
    setCardContainer
  }
}