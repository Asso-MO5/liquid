import { Meta, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './app.css'
import { priceCtrl } from '~/features/price/price.ctrl'
import schedulesCtrl from '~/features/schedules/schedules.ctrl'
import { Layout } from '~/ui/Layout/Layout'
import { Modal } from '~/ui/Modal/Modal'
import { SplashModal } from './features/splash-modal/splash-modal'
import { Loader } from './ui/loader'

const getLangFromPath = (pathname: string) => {
  if (pathname.startsWith('/en')) {
    return 'en'
  }

  return 'fr'
}

// @TODO broken:
// - Les données ne se mettent pas à jour correctement à chaque changement de page (SPA - pas de soucis au rechargement complet comme au clic sur le logo Home)
// - Certaines pages sont fetchées de WP et ont leurs propres title/description (voir [slug].tsx & your-visit.tsx) mais ça ne marche pas non plus
// - Gérer ça dans chaque page individuellement ?
const txt = (pathname: string) => {
  const lang = getLangFromPath(pathname)

  const baseline = {
    'fr': 'Le Musée du Jeu Vidéo',
    'en': 'The Video Game Museum',
  }

  const descriptions = {
    'fr': 'Le Musée du Jeu Vidéo, par l\'association MO5 à Arcueil',
    'en': 'The Video Game Museum, by the MO5 association in Arcueil, France',
  }

  const keywords = {
    'fr': "musée, jeu vidéo, jeux, jeux vidéo, console, consoles, consoles de jeu vidéo, consoles de jeu vidéo portables, arcade, bornes d'arcade, ordinateur, ordinateurs, informatique, exposition, histoire, histoire du jeu vidéo",
    'en': 'museum, video game, video games, games, console, consoles, video game consoles, handheld video game consoles, arcade, arcade cabinets, computer, computers, computing, exhibition, history, video game history',
  }

  const titles: {
    [key: string]: string
  } = {
    '/fr': 'Accueil',
    '/en': 'Home',
    '/fr/ticket': 'Réservation',
    '/en/ticket': 'Booking',
    '/fr/purchase-gift': 'Carte cadeau',
    '/en/purchase-gift': 'Gift card',
    '/fr/contact': 'Contact',
    '/en/contact': 'Contact',
    // titres censés être fetchés depuis WP
    // '/fr/your-visit': 'Visiter',
    // '/en/your-visit': 'Visit',
    // '/fr/about-us': 'Qui sommes-nous ?',
    // '/en/about-us': 'About us',
    // '/fr/legal-notice': 'Mentions légales',
    // '/en/legal-notice': 'Legal notice',
    // '/fr/cgv': 'Conditions Générales de Vente',
    // '/en/cgv': 'General Conditions of Sale',
    // '/fr/privacy-policy': 'Politique de confidentialité',
    // '/en/privacy-policy': 'Privacy Policy',
    // '/fr/press-kit': 'Kit Presse',
    // '/en/press-kit': 'Press Kit',
    // '/fr/partners': 'Partenaires',
    // '/en/partners': 'Partners',
  }

  return {
    baseline: baseline[lang],
    description: descriptions[lang],
    keyword: keywords[lang],
    title: pathname in titles ? `${titles[pathname]} - ${baseline[lang]}` : baseline[lang],
  }
}

export default function App() {
  schedulesCtrl()
  priceCtrl()

  return (
    <Router
      root={(props) => {
        const translations = txt(props.location.pathname)

        return (
          <MetaProvider>
            <Title>{translations['title']}</Title>
            <Meta name="description" content={translations['description']} />
            <Meta name="keywords" content={translations['keyword']} />
            <Meta name="og:image" content="https://museedujeuvideo.org/og.png" />
            <Meta name="favicon" content="https://museedujeuvideo.org/favicon.ico" />
            <Meta name="og:description" content={translations['description']} />
            <Meta name="og:title" content={translations['baseline']} />
            <Meta name="viewport" content="width=device-width, initial-scale=1" />
            <Suspense
              fallback={
                <div class="flex items-center justify-center p-3 h-screen">
                  <Loader />
                </div>
              }
            >
              <Layout>
                <SplashModal />
                {props.children}
              </Layout>
              <Modal />
            </Suspense>
          </MetaProvider>
        )
      }}
    >
      <FileRoutes />
    </Router>
  )
}
