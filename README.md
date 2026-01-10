# 🏛️ MO5 Liquid - Frontend Public

Frontend public pour l'association MO5, construit avec **SolidJS**. Ce projet gère la partie publique du site (billeterie, événements publics, mini-jeu).

> **Note** : Ce projet est le frontend public. Pour le backend, voir [Ocelot](https://github.com/Asso-MO5/ocelot). Pour l'interface d'administration, voir [Solid](https://github.com/Asso-MO5/solid).

## 🎯 Vision du Projet

**Liquid** est le **frontend public** du système MO5. Il s'adresse à tous les visiteurs du site de l'association, sans authentification requise.

### 🎯 **Objectifs :**

- **Accessibilité** : Site public accessible à tous
- **Billeterie** : Achat de billets pour les expositions
- **Information** : Présentation de l'association et des événements
- **Divertissement** : Mini-jeu pixel art intégré

### 🔧 **Fonctionnalités principales :**

- **Billeterie publique** pour les expositions
- **Affichage des événements publics**
- **Mini-jeu pixel art multijoueur** intégré (avec serveur Colyseus)
- **Informations pratiques** sur l'association

> L'authentification, la gestion des membres, les cotisations et l'administration sont gérées par d'autres applications (voir [Architecture](#-architecture-du-système-mo5)).

## 🚀 Démarrage rapide

### Prérequis

- **Node.js 22+** : [Télécharger Node.js](https://nodejs.org/)
  - Sur Windows : Télécharger l'installateur `.msi` depuis le site officiel
  - Sur macOS : Utiliser Homebrew (`brew install node@22`) ou télécharger l'installateur
  - Sur Linux : Utiliser le gestionnaire de paquets de votre distribution
  - Vérifier l'installation : `node --version` (doit afficher v22.x.x ou supérieur)
- **Yarn** : Installer après Node.js avec `npm install -g yarn`
- **Backend Ocelot** : Le backend doit être lancé séparément (voir [Ocelot](https://github.com/Asso-MO5/ocelot))
- **Serveur Colyseus (Kitana)** : Le serveur de jeu multijoueur doit être lancé séparément (voir [Kitana](https://github.com/Asso-MO5/kitana))

### Installation et lancement en local

#### 1. Installer Node.js

1. Rendez-vous sur [nodejs.org](https://nodejs.org/)
2. Téléchargez la version **LTS (Long Term Support)** recommandée (22.x ou supérieur)
3. Lancez l'installateur et suivez les instructions
4. Vérifiez l'installation en ouvrant un terminal :
   ```bash
   node --version
   npm --version
   ```

#### 2. Installer Yarn (gestionnaire de paquets)

```bash
npm install -g yarn
```

Vérifiez l'installation :

```bash
yarn --version
```

#### 3. Cloner et configurer le projet

```bash
# Cloner le projet
git clone <repository-url>
cd liquid

# Installer les dépendances
yarn install

# Configurer les variables d'environnement
cp env.example .env
# Éditer .env avec les URLs des services :
# - VITE_API_URL : URL du backend Ocelot
# - VITE_KITANA_URL : URL du serveur Colyseus (Kitana) pour le mini-jeu multijoueur
```

#### 4. Démarrer le serveur de développement

```bash
yarn dev
```

L'application sera accessible sur `http://localhost:5173` (ou le port indiqué dans la console).

#### 5. Accéder au mini-jeu

Le mini-jeu est accessible via la route `/game` une fois l'application lancée.

## 🏗️ Architecture

### Architecture du système MO5

Le système MO5 est composé de **trois applications distinctes** :

1. **Liquid** (ce projet) : Frontend public

   - Billeterie publique
   - Affichage des événements
   - Mini-jeu
   - Informations pratiques

2. **[Ocelot](https://github.com/Asso-MO5/ocelot)** : Backend API

   - Authentification Discord OAuth2
   - Gestion des paiements (SumUp)
   - Base de données PostgreSQL
   - API REST pour les applications frontend

3. **[Solid](https://github.com/Asso-MO5/solid)** : Interface d'administration

   - Gestion des membres
   - Gestion des événements
   - Gestion des cotisations
   - Outils administratifs

4. **[Kitana](https://github.com/Asso-MO5/kitana)** : Serveur Colyseus (jeu multijoueur)
   - Serveur de jeu multijoueur pour le mini-jeu pixel art
   - Gestion des rooms et synchronisation des joueurs
   - Basé sur Colyseus

### Structure Features-Based

```
src/
├── features/                   # Features métier
│   ├── ticketing/              # Billeterie publique
│   ├── events/                 # Affichage des événements publics
│   ├── mini-game/              # Mini-jeu pixel art
│   └── lang-selector/          # Sélecteur de langue
├── routes/                     # Routes de l'application
│   ├── [lang]/                 # Routes avec paramètre de langue
│   └── index.tsx               # Redirection initiale
├── ui/                         # Composants réutilisables
├── utils/                      # Utilitaires
│   └── get-browser-lang.ts     # Détection langue navigateur
└── types/                      # Types TypeScript globaux
```

### Communication avec le backend

Le frontend communique avec **Ocelot** via des appels API REST. L'authentification est gérée par Ocelot via Discord OAuth2.

### 🌐 Gestion multilingue

Le site supporte plusieurs langues (français et anglais) avec une gestion basée sur les routes.

#### Structure des routes

Les routes sont organisées avec un paramètre de langue dans l'URL :

```
/                    → Redirection automatique vers /fr ou /en
/[lang]              → Page d'accueil (ex: /fr, /en)
/[lang]/game         → Mini-jeu (ex: /fr/game, /en/game)
/[lang]/ticket       → Billeterie (ex: /fr/ticket, /en/ticket)
```

#### Détection automatique de la langue

1. **À la première visite** (`/`) :

   - La langue est détectée automatiquement depuis les préférences du navigateur (`navigator.language`)
   - Redirection vers `/fr` ou `/en` selon la langue détectée
   - Par défaut : `/fr` si la langue du navigateur n'est pas l'anglais

2. **Navigation** :
   - La langue est stockée dans le localStorage après sélection
   - Le sélecteur de langue dans le header permet de changer de langue
   - Le changement de langue met à jour l'URL et le localStorage

#### Fichiers liés

- `src/routes/[lang]/` : Routes avec paramètre de langue
- `src/routes/index.tsx` : Redirection initiale basée sur la langue du navigateur
- `src/features/lang-selector/` : Composant et logique de sélection de langue
- `src/utils/get-browser-lang.ts` : Utilitaire pour détecter la langue du navigateur

## 🧪 Tests

```bash
# Lancer tous les tests
yarn test

# Tests en mode watch
yarn test --watch

# Tests avec interface UI
yarn test:ui

# Tests avec couverture
yarn test:coverage
```

## 🎨 Styling

Le projet utilise **Tailwind CSS v4** avec des couleurs personnalisées définies dans `src/app.css` :

```css
@theme {
  --color-bg: #f2f2f2;
  --color-primary: #4088cf;
  --color-secondary: #e84855;
  --color-discord: #5468ff;
  /* ... */
}
```

## 🚀 Scripts disponibles

```bash
yarn dev          # Développement
yarn build        # Build de production
yarn start        # Serveur de production
yarn lint         # Linting
yarn test         # Tests
yarn test:ui      # Tests avec UI
yarn test:coverage # Tests avec couverture
```

## 📁 Documentation

- `docs/` : Documentation technique
- `docs/features/` : Documentation des features
- `docs/architecture/` : Architecture et tech stack

## 🎮 Mini-Jeu Pixel Art

Le projet inclut un mini-jeu multijoueur développé avec **Kaplay**, un moteur de jeu JavaScript pour jeux 2D en pixel art. Le jeu utilise **Colyseus** pour la synchronisation multijoueur via le serveur [Kitana](https://github.com/Asso-MO5/kitana).

### 📁 Fichiers sources du jeu

Les fichiers sources du jeu se trouvent dans les dossiers suivants :

#### Code source du jeu

- **`src/features/pixel-museum/`** : Code source principal du mini-jeu multijoueur
  - `pixel-museum.tsx` : Composant principal du jeu
  - `pixem-museum-init-game.ts` : **Initialisation centralisée de Kaplay** (logique principale du jeu)
  - `pixel-museum.ctrl.tsx` : Contrôleur principal (vérification WebGL, état du jeu)
  - `entities/player.create.ts` : Logique du joueur (mouvement, collisions, animations)
  - `hud.tsx` : Interface utilisateur du jeu (HUD)
  - `levels/museum.level.ts` : Niveau principal du musée
  - `pixel-museum-ressources.ts` : Chargement des ressources (sprites, sons, niveaux)
  - `pixel-museum.multi.ts` : Gestion du multijoueur avec Colyseus
  - `pixel-museum-sound.ctrl.ts` : Contrôleur audio

#### Assets du jeu (sprites, sons, polices)

- **`public/pixel-museum/entities/`** : Sprites des entités

  - Fichiers `.aseprite` : Fichiers source Aseprite des personnages et entités
  - Fichiers `.png` : Sprite sheets exportées
  - Fichiers `.json` : Métadonnées des animations (frame tags, durées)
  - Dossier `composed/` : Sprites composés générés aléatoirement

- **`public/pixel-museum/tiles/`** : Tilesets et niveaux

  - `museum.aseprite` / `museum.png` : Tileset principal
  - `start.aseprite` / `start.png` : Niveau de départ

- **`public/pixel-museum/objs/`** : Objets interactifs

  - `ticket-desk.aseprite` / `ticket-desk.png` : Bureau de billetterie
  - `ticket-pc.aseprite` / `ticket-pc.png` : PC de billetterie

- **`public/pixel-museum/sounds/`** : Sons et effets sonores

  - `jump.ogg` : Son de saut
  - `ignition.ogg` : Son d'allumage
  - `explosion.ogg` : Son d'explosion
  - `bythepond.ogg` : Musique d'ambiance
  - Autres sons : `hurt.ogg`, `collided.ogg`, etc.

- **`public/pixel-museum/fonts/`** : Polices
  - `Silkscreen/` : Police pixel art pour l'interface

### 🏗️ Architecture du code du jeu

Le code du jeu a été structuré pour **éviter les problèmes de nettoyage et de réinitialisation** avec Kaplay :

#### Stratégie de garde en vie (Keep-Alive)

**Pourquoi garder le jeu en vie ?**

Kaplay est un moteur de jeu qui gère de nombreux états internes (game loop, ressources, événements, WebGL, etc.). Lors du changement de page ou du démontage du composant, tenter de nettoyer complètement Kaplay peut causer :

- **Erreurs de référence** : `Cannot read properties of undefined`
- **Fuites mémoire** : Références circulaires non résolues
- **Problèmes de réinitialisation** : Conflits lors de la réinitialisation après nettoyage
- **Problèmes WebGL** : Contexte WebGL perdu ou mal réinitialisé

**Solution adoptée :**

1. **Initialisation unique** : Le jeu est initialisé **une seule fois** dans `pixem-museum-init-game.ts`
2. **Vérification WebGL** : Le composant vérifie le support WebGL avant d'afficher le canvas
3. **Gestion d'erreurs** : Try/catch autour de l'initialisation pour éviter les crashes
4. **Multijoueur** : Connexion au serveur Colyseus (Kitana) pour la synchronisation des joueurs
5. **Séparation des responsabilités** :
   - `pixel-museum.tsx` : Gère l'affichage conditionnel (WebGL check)
   - `pixem-museum-init-game.ts` : Contient toute la logique d'initialisation Kaplay
   - `pixel-museum.multi.ts` : Gère la synchronisation multijoueur avec Colyseus

Cette approche garantit une **stabilité maximale** et évite les bugs liés au cycle de vie des composants SolidJS.

#### Structure des fichiers

```
src/features/pixel-museum/
├── pixel-museum.tsx              # Composant principal
├── pixem-museum-init-game.ts    # Initialisation Kaplay
├── pixel-museum.ctrl.tsx         # Contrôleur (WebGL check, état)
├── pixel-museum-ressources.ts   # Chargement des ressources
├── pixel-museum.multi.ts         # Gestion multijoueur Colyseus
├── pixel-museum-sound.ctrl.ts   # Contrôleur audio
├── pixel-museum.state.ts         # État global
├── entities/
│   ├── player.create.ts          # Logique du joueur
│   └── remote-player.create.ts   # Logique des autres joueurs
├── levels/
│   └── museum.level.ts           # Niveau principal
└── hud.tsx                       # Interface utilisateur
```

### 🛠️ Outils nécessaires pour modifier le jeu

Pour modifier les assets du jeu, vous aurez besoin de :

1. **Aseprite** (recommandé) : [aseprite.org](https://www.aseprite.org/)

   - Pour éditer les sprites du joueur et des entités
   - Pour créer/modifier les tilesets
   - Export en PNG avec métadonnées JSON pour les animations
   - Alternative gratuite : [Piskel](https://www.piskelapp.com/) (en ligne)

2. **Éditeur de texte** : Pour modifier les fichiers de configuration

   - Les animations sont définies dans les fichiers JSON d'Aseprite
   - Les ressources sont listées dans `pixel-museum-ressources.ts`

3. **Serveur Colyseus (Kitana)** : Pour tester le multijoueur
   - Voir : [github.com/Asso-MO5/kitana](https://github.com/Asso-MO5/kitana)
   - Le serveur doit être lancé et accessible via `VITE_KITANA_URL`

### 📝 Workflow de développement du jeu

1. **Modifier les sprites** :

   - Ouvrir les fichiers `.aseprite` dans `public/pixel-museum/entities/` avec Aseprite
   - Modifier les animations (stand, walk, jump, grounded, interact, etc.)
   - Exporter en PNG et JSON depuis Aseprite
   - Les frame tags définissent les animations dans les fichiers JSON

2. **Ajouter des ressources** :

   - Ajouter les fichiers dans `public/pixel-museum/`
   - Déclarer les ressources dans `src/features/pixel-museum/pixel-museum-ressources.ts`
   - Utiliser les méthodes Kaplay : `loadAseprite()`, `loadSprite()`, `loadSound()`, `loadFont()`

3. **Tester les modifications** :
   - Lancer le serveur Colyseus (Kitana) : voir [github.com/Asso-MO5/kitana](https://github.com/Asso-MO5/kitana)
   - Configurer `VITE_KITANA_URL` dans `.env`
   - Lancer `yarn dev`
   - Accéder à la route du jeu dans le navigateur
   - Les ressources sont rechargées automatiquement en développement

### 🎨 Format des assets

- **Sprites** : Format Aseprite (`.aseprite`) avec export PNG + JSON
- **Animations** : Définies dans JSON avec frame tags et durées personnalisées
- **Sons** : Format OGG pour compatibilité navigateur
- **Polices** : Format TTF

### ⚠️ Notes importantes sur le développement

#### Réinitialisation du jeu

Si vous devez **forcer une réinitialisation complète** du jeu (par exemple après des modifications majeures), vous pouvez :

1. **Recharger complètement la page** (F5 ou Ctrl+R)
2. **Vérifier le support WebGL** : Le jeu ne s'affiche que si WebGL est supporté
3. **Vérifier la connexion Colyseus** : Le serveur Kitana doit être accessible

#### Débogage

- Les logs de Kaplay apparaissent dans la console du navigateur
- Utilisez les DevTools pour inspecter le canvas et les ressources chargées
- Vérifiez la connexion au serveur Colyseus dans la console
- En cas d'erreur WebGL, vérifiez que votre navigateur supporte WebGL

## 🎯 Features à implémenter

### Phase 1 - Base publique

- ⏳ **Ticketing** : Billeterie publique pour expositions (intégration avec Ocelot)
- ⏳ **Public Events** : Affichage public des événements
- ✅ **Mini-jeu** : Jeu pixel art intégré

### Phase 2 - Améliorations

- ⏳ **Informations pratiques** : Horaires, accès, contact
- ⏳ **Galerie** : Photos des expositions
- ⏳ **Actualités** : Blog/actualités de l'association

> **Note** : Les fonctionnalités d'authentification, de gestion des membres, d'administration et de cotisations sont gérées par les autres applications du système MO5.

## 🎯 Architecture du Système MO5

### 🏠 Liquid (ce projet) - Frontend Public

- **Billeterie** pour les expositions
- **Événements publics** à venir
- **Informations** sur l'association
- **Mini-jeu** pixel art

### 🔧 Ocelot - Backend API

- **Authentification Discord** OAuth2
- **API REST** pour les applications frontend
- **Gestion des paiements** (SumUp)
- **Base de données** PostgreSQL
- Voir : [github.com/Asso-MO5/ocelot](https://github.com/Asso-MO5/ocelot)

### 👥 Solid - Interface d'Administration

- **Gestion des événements** (création, modification)
- **Gestion des membres** et rôles
- **Gestion des cotisations**
- **Rapports** et statistiques
- Voir : [github.com/Asso-MO5/solid](https://github.com/Asso-MO5/solid)

### 🎮 Kitana - Serveur Colyseus (Jeu Multijoueur)

- **Serveur de jeu multijoueur** pour le mini-jeu pixel art
- **Synchronisation des joueurs** en temps réel
- **Gestion des rooms** Colyseus
- Basé sur **Colyseus** (framework de jeu multijoueur)
- Voir : [github.com/Asso-MO5/kitana](https://github.com/Asso-MO5/kitana)

## 🔒 Sécurité et Confidentialité

- **Authentification** gérée par Ocelot (Discord OAuth2)
- **API sécurisée** avec validation et CORS
- **Cookies HTTP-only** pour les sessions
- **Communication HTTPS** en production

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-feature`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle feature'`)
4. Push vers la branche (`git push origin feature/nouvelle-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

**MO5 Liquid** - Frontend public pour l'association MO5 🏛️

---

> **Repositories liés :**
>
> - [Ocelot](https://github.com/Asso-MO5/ocelot) - Backend API
> - [Solid](https://github.com/Asso-MO5/solid) - Interface d'administration
> - [Kitana](https://github.com/Asso-MO5/kitana) - Serveur Colyseus (jeu multijoueur)
