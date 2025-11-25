export type TextContent = {
  type: 'text'
  text: string
  styles?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}

export type Block = {
  id: string
  type: string
  props?: {
    textColor?: string
    backgroundColor?: string
    textAlignment?: string
  }
  content: TextContent[]
  children: unknown[]
}

export type Media = {
  id: string
  alt?: string
  position?: number | null
  relation_type?: string
  type?: string
  url?: string
}

export type GamePanelItem = {
  id: string
  name: string
  type: string
  status: string
  medias?: Media[]
  long_description_fr?: Block[]
  long_description_en?: Block[]
  [key: string]: unknown
}

export type GamePanelData = {
  item: GamePanelItem
}

