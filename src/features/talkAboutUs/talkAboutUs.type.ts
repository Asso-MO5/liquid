export type Media = {
  id: string
  alt_text?: string
  position?: number | null
  source_url?: string
  title: {
    rendered: string
  }
  sizes: {
    medium: {
      source_url: string
    }
    large: {
      source_url: string
    }
    full: {
      source_url: string
    }
  }

  custom_fields: {
    EN: string[]
    FR: string[]
    Youtube: string[]
    URL: string[]
  }
}