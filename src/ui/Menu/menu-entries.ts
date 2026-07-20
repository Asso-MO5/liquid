import { featureFlag } from '~/features/feature-flag/feature-flag.const'

export const menuEntries: {
  label: { fr: string; en: string }
  href: string
  highlighted?: boolean
  external?: boolean
  green?: boolean
  disabled?: boolean
}[] = [
  {
    label: {
      fr: 'Réservation',
      en: 'Reservation',
    },
    href: '/ticket',
    highlighted: true,
    disabled: !featureFlag.reservation,
  },
  {
    label: {
      fr: 'Offrir un ticket',
      en: 'Gift a ticket',
    },
    href: '/purchase-gift',
    green: true,
    disabled: !featureFlag.reservation,
  },
  {
    label: {
      fr: 'Faire un don',
      en: 'Make a donation',
    },
    external: true,
    href: 'https://don.mo5.com',
  },
  {
    label: {
      fr: 'Devenir membre',
      en: 'Become a member',
    },
    external: true,
    href: 'https://mo5.com/fr/adhesion/',
    green: true,
  },
  {
    label: {
      fr: 'Votre visite',
      en: 'Your visit',
    },
    href: '/your-visit',
    disabled: true,
  },
  {
    label: {
      fr: 'Infos pratiques',
      en: 'Practical information',
    },
    href: '/about',
    disabled: !featureFlag.reservation,
  },
]
