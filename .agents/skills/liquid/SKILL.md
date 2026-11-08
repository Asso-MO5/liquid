Liquid — instructions de projet
Contexte et maturité

- Frontend du musée MO5, avec des parcours publics, administratifs et de billetterie. MVP évolutif, mais les parcours visibles du public et les actions sensibles exigent un niveau de qualité de production.
- Le rapprochement de l'ancien frontend Solid vers Liquid est une direction de projet à confirmer dans le dépôt : ne pas supprimer une application ou migrer un écran sans ticket et sans vérifier l'existant.
- Ticketing : CLI HTB, projet MO5/LIQUID, via le skill htb-ticket. Chercher d'abord le ticket courant ; ne pas importer tout le backlog et ne pas inventer de commandes.
  Pour une nouvelle feature ou la stabilisation d'un parcours, consulter si utile .agents/references/ARCHITECTURE.md et .agents/references/QUALITY.md. Ne pas charger ces références pour un ajustement visuel mineur.

Architecture et limites de responsabilité

- Respecter la stack et la structure vérifiées du dépôt : SolidStart / SolidJS, TypeScript, Bun si confirmés localement ; organiser les nouveaux modules par feature plutôt que par catégories techniques globales. Ne pas réécrire les modules historiques sans besoin du ticket.
- Ocelot détient les règles de réservation, de billetterie, de paiement, de jauges et d'autorisation serveur ; Liquid fournit les parcours de présentation et consomme des API explicites. Ne pas dupliquer les décisions métier dans l'UI.
- Les données d'identité et les autorisations reposent sur Zitadel et les contrôles serveur appropriés ; un bouton caché ou un feature flag client ne constitue jamais une permission.
- Conserver les parcours publics FR/EN, les métadonnées, les liens, l'accessibilité clavier, les états de chargement/erreur et l'usage mobile.
- Pour chaque feature flag (FEAT_*) : validation et valeur par défaut sûres côté serveur, exposition au client des seuls flags non sensibles, désactivation effective des routes et actions associées. Respecter les variables et conventions existantes plutôt que créer un second mécanisme.
- Pour le formulaire de contact : validation côté serveur, contrôle d'origine, anti-abus/rate limiting, secrets privés, notifications email/Discord contrôlées et tests sans envoi réel. Le ticket MO5/LIQUID-41 spécifie un maximum de 3 demandes par IP et par 10 minutes ; conserver ce contrat tant qu'il n'est pas changé dans HTB.
- La suppression des anciens embeds WordPress/Hesk, les migrations de contenu ou l'extension des modules analytics/scan/configuration doivent être explicitement couvertes par les tickets ; ne pas les considérer comme déjà terminées.
  Modes et qualité proportionnée
- polish-batch pour un lot de retouches d'un même écran ou parcours ; mvp-build pour une feature minimale utilisable ; debug pour une régression ; harden pour sécuriser/stabiliser un parcours ; release pour sa livraison.
- Une retouche de libellé, style ou alignement : vérifier le diff et le rendu responsive / clavier si interactif ; éviter les tests E2E et scénarios Gherkin artificiels.
- Toute modification de formulaire, authentification, réservation, permissions, feature flag d'accès, appel API ou action réelle : tests de comportement et d'erreur ciblés, Gherkin lorsque cela décrit un parcours observable important. Contrôles d'autorisation et d'intégrité obligatoires sur le serveur concerné.
- Mutualiser la recherche et la vérification des retouches cohérentes d'une même surface, tout en conservant un diff traçable et un ticket HTB. Séparer les modifications indépendantes.
- Confirmer les commandes de lint/typecheck/build/tests et la CI dans le dépôt ; ne pas supposer qu'un environnement ou une validation existe.
  Livraison et coordination
- Si un changement nécessite un nouveau contrat Ocelot, identifier ce besoin avant de coder le client et suivre les tickets de chaque dépôt. Ne pas réimplémenter temporairement la logique serveur dans Liquid.
- Docker, CapRover, variables d'environnement et rollback suivent la procédure réelle du dépôt. Aucun push, merge, déploiement ou opération sur les secrets sans instruction explicite.
- Avant une mise en service publique, vérifier les parcours FR/EN, les erreurs, le responsive, l'accessibilité et les contrôles de sécurité des fonctions réellement touchées.
