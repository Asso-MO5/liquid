import { useLocation } from "@solidjs/router"
import { createEffect, createSignal, type JSX } from "solid-js"
import { ToastContainer } from "../Toast"
import { Header } from "~/ui/Header/Header"
import ScrollBehavior from "../ScrollBehavior"
import { Footer } from "../footer/footer"

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
      <ScrollBehavior />
      <ToastContainer />
      <div
        data-with-game={withGame()}
        class="m-0 p-0 h-[100dvh]">
        <Header withGame={withGame()} page={page()} />
        {props.children}
        {page() !== 'game' && <Footer />}
      </div >
    </>
  )
}