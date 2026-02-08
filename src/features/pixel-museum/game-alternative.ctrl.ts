import { fetchItem } from './game-panel-info.ctrl'
import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { getTextFromBlock } from "~/utils/get-text-from-block"
import { MACHINES } from "./game-alternative.const"
import type { Machines } from "./game-alternative.types"
import type { GamePanelItem } from './game-panel-info.types'

const getItem = async (id: string) => {
  try {
    const item = await fetchItem(id)

    if (!item) {
      console.error('Item non trouvé dans la réponse')
      return
    }

    return item
  } catch (error) {
    console.error('Erreur lors du chargement de l\'item:', error)
  }
}

const getDescription = (item: GamePanelItem, lang: 'fr' | 'en') => {
  const blocks = lang === 'fr' ? item.long_description_fr : item.long_description_en

  if (blocks) {
    return getTextFromBlock({ blocks })
  }
}

const getAudioUrl = (item: GamePanelItem) => {
  if (!item?.medias) return undefined

  const audio = item.medias.find(media => media.type?.startsWith('audio/'))
  return audio?.url
}

const getYouTubeVideoUrl = (item: GamePanelItem) => {
  if (!item?.medias) return undefined

  const youtube = item.medias.find(media => media.type?.startsWith('youtube-video'))

  if (!youtube) return undefined

  return `https://www.youtube.com/embed/${youtube?.id}?autoplay=0&origin=https://museeedujeuvideo.org`
}

export const getMachines = async () => {
  const lang = langCtrl()()
  const processedMachines = structuredClone<Machines>(MACHINES)

  for (const machine of processedMachines) {
    try {
      const item = await getItem(machine.id)

      if (!item) {
        console.error('Item non trouvé dans la réponse')
        return
      }

      if (item) {
        // Ideally we'd also take the item name, but it's the wrong name for the NES...
        machine.description = getDescription(item, lang)
        machine.audioUrl = getAudioUrl(item)
        machine.youTubeVideoUrl = getYouTubeVideoUrl(item)
      }
    } catch (error) {
      console.error(`Erreur lors du chargement de l'item ${machine.id}:`, error)
    }
  }

  return processedMachines
}
