# language: fr
Fonctionnalité: Piloter les fonctionnalités par configuration

  Scénario: Activer la réservation au démarrage
    Étant donné que FEAT_RESERVATION vaut "true" au démarrage de Liquid
    Quand un visiteur consulte le site
    Alors les liens de réservation sont proposés
    Et les pages de réservation sont accessibles

  Scénario: Désactiver la réservation au démarrage
    Étant donné que FEAT_RESERVATION vaut "false" ou est absente au démarrage de Liquid
    Quand un visiteur consulte le site ou ouvre directement une page de réservation
    Alors les liens de réservation ne sont pas proposés
    Et le visiteur est redirigé vers la page d’accueil

  Scénario: Refuser une valeur de configuration invalide
    Étant donné que FEAT_RESERVATION contient une valeur différente de "true" ou "false"
    Quand Liquid démarre
    Alors la réservation reste désactivée
