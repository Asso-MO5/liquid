Fonctionnalité: Déployer Liquid avec CapRover
  Afin d’exécuter le site dans un environnement géré
  En tant qu’exploitant
  Je veux déployer une image Docker configurable au démarrage

  Scénario: Démarrer avec la configuration publique de CapRover
    Étant donné que les variables VITE_API_URL, VITE_BLOG_URL, VITE_CAVE_URL,
    VITE_STRIPE_PUBLISHABLE_KEY et VITE_KITANA_URL sont définies dans CapRover
    Quand le conteneur démarre
    Alors Liquid écoute sur le port configuré
    Et le navigateur reçoit ces seules variables publiques

  Scénario: Préserver les secrets côté serveur
    Étant donné que RESEND_API_KEY est définie dans CapRover
    Quand le conteneur démarre
    Alors RESEND_API_KEY n’est pas présente dans la configuration envoyée au navigateur
