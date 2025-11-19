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
    setPage(location.pathname.split('/')[2])
    if (!page() || page() === 'game') {
      setWithGame(true)
    } else {
      setWithGame(false)
    }
  })

  return (
    <>
      <ToastContainer />
      <div
        data-with-game={withGame()}
        class="bg-bg m-0 p-0 
        data-[page=game]:block
        data-[with-game=false]:h-[100dvh]  
        data-[with-game=false]:grid 
        data-[with-game=false]:grid-rows-[auto_1fr_auto] ">
        <Header withGame={withGame()} page={page()} />
        <div
          data-page={page()}
          data-with-game={withGame()}
          class="grid grid-rows-[1fr_auto] gap-2 h-full data-[page=game]:hidden data-[with-game=true]:h-[100dvh]">
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