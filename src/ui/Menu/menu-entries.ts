export const menuEntries: { label: { fr: string; en: string }; href: string; highlighted?: boolean; external?: boolean; green?: boolean }[] = [
  {
    label: {
      fr: "Réservation",
      en: "Reservation"
    },
    href: "/ticket",
    highlighted: true
  },
  {
    label: {
      fr: "Offrir un ticket",
      en: "Gift a ticket"
    },
    href: "/purchase-gift",
    green: true
  },
  {
    label: {
      fr: "Faire un don",
      en: "Make a donation"
    },
    external: true,
    href: "https://don.mo5.com"
  },
  {
    label:
    {
      fr: "Votre visite",
      en: "Your visit"
    },
    href: "/your-visit"
  },

  /*
  {
    label: {
      fr: "Infos pratiques",
      en: "Practical information"
    }, href: "/about"
  },
  {
    label: {
      fr: "Évènements",
      en: "Events"
    }, href: "/about"
  },
  */
]