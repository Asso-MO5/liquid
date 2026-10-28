Fonctionnalité: Journaliser les erreurs du navigateur
  Afin de diagnostiquer les incidents visibles par les visiteurs
  En tant qu’exploitant du musée
  Je veux recevoir des erreurs front concises dans les logs applicatifs

  Scénario: Remonter une erreur JavaScript valide
    Étant donné qu’un navigateur détecte une erreur JavaScript non gérée
    Quand il envoie son type, son message, la page et une pile bornée au endpoint de journalisation
    Alors le serveur répond sans contenu
    Et les logs contiennent une entrée front lisible avec le type, le message et la page

  Scénario: Protéger les logs des charges invalides
    Étant donné qu’un client envoie une charge qui n’est pas du JSON valide ou qui dépasse la taille autorisée
    Quand il appelle le endpoint de journalisation
    Alors le serveur rejette la requête
    Et la charge n’est pas ajoutée aux logs applicatifs

  Scénario: Éviter une boucle de remontée
    Étant donné que le endpoint de journalisation est indisponible
    Quand le navigateur tente de remonter une erreur
    Alors l’échec de remontée ne génère pas une nouvelle erreur remontée
