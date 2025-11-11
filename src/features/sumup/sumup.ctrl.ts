import { createEffect, createSignal, onMount } from "solid-js";
import type { SumUpCardInstance, SumUpResponseBody } from "./sumup.types";
import { clientEnv } from "~/env/client";

export const SumUpCtrl = () => {

  const [checkoutId, setCheckoutId] = createSignal<string | null>(null);
  const [paymentStatus, setPaymentStatus] = createSignal<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = createSignal<boolean>(false);
  let sumupCardInstance: SumUpCardInstance | null = null;
  let cardContainer: HTMLDivElement | undefined;

  const setCardContainer = (el: HTMLDivElement) => {
    cardContainer = el;
  };

  const pay = async () => {
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/pay/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: 12,
          currency: 'EUR',
          description: 'Test de paiement',
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Checkout créé:', data);

      if (data.id) {
        setCheckoutId(data.id);
        setPaymentStatus(null);
      } else {
        console.error('Erreur: pas d\'ID de checkout reçu');
        alert('Erreur lors de la création du paiement. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    }
  }

  onMount(() => {
    if (window.SumUpCard) {
      setSdkLoaded(true);

      // pay();
      return;
    }

    if (document.querySelector('script[src*="sumup.com"]')) {
      const checkSdk = setInterval(() => {
        if (window.SumUpCard) {
          setSdkLoaded(true);
          clearInterval(checkSdk);
          // pay();
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
      // pay();
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
          onResponse: (type: string, body: SumUpResponseBody) => {
            console.log('Type:', type);
            console.log('Body:', body);

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
                setPaymentStatus('Paiement réussi !');
                verifyCheckoutStatus(id);
                break;
              case 'fail':
                setPaymentStatus('Paiement échoué ou annulé.');
                break;
            }
          },
        });
        console.log('Widget SumUp monté avec succès');
      } catch (error) {
        console.error('Erreur lors du montage du widget SumUp:', error);
        setPaymentStatus('Erreur lors du chargement du widget de paiement.');
      }
    };

    mountWidget();
  });

  const verifyCheckoutStatus = async (id: string) => {
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/pay/checkout/${id}`, {
        method: 'GET',
      });

      if (response.ok) {
        const checkoutData = await response.json();

        if (checkoutData.status === 'PAID') {
          setPaymentStatus('Paiement confirmé avec succès !');
        } else {
          setPaymentStatus(`Statut: ${checkoutData.status}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
    }
  }

  const closePaymentWidget = () => {
    if (sumupCardInstance) {
      sumupCardInstance.unmount();
      sumupCardInstance = null;
    }
    if (cardContainer) {
      cardContainer.innerHTML = '';
    }
    setCheckoutId(null);
    setPaymentStatus(null);
  }

  return {
    checkoutId,
    paymentStatus,
    pay,
    verifyCheckoutStatus,
    closePaymentWidget,
    setCardContainer
  }
}