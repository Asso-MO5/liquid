# 🏛️ MO5 - Espace Membre d'Association

Application de gestion complète pour l'association MO5, construite avec SolidJS et une architecture DDD pragmatique. Ce système permet de gérer les membres, les événements, la billeterie, les cotisations et tous les aspects organisationnels de l'association.

## 🎯 Vision du Projet

MO5 est un **espace membre complet** avec plusieurs niveaux d'accès et de nombreuses fonctionnalités :

### 🏗️ **Niveaux d'accès :**

- **Public** : Billeterie pour les expositions
- **Membres** : Inscription aux événements (système Doodle-like)
- **Bureau** : Gestion administrative complète
- **Pôles** : Outils spécialisés (Live/Vidéo, etc.)

### 🔧 **Fonctionnalités principales :**

- **Billeterie publique** pour les expositions
- **Gestion d'événements** (organisation + inscriptions membres)
- **Outils pôle Live/Vidéo** (scripts, planning)
- **Gestion des cotisations**
- **Gestion de la collection**
- **Authentification Discord** (intégration serveur asso)

## 🚀 Démarrage rapide

### Prérequis

- **Node.js 22+** : [Télécharger Node.js](https://nodejs.org/)
  - Sur Windows : Télécharger l'installateur `.msi` depuis le site officiel
  - Sur macOS : Utiliser Homebrew (`brew install node@22`) ou télécharger l'installateur
  - Sur Linux : Utiliser le gestionnaire de paquets de votre distribution
  - Vérifier l'installation : `node --version` (doit afficher v22.x.x ou supérieur)
- **Yarn** : Installer après Node.js avec `npm install -g yarn`
- **MySQL** : Base de données requise pour le backend
- **Serveur Discord de l'association** : Pour l'authentification

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
# Éditer .env avec vos valeurs (base de données, Discord, etc.)
```

#### 4. Démarrer le serveur de développement

```bash
yarn dev
```

L'application sera accessible sur `http://localhost:5173` (ou le port indiqué dans la console).

#### 5. Accéder au mini-jeu

Le mini-jeu est accessible via la route `/game` une fois l'application lancée.

## 🏗️ Architecture

### Structure Features-Based

```
src/
├── features/                   # Features métier
│   ├── auth/                   # Authentification Discord
│   │   ├── auth.api.ts         # Routes API
│   │   ├── auth.feature        # Documentation feature
│   │   ├── auth.profile.tsx    # Profil utilisateur
│   │   ├── auth.signin.tsx     # Connexion
│   │   └── auth.signout.tsx    # Déconnexion
│   ├── events/                 # Gestion des événements
│   ├── ticketing/              # Billeterie publique
│   ├── members/                # Gestion des membres
│   ├── subscriptions/          # Gestion des cotisations
│   ├── collection/             # Gestion de la collection
│   └── live-video/             # Outils pôle Live/Vidéo
├── database/                   # Configuration Drizzle
├── ui/                         # Composants réutilisables
├── utils/                      # Utilitaires
└── types/                      # Types TypeScript globaux
```

### Principes DDD Pragmatique

- **Colocation** : Tests à côté du code
- **Isolation** : Features indépendantes
- **Namespaces** : Préfixes clairs (xxx.store.ts)
- **Scope** : Feature trop grosse = mal découpée
- **Shared** : Ce qui n'est pas dans features est partagé

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

## 🔐 Authentification et Rôles Discord

L'authentification utilise **Auth.js** avec Discord comme provider :

- Configuration dans `src/features/auth/auth.api.ts`
- Variables d'environnement requises dans `.env`
- Hooks et composants dans `src/features/auth/`

### Rôles Discord

Le système utilise les rôles Discord pour gérer les permissions :

- **`@everyone`** : Accès public (billeterie)
- **`Membre`** : Accès espace membre (inscriptions événements)
- **`Bureau`** : Gestion administrative complète
- **`Pôle Live`** : Outils spécialisés Live/Vidéo
- **`Pôle Vidéo`** : Outils spécialisés Vidéo
- **`Admin`** : Accès complet au système

## 📊 Base de données

- **ORM** : Drizzle ORM
- **Base** : MySQL
- **Configuration** : `src/database/`
- **URL** : `DATABASE_URL` dans `.env`

## 🚀 Scripts disponibles

```bash
yarn dev          # Développement
yarn build        # Build de production
yarn start        # Serveur de production
yarn lint         # Linting
yarn test         # Tests
yarn test:ui      # Tests avec UI
yarn test:coverage # Tests avec couverture
yarn db:generate  # Générer migrations
yarn db:migrate   # Appliquer migrations
yarn db:push      # Push schema
yarn db:studio    # Interface Drizzle Studio
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
  - `mini-game.tsx` : Composant principal et initialisation MelonJS
  - `entities/player.ts` : Logique du joueur (mouvement, collisions, animations)
  - `screens/start.ts` : Écran de démarrage et chargement des niveaux
  - `screens/loading.ts` : Écran de chargement personnalisé
  - `ressources.ts` : Liste des ressources à charger (sprites, sons, niveaux)
  - `game-state.ts` : État global du jeu

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

### 🎨 Format des assets

- **Sprites** : Format PNG avec sprite sheet (toutes les frames sur une image)
- **Animations** : Définies dans JSON avec frame tags et durées personnalisées
- **Niveaux** : Format TMX (Tiled Map XML) avec tilesets PNG
- **Sons** : Format MP3/OGG pour compatibilité navigateur

## 🎯 Features à implémenter

### Phase 1 - Base

- ✅ **Auth** : Authentification Discord complète avec rôles
- 🔄 **Events** : Gestion des événements (création, modification, inscriptions)
- 🔄 **Members** : Gestion des membres et profils

### Phase 2 - Fonctionnalités publiques

- ⏳ **Ticketing** : Billeterie publique pour expositions
- ⏳ **Public Events** : Affichage public des événements

### Phase 3 - Gestion administrative

- ⏳ **Subscriptions** : Gestion des cotisations
- ⏳ **Collection** : Gestion de la collection
- ⏳ **Reports** : Tableaux de bord et rapports

### Phase 4 - Outils spécialisés

- ⏳ **Live Video Tools** : Scripts, planning pour pôle Live/Vidéo
- ⏳ **Advanced Features** : Fonctionnalités avancées selon besoins

## 🎯 Architecture du Système MO5

### 🏠 Page d'accueil publique

- **Billeterie** pour les expositions
- **Événements publics** à venir
- **Informations** sur l'association

### 👥 Espace membre

- **Tableau de bord** personnel
- **Inscription aux événements** (système Doodle-like)
- **Historique** des participations
- **Gestion du profil**

### 🏢 Interface administrative

- **Gestion des événements** (création, modification)
- **Gestion des membres** et rôles
- **Gestion des cotisations**
- **Rapports** et statistiques

### 🎬 Outils pôles spécialisés

- **Pôle Live/Vidéo** : Scripts, planning, ressources
- **Autres pôles** : Outils selon besoins spécifiques

## 🔒 Sécurité et Confidentialité

- **Authentification Discord** pour tous les accès
- **Rôles granulaires** selon les responsabilités
- **Chiffrement** des données sensibles
- **Traçabilité** des actions importantes

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-feature`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle feature'`)
4. Push vers la branche (`git push origin feature/nouvelle-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

**MO5** - Espace membre d'association moderne et complet 🏛️
