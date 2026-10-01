Feature: Mesure d'audience
  En tant qu'équipe du musée MO5
  Je veux mesurer la fréquentation du site
  Afin de suivre l'usage des pages et d'éclairer les décisions éditoriales

  Background:
    Given que le site est déployé avec la mesure d'audience Umami

  Scenario: Charger le script de mesure d'audience sur chaque page
    When je visite n'importe quelle page du site
    Then le HTML rendu contient le script Umami de "analytics.mo5.fr"
    And le script porte l'identifiant de site "1754217f-f573-486a-9ffd-6457d62777b6"
    And le script est chargé en mode "defer" sans bloquer le rendu

  Scenario: Ne plus utiliser l'ancien tracker Matomo
    When je visite n'importe quelle page du site
    Then aucun script Matomo n'est présent dans le HTML rendu
    And aucune requête n'est envoyée vers "analytics.mo5.com"

  Scenario: Préserver la confidentialité des visiteurs
    Given que la mesure d'audience est active
    When je visite n'importe quelle page du site
    Then aucun cookie de mesure d'audience n'est déposé sur mon navigateur
