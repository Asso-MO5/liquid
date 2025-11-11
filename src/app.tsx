// @refresh reload
import { MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import './app.css'
import { Modal } from '~/ui/Modal/Modal'

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Le musée du jeu vidéo</Title>
          <Suspense>
            {props.children}
            <Modal />
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
