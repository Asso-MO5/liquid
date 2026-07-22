export type StatusVariant = 'draft' | 'published' | 'cancelled' | 'completed'

export type CategoryVariant =
  | 'video'
  | 'expo'
  | 'ag'
  | 'live'
  | 'meeting'
  | 'training'
  | 'conference'
  | 'other'

export type ChipVariant = StatusVariant | CategoryVariant
