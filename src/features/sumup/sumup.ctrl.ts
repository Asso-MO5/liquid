import { createEffect, createSignal, onMount, createMemo } from "solid-js";
import type { SumUpCardInstance, SumUpResponseBody } from "./sumup.types";
import { clientEnv } from "~/env/client";
import { scrollTo } from "~/utils/scroll-to";

type SumUpCtrlProps = {
  checkoutId: string | null;
  checkoutReference: string | null;
}

export const SumUpCtrl = (props: SumUpCtrlProps) => {
  const checkoutId = createMemo(() => props.checkoutId);
  const checkoutReference = createMemo(() => props.checkoutReference);

  createEffect(() => {
    checkoutReference();
  });

  const [paymentStatus, setPaymentStatus] = createSignal<string | null>(null);
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
      setPaymentStatus('Erreur lors du chargement du SDK de paiement.');
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
      setPaymentStatus(null);
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
          onResponse: (type: string, body: SumUpResponseBody) => {
            switch (type) {
              case 'sent':
                setPaymentStatus('Envoi en cours...');
                break;
              case 'invalid':
                setPaymentStatus('Erreur de validation. Veuillez vérifier vos informations.');
                break;
              case 'auth-screen':
                setPaymentStatus('Authentification en cours...');
                break;
              case 'error':
                setPaymentStatus(`Erreur: ${body?.message || 'Une erreur est survenue'}`);
                break;
              case 'success':
                // TODO ici ajouter la logique pour rediriger vers la page de réussite et envoyer à l'api
                setPaymentStatus('Paiement réussi !');
                verifyCheckoutStatus(id);
                break;
              case 'fail':
                setPaymentStatus('Paiement échoué ou annulé.');
                break;
              default:
                console.log('Type de réponse non géré:', type);
            }
          },
        });
        setPaymentStatus(null);
        scrollTo('ticket', 'step-5');// Réinitialiser le statut lors du montage
      } catch (error) {
        console.error('Erreur lors du montage du widget SumUp:', error);
        setPaymentStatus('Erreur lors du chargement du widget de paiement.');
      }
    };

    mountWidget();
  });

  const verifyCheckoutStatus = async (id: string) => {
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/museum/tickets/checkout/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const checkoutData = await response.json();

        if (checkoutData.status === 'PAID' || checkoutData.status === 'SUCCESS') {
          setPaymentStatus('Paiement confirmé avec succès !');
        } else {
          setPaymentStatus(`Statut: ${checkoutData.status}`);
        }
      } else {
        console.error('Erreur lors de la vérification du statut:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      setPaymentStatus('Erreur lors de la vérification du paiement.');
    }
  }

  return {
    paymentStatus,
    verifyCheckoutStatus,
    setCardContainer
  }
}