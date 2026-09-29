# Liquid — Front du musée MO5

Application SolidStart v2 exécutée avec Bun. Frontend du musée MO5 : elle
consomme l'[API Ocelot](https://htboard.xyz/) (backend Fastify) et s'authentifie
avec Zitadel.

## Prérequis

- Bun 1.3.14 ou plus récent ;
- l'API Ocelot accessible (variable `OCELOT_API_URL`) ;
- Chromium ou le navigateur Playwright pour la suite navigateur.

## Démarrage

```bash
cp env.example .env
bun install
bun run dev
```

Aucune variable d'environnement n'est importée côté client. En production,
définir les valeurs de `env.example` dans les variables d'environnement de
l'application ; ne jamais créer ni copier de fichier `.env` dans l'image.

## Commandes de vérification

```bash
bun run check:types
bun run lint
bun run test
bun run test:browser
bun run build
```

`test:browser` exécute la build de production, le scénario d'intégration, le
contrôle d'accessibilité Axe et le budget de navigation. En CI, installer le
navigateur Playwright avec `bunx playwright install --with-deps chromium`.
Pour utiliser un Chromium déjà installé, définir
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Structure

Le code est découpé par feature métier, avec des namespaces de fichiers
(`feature.type.ts`, `feature.view.tsx`, `feature.spec.ts`…) :

```
src/
├── features/        # Features métier (layout, auth, scan, presences…)
├── routes/          # Routes fichiers SolidStart
├── ui/              # Composants d'interface partagés
├── server/          # Côté serveur : client API Ocelot
├── platform/        # Infrastructure : environnement, logs
└── shared/          # Transversal : sécurité
```

Chaque feature est documentée par un one-pager `feature.feature` dans son
dossier, et décrite par des tickets sur [HTB](https://htboard.xyz/)
(projet `MO5/LIQUID`).

## Design

- CSS natif sans framework : tokens dans `src/app.css`, styles par feature en
  CSS modules ;
- mobile-first, dark mode par défaut (adaptation claire via
  `prefers-color-scheme`) ;
- sobre : pas de gradient, pas de bordure superflue, pas de texte inutile ;
- accessible : HTML sémantique, navigation clavier, contrastes WCAG AA.

## Déploiement CapRover

`captain-definition` référence le [Dockerfile](./Dockerfile). L'image
multi-stage construit et exécute la sortie Nitro avec Bun, sur le port interne
`3000`, sous l'utilisateur non privilégié `bun`. Configurer `containerHttpPort`
à `3000` dans CapRover et fournir les secrets exclusivement via les variables
d'environnement CapRover.

## Suivi

Les user stories et les tâches techniques sont suivies dans HTB, projet
`MO5/LIQUID` : `htb ticket list`.
