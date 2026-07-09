import { Meta, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './app.css'
import { Modal } from '~/ui/Modal/Modal'
import { Layout } from '~/ui/Layout/Layout'
import schedulesCtrl from '~/features/schedules/schedules.ctrl'
import { priceCtrl } from '~/features/price/price.ctrl'
import { Loader } from './ui/loader'
import { BreakModal } from './features/break-modal/break-modal'

export default function App() {
  schedulesCtrl()
  priceCtrl()

  if (import.meta.env.PROD) {
    console.log(
      '%c🎮 Le musée du jeu vidéo',
      'font-size: 16px; font-weight: bold; color: #3b82f6;'
    )
    console.log(
      '%cCe site est entièrement développé et maintenu par des bénévoles passionnés.',
      'font-size: 12px; color: #64748b;'
    )
    console.log(
      '%cMerci de votre visite ! 🙏',
      'font-size: 12px; color: #64748b;'
    )
  }

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Le musée du jeu vidéo</Title>
          <Meta name="description" content="Le musée du jeu vidéo, par l'association MO5 à Arcueil" />
          <Meta name="keywords" content="musée, jeu vidéo, jeux, jeux vidéo, console, consoles, consoles de jeu vidéo, consoles de jeu vidéo portables, arcade, bornes d'arcade, ordinateur, ordinateurs, informatique, exposition, histoire, histoire du jeu vidéo" />
          <Meta name="og:image" content="https://museedujeuvideo.org/og.png" />
          <Meta name='favicon' content="https://museedujeuvideo.org/favicon.ico" />
          <Meta name="og:description" content="Préserver, comprendre, transmettre : l'héritage du jeu vidéo" />
          <Meta name="og:title" content="Le musée du jeu vidéo" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Suspense fallback={<div class="flex items-center justify-center p-3 h-screen"><Loader /></div>}>
            <Layout>
              <BreakModal />
              {props.children}
            </Layout>
            <Modal />
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
