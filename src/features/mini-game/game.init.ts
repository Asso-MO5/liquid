import kaplay from "kaplay";
import { gameState } from './game-state';

let gameInstance: ReturnType<typeof kaplay> | null = null;

export const cleanupGame = () => {
  if (gameInstance) {
    try {
      // Kaplay se nettoie automatiquement en supprimant le canvas
      const containerRef = document.getElementById('mini-game-container') as HTMLDivElement | null;
      if (containerRef) {
        containerRef.innerHTML = '';
      }
      gameInstance = null;
    } catch (error) {
      console.error('Erreur lors du nettoyage de kaplay:', error);
    }
  }
};

export const initGame = () => {
  // Si le jeu est déjà initialisé, retourner l'instance
  if (gameInstance) {
    return gameInstance;
  }

  const containerRef = document.getElementById('mini-game-container') as HTMLDivElement | null;
  if (!containerRef) {
    console.error('Container mini-game-container non trouvé');
    return null;
  }

  const containerWidth = containerRef.clientWidth || 800;
  const containerHeight = containerRef.clientHeight || 600;

  const pixelHeight = Math.round(containerHeight / (32 * 6));
  // Initialiser kaplay - il créera son propre canvas
  gameInstance = kaplay({
    width: Math.floor(containerWidth / pixelHeight),
    height: Math.floor(containerHeight / pixelHeight),
    root: containerRef,
    scale: pixelHeight,
    background: [109, 135, 183],
    touchToMouse: true,
    crisp: true,
    pixelDensity: 1,
  });

  // Appliquer des styles CSS pour un rendu pixel perfect et permettre le scroll
  const canvas = containerRef.querySelector('canvas');
  if (canvas) {
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';
    // Permettre le scroll sur le canvas (mobile)
    canvas.style.touchAction = 'pan-y';
    canvas.style.pointerEvents = 'auto';

    // Permettre le scroll avec la molette (desktop)
    canvas.addEventListener('wheel', (e) => {
      //FOR WINDOW SCROLL
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        window.scrollBy({
          top: e.deltaY,

        });
        return;
      }
    }, { passive: true });
  }

  // Charger les ressources de manière asynchrone
  const baseUrl = `${window.location.protocol}//${window.location.host}/`;

  // Charger le sprite avec les frames (13 frames de 32x32 en ligne)
  // L'image fait 416x32, donc 13 frames de 32x32
  gameInstance.loadAseprite("lulu", `${baseUrl}game/entities/lulu.png`, `${baseUrl}game/entities/lulu.json`);

  // Charger le tileset start.png (8x8 pixels par tile, 16 colonnes)
  // sliceX et sliceY indiquent la taille de chaque tile (8x8)
  // Kaplay découpe automatiquement l'image en grille de 8x8
  gameInstance.loadSprite('tileset', `${baseUrl}game/tiles/start.png`, {
    sliceX: 8,  // Largeur de chaque tile
    sliceY: 8,  // Hauteur de chaque tile
  });

  // Charger l'image de fond
  gameInstance.loadSprite('background', `${baseUrl}game/tiles/test.png`);


  // Charger les sons (optionnel, ignorer les erreurs)
  gameInstance.loadSound('jump', `${baseUrl}game/sounds/jump.mp3`).catch(() => {
    console.debug('Son jump non disponible');
  });
  gameInstance.loadSound('spike', `${baseUrl}game/sounds/spike.mp3`).catch(() => {
    console.debug('Son spike non disponible');
  });

  // Créer la scène de démarrage
  gameInstance.scene('start', () => {
    gameState.level = 1;
    gameState.isGameStarted = true;

    // Créer le fond qui bouge avec la caméra (sans fixed())
    gameInstance!.add([
      gameInstance!.sprite('background'),
      gameInstance!.pos(0, -100),
      gameInstance!.anchor('topleft'),
      gameInstance!.z(-100), // Mettre le fond en arrière-plan
    ]);


    // Créer un sol statique pour empêcher le personnage de tomber à l'infini
    gameInstance!.add([
      gameInstance!.rect(168, 1),
      gameInstance!.pos(0, 156),
      gameInstance!.area(),
      gameInstance!.body({ isStatic: true }), // Le sol doit être statique
      gameInstance!.opacity(0), // Rendre le sol invisible
      'platform', // Tag pour les collisions
      'ground',
    ]);

    // Dimensions du niveau (ajustez selon la taille réelle de votre image de fond)
    // Vous pouvez les définir manuellement selon les dimensions de test.png
    const levelWidth = 2000; // Ajustez selon la largeur réelle de votre fond
    const levelHeight = 2000; // Ajustez selon la hauteur réelle de votre fond

    // Ajuster la taille du fond pour qu'il remplisse tout l'écran



    // Créer le joueur avec physique
    // Arrondir la position pour un rendu pixel perfect
    const player = gameInstance!.add([
      gameInstance!.sprite('lulu', {
        anim: 'stand',
      }),
      gameInstance!.pos(Math.round(30), Math.round(140)), // Positionner le joueur au début du niveau
      gameInstance!.body({
        jumpForce: 100,
      }),
      gameInstance!.area(),
      gameInstance!.anchor('bot'),
      'player',
    ]);

    // Variables d'état du joueur
    let canJump = true; // Empêcher les sauts multiples
    let moveLeft = false;
    let moveRight = false;



    // Contrôles du joueur - mouvement avec flags au lieu de modifier directement la vélocité
    gameInstance!.onKeyDown(['left', 'a', 'q'], () => {
      moveLeft = true;
      player.flipX = true;
    });

    gameInstance!.onKeyDown(['right', 'd'], () => {
      moveRight = true;
      player.flipX = false;
    });

    // Arrêter le mouvement quand on relâche les touches
    gameInstance!.onKeyRelease(['left', 'a', 'q'], () => {
      moveLeft = false;
    });

    gameInstance!.onKeyRelease(['right', 'd'], () => {
      moveRight = false;
    });

    // L'animation est gérée dans player.onUpdate(), pas besoin de onKeyPress ici

    // L'animation est gérée dans player.onUpdate(), pas besoin de onKeyRelease ici

    // Utiliser isGrounded() de kaplay qui est plus fiable
    // et ajouter une protection contre les sauts multiples
    gameInstance!.onKeyPress(['space', 'up', 'w', 'z', 'x'], () => {
      // Vérifier si le joueur peut sauter
      if (player.isGrounded() && canJump) {
        canJump = false; // Empêcher les sauts multiples
        player.jump(400); // Appeler jump() pour faire sauter le joueur
        try {
          gameInstance!.play('jump');
        } catch (e) {
          // Ignorer si le son n'est pas chargé
        }
        // Utiliser 'grounded' au lieu de 'jump' car l'animation jump n'existe pas
        try {
          player.play('grounded');
        } catch (e) {
          // Ignorer si l'animation n'est pas disponible
        }
      }
    });

    gameInstance!.setGravity(2400);

    // Mettre à jour les animations selon l'état et suivre avec la caméra (pixel perfect)
    player.onUpdate(() => {
      // Réinitialiser canJump quand le joueur touche le sol
      if (player.isGrounded()) {
        canJump = true;
      }

      // Gérer le mouvement horizontal dans onUpdate pour éviter les conflits avec la physique
      if (moveLeft) {
        if (player.isGrounded()) {
          player.vel.x = -150;
        } else {
          // En l'air, mouvement réduit
          player.vel.x = -100;
        }
      } else if (moveRight) {
        if (player.isGrounded()) {
          player.vel.x = 150;
        } else {
          // En l'air, mouvement réduit
          player.vel.x = 100;
        }
      } else {
        // Arrêter le mouvement horizontal si aucune touche n'est pressée
        player.vel.x = 0;
      }

      // Gérer les animations (stand, walk, grounded disponibles)
      try {
        // Vérifier si le joueur est vraiment en mouvement horizontal
        const isActuallyMoving = Math.abs(player.vel.x) > 10;

        // Déterminer quelle animation devrait être jouée
        let targetAnim: string | null = null;

        if (!player.isGrounded() && player.vel.y !== 0) {
          // En l'air, utiliser 'grounded' comme animation de saut
          targetAnim = 'grounded';
        } else if (player.isGrounded() && !isActuallyMoving) {
          // Au sol et pas de mouvement horizontal = stand
          targetAnim = 'stand';
        } else if (player.isGrounded() && isActuallyMoving) {
          // Au sol et mouvement horizontal = walk
          targetAnim = 'walk';
        }

        // Ne changer l'animation que si elle est différente de l'animation actuelle
        if (targetAnim && player.curAnim() !== targetAnim) {
          player.play(targetAnim);
        }
      } catch (e) {
        // Ignorer les erreurs d'animation
      }

      // Suivre le joueur avec la caméra (arrondir pour pixel perfect)
      // Limiter la caméra pour ne pas montrer de vide aux bords
      const gameWidth = gameInstance!.width?.() || 0;
      const gameHeight = gameInstance!.height?.() || 0;

      // Calculer la position de la caméra centrée sur le joueur
      let camX = Math.round(player.pos.x);
      let camY = Math.round(player.pos.y - gameHeight / 4);

      const minCamX = 0;
      // gameWidth est déjà en pixels de jeu, pas besoin de multiplier par pixelHeight
      const maxCamX = Math.max(0, levelWidth - gameWidth);
      const minCamY = -100; // Correspond au pos.y du fond
      const maxCamY = Math.max(-100, levelHeight - gameHeight - 120);

      camX = Math.max(minCamX, Math.min(camX, maxCamX));
      camX += 30;

      if (camX < 120) {
        camX = 120;
      }

      camY = Math.max(minCamY, Math.min(camY, maxCamY));

      gameInstance!.setCamPos(camX, camY);
    });
  });

  // Démarrer la scène
  gameInstance.go('start');

  return gameInstance;
};
