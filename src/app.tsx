// @refresh reload
import { Meta, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './app.css'
import { Modal } from '~/ui/Modal/Modal'
import { Layout } from './ui/Layout/Layout'

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Le musée du jeu vidéo</Title>
          <Meta name="description" content="Le musée du jeu vidéo" />
          <Meta name="keywords" content="musée, jeu vidéo, jeux, jeux vidéo, jeux de société, jeux de sociétés, jeux de sociétés en ligne, jeux de sociétés en ligne gratuit, jeux de sociétés en ligne gratuitement, jeux de sociétés en ligne gratuitement sans inscription, jeux de sociétés en ligne gratuitement sans inscription, jeux de sociétés en ligne gratuitement sans inscription, jeux de sociétés en ligne gratuitement sans inscription" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Suspense>
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
