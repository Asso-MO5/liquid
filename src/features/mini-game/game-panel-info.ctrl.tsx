import { createSignal } from "solid-js"
import { clientEnv } from "~/env/client"
import type { GamePanelItem } from "./game-panel-info.types"
import { getTextFromBlock } from "~/utils/get-text-from-block"

const [open, setOpen] = createSignal<GamePanelItem | undefined>(undefined)
const [position, setPosition] = createSignal({ x: 20, y: 20 })
const [isDragging, setIsDragging] = createSignal(false)

let dragStartPos = { x: 0, y: 0 }
let panelStartPos = { x: 0, y: 0 }
let panelRef: HTMLDivElement | null = null
let headerRef: HTMLDivElement | null = null

export const openGamePanelInfo = async (id: string) => {
  try {
    const response = await fetch(`${clientEnv.VITE_CAVE_URL}/item/public/${id}`)
    const data = await response.json()
    const item = data.item as GamePanelItem

    setPosition({ x: 20, y: 85 })
    setOpen(item)
  } catch (error) {
    console.error('Erreur lors du chargement de l\'item:', error)
  }
}

export const closeGamePanelInfo = () => {
  setOpen(undefined)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging() || !panelRef) return
  e.preventDefault()
  const deltaX = (e?.clientX ?? 300) - dragStartPos.x
  const deltaY = (e?.clientY ?? 600) - dragStartPos.y
  const newX = Math.max(0, Math.min(window.innerWidth - panelRef.offsetWidth, panelStartPos.x + deltaX))
  const newY = Math.max(0, Math.min(window.innerHeight - panelRef.offsetHeight, panelStartPos.y + deltaY))
  setPosition({ x: newX, y: newY })
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging() || !panelRef) return
  e.preventDefault()
  const touch = e.touches[0]
  const deltaX = (touch?.clientX ?? 300) - dragStartPos.x
  const deltaY = (touch?.clientY ?? 600) - dragStartPos.y
  const newX = Math.max(0, Math.min(window.innerWidth - panelRef.offsetWidth, panelStartPos.x + deltaX))
  const newY = Math.max(0, Math.min(window.innerHeight - panelRef.offsetHeight, panelStartPos.y + deltaY))
  setPosition({ x: newX, y: newY })
}

const handleMouseUp = () => {
  setIsDragging(false)
}

const handleTouchEnd = () => {
  setIsDragging(false)
}

const handleMouseDown = (e: MouseEvent) => {
  if (!headerRef || !panelRef) return
  e.preventDefault()
  setIsDragging(true)
  dragStartPos = { x: e?.clientX ?? 300, y: e?.clientY ?? 600 }
  panelStartPos = position()
}

const handleTouchStart = (e: TouchEvent) => {
  if (!headerRef || !panelRef) return
  e.preventDefault()
  const touch = e.touches[0]
  setIsDragging(true)
  dragStartPos = { x: touch?.clientX ?? 300, y: touch?.clientY ?? 600 }
  panelStartPos = position()
}

// Initialiser les event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', handleTouchEnd, { passive: false })
}

export const GamePanelInfoCtrl = () => {
  const getDescription = (lang: string = 'fr'): string => {
    const item = open()
    if (!item) return ''

    const blocks = lang === 'fr' ? item.long_description_fr : item.long_description_en
    return getTextFromBlock({ blocks })
  }

  const getCoverImage = (): string | undefined => {
    const item = open()
    if (!item?.medias) return undefined

    const cover = item.medias.find(media => media.relation_type === 'cover')
    return cover?.url
  }

  const getAudio = (): string | undefined => {
    const item = open()
    if (!item?.medias) return undefined
    const audio = item.medias.find(media => media.type?.startsWith('audio/'))
    return audio?.url
  }

  const getYouTubeVideo = (): string | undefined => {
    const item = open()
    if (!item?.medias) return undefined
    const youtube = item.medias.find(media => media.type?.startsWith('youtube-video'))

    if (!youtube) return undefined

    return `https://www.youtube.com/embed/${youtube?.id}?autoplay=0&origin=https://museeedujeuvideo.org`
  }

  return {
    open,
    setOpen,
    position,
    setPosition,
    isDragging,
    setIsDragging,
    getDescription,
    getCoverImage,
    getAudio,
    getYouTubeVideo,
    setPanelRef: (ref: HTMLDivElement | null) => {
      panelRef = ref
    },
    setHeaderRef: (ref: HTMLDivElement | null) => {
      headerRef = ref
    },
    handleMouseDown,
    handleTouchStart,
  }
}