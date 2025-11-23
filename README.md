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
- **Mini-jeu pixel art** intégré
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
# Éditer .env avec l'URL du backend Ocelot
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

Le projet inclut un mini-jeu développé avec **MelonJS**, un moteur de jeu JavaScript pour jeux 2D en pixel art.

### 📁 Fichiers sources du jeu

Les fichiers sources du jeu se trouvent dans les dossiers suivants :

#### Code source du jeu

- **`src/features/mini-game/`** : Code source principal du mini-jeu
  - `mini-game.tsx` : Composant React/SolidJS minimal qui gère le conteneur du jeu
  - `game.init.ts` : **Initialisation centralisée de MelonJS** (logique principale du jeu)
  - `entities/player.ts` : Logique du joueur (mouvement, collisions, animations)
  - `entities/HUD.ts` : Interface utilisateur du jeu
  - `screens/start.ts` : Écran de démarrage et chargement des niveaux
  - `screens/loading.ts` : Écran de chargement personnalisé
  - `ressources.ts` : Liste des ressources à charger (sprites, sons, niveaux)
  - `game-state.ts` : État global du jeu
  - `mini-game.types.ts` : Types TypeScript pour le jeu

#### Assets du jeu (sprites, tilesets, sons)

- **`public/game/entities/`** : Sprites du joueur
  - `lulu.aseprite` : Fichier source Aseprite du personnage
  - `lulu.png` : Sprite sheet exportée
  - `lulu.json` : Métadonnées des animations (frame tags, durées)
- **`public/game/tiles/`** : Tilesets et niveaux

  - `tileset.png` : Tileset principal (8x8 pixels par tile)
  - `tileset.tsx` / `tileset.json` : Définitions du tileset
  - `start.tmx` : Niveau de départ (format Tiled)
  - `start.aseprite` : Fichier source Aseprite du niveau
  - `start.png` : Image exportée du niveau
  - Autres niveaux : `home.tmx`, `interlude.tmx`, `final.tmx`, etc.

- **`public/game/sounds/`** : Sons et effets sonores

  - `jump.mp3` : Son de saut
  - `spike.mp3` : Son de chute/impact
  - Autres sons : `hurt.mp3`, `explosion.mp3`, etc.

- **`public/game/fnt/`** : Polices bitmap
  - `PressStart2P.*` : Police pixel art pour l'interface

### 🏗️ Architecture du code du jeu

Le code du jeu a été structuré pour **éviter les problèmes de nettoyage et de réinitialisation** avec MelonJS :

#### Stratégie de garde en vie (Keep-Alive)

**Pourquoi garder le jeu en vie ?**

MelonJS est une bibliothèque complexe qui gère de nombreux états internes (game loop, ressources, événements, etc.). Lors du changement de page ou du démontage du composant, tenter de nettoyer complètement MelonJS peut causer :

- **Erreurs de référence** : `Cannot read properties of undefined (reading 'length')`
- **Fuites mémoire** : Références circulaires non résolues
- **Problèmes de réinitialisation** : Conflits lors de la réinitialisation après nettoyage

**Solution adoptée :**

1. **Initialisation unique** : Le jeu est initialisé **une seule fois** dans `game.init.ts` avec un garde `gameInitialized`
2. **Pas de nettoyage agressif** : Le composant `mini-game.tsx` ne nettoie **pas** MelonJS lors du démontage
3. **Réutilisation** : Si le composant est remonté, MelonJS réutilise l'instance existante au lieu de créer une nouvelle
4. **Séparation des responsabilités** :
   - `mini-game.tsx` : Gère uniquement le conteneur DOM et la prop `init`
   - `game.init.ts` : Contient toute la logique d'initialisation MelonJS (une seule fois)

Cette approche garantit une **stabilité maximale** et évite les bugs liés au cycle de vie des composants React/SolidJS.

#### Structure des fichiers

```
src/features/mini-game/
├── mini-game.tsx          # Composant minimal (conteneur + prop init)
├── game.init.ts          # Initialisation MelonJS (singleton)
├── game-state.ts         # État global partagé
├── ressources.ts         # Définition des ressources
├── mini-game.types.ts    # Types TypeScript
├── entities/
│   ├── player.ts         # Logique du joueur
│   └── HUD.ts           # Interface utilisateur
└── screens/
    ├── start.ts          # Écran de jeu
    └── loading.ts       # Écran de chargement
```

### 🛠️ Outils nécessaires pour modifier le jeu

Pour modifier les assets du jeu, vous aurez besoin de :

1. **Aseprite** (recommandé) : [aseprite.org](https://www.aseprite.org/)

   - Pour éditer les sprites du joueur (`lulu.aseprite`)
   - Pour créer/modifier les tilesets
   - Export en PNG avec métadonnées JSON pour les animations
   - Alternative gratuite : [Piskel](https://www.piskelapp.com/) (en ligne)

2. **Tiled Map Editor** : [mapeditor.org](https://www.mapeditor.org/)

   - Pour créer et éditer les niveaux (fichiers `.tmx`)
   - Format utilisé : TMX (Tiled Map XML)
   - Les tilesets doivent être configurés dans Tiled

3. **Éditeur de texte** : Pour modifier les fichiers JSON de configuration
   - Les animations sont définies dans `lulu.json`
   - Les ressources sont listées dans `ressources.ts`

### 📝 Workflow de développement du jeu

1. **Modifier les sprites** :

   - Ouvrir `public/game/entities/lulu.aseprite` dans Aseprite
   - Modifier les animations (stand, walk, jump, grounded)
   - Exporter en PNG et JSON depuis Aseprite
   - Les frame tags définissent les animations dans `lulu.json`

2. **Créer/modifier un niveau** :

   - Ouvrir `public/game/tiles/start.tmx` dans Tiled
   - Utiliser le tileset `tileset.png` (8x8 pixels)
   - Dessiner le niveau avec les tiles
   - Sauvegarder en `.tmx`
   - Exporter l'image de prévisualisation si nécessaire

3. **Ajouter des ressources** :

   - Ajouter les fichiers dans `public/game/`
   - Déclarer les ressources dans `src/features/mini-game/ressources.ts`
   - Format : `{ name: 'nom', type: 'image|json|audio|tmx', src: 'chemin' }`

4. **Tester les modifications** :
   - Lancer `yarn dev`
   - Accéder à `/game` dans le navigateur
   - Les ressources sont rechargées automatiquement en développement
   - **Note** : Si vous modifiez `game.init.ts`, vous devrez peut-être recharger complètement la page (F5) car l'initialisation est en singleton

### 🎨 Format des assets

- **Sprites** : Format PNG avec sprite sheet (toutes les frames sur une image)
- **Animations** : Définies dans JSON avec frame tags et durées personnalisées
- **Niveaux** : Format TMX (Tiled Map XML) avec tilesets PNG
- **Sons** : Format MP3/OGG pour compatibilité navigateur

### ⚠️ Notes importantes sur le développement

#### Réinitialisation du jeu

Si vous devez **forcer une réinitialisation complète** du jeu (par exemple après des modifications majeures dans `game.init.ts`), vous pouvez :

1. **Recharger complètement la page** (F5 ou Ctrl+R)
2. **Modifier temporairement** `game.init.ts` pour réinitialiser le garde :
   ```typescript
   // Dans game.init.ts, ligne 8
   let gameInitialized = false // Forcer la réinitialisation
   ```

#### Débogage

- Les logs de MelonJS apparaissent dans la console du navigateur
- Utilisez les DevTools pour inspecter le canvas et les ressources chargées
- En cas d'erreur, vérifiez que `game.init.ts` n'a été appelé qu'une seule fois

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
