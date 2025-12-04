// @refresh reload
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

export default function App() {
  schedulesCtrl()
  priceCtrl()
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Le musée du jeu vidéo</Title>
          <Meta name="description" content="Le musée du jeu vidéo" />
          <Meta name="keywords" content="musée, jeu vidéo, jeux, jeux vidéo, jeux de société, jeux de sociétés, jeux de sociétés en ligne, jeux de sociétés en ligne gratuit, jeux de sociétés en ligne gratuitement, jeux de sociétés en ligne gratuitement sans inscription, jeux de sociétés en ligne gratuitement sans inscription, jeux de sociétés en ligne gratuitement sans inscription, jeux de sociétés en ligne gratuitement sans inscription" />
          <Meta name="og:image" content="https://museedujeuvideo.org/og.png" />
          <Meta name="og:description" content="Préserver, comprendre, transmettre : l'héritage du jeu vidéo" />
          <Meta name="og:title" content="Le musée du jeu vidéo" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Suspense fallback={<div class="flex items-center justify-center p-3 h-screen"><Loader /></div>}>
            <Layout>
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
