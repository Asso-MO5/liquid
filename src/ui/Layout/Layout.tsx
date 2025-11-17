import { A, useLocation } from "@solidjs/router"
import { createEffect, createSignal, type JSX } from "solid-js"
import { ToastContainer } from "../Toast"
import { Header } from "~/ui/Header/Header"

type LayoutProps = {
  children: JSX.Element
}

export const Layout = (props: LayoutProps) => {

  const location = useLocation()
  const [withGame, setWithGame] = createSignal(true)
  const [page, setPage] = createSignal('')
  createEffect(() => {
    setPage(location.pathname.split('/')[1])
    if (page() === '' || page() === 'game') {
      setWithGame(true)
    } else {
      setWithGame(false)
    }
  })

  return (
    <>
      <ToastContainer />
      <div class="bg-bg m-0 p-0">
        <Header withGame={withGame()} page={page()} />
        <div
          data-page={page()}
          class="grid grid-rows-[1fr_auto] gap-2 h-[100dvh] data-[page=game]:hidden">
          <div class="h-full relative">
            <div class="absolute inset-0 p-4">
              {props.children}
            </div>
          </div>
          <footer class="flex justify-center gap-4 pb-4" >
            <A href="/">Accueil</A>
          </footer >
        </div >
      </div >
    </>
  )
}