import { Chip } from './Chip'
import type { StatusVariant } from './Chip.types'

interface StatusChipProps {
  status?: StatusVariant
}

export const StatusChip = (props: StatusChipProps) => {
  const getStatusText = (status?: string): string => {
    switch (status) {
      case 'draft':
        return 'Brouillon'
      case 'published':
        return 'Publié'
      case 'cancelled':
        return 'Annulé'
      case 'completed':
        return 'Terminé'
      default:
        return 'Inconnu'
    }
  }

  return (
    <Chip type="status" variant={props.status}>
      {getStatusText(props.status)}
    </Chip>
  )
}
