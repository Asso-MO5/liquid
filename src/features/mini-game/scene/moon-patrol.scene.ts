import type kaplay from "kaplay";
import { createDolorean } from '../entities/dolorean';
import { FONTS, LEVEL_NAMES } from '../mini-game.const';


const GRAVITY = 300;
const GROUND_Y = 100
const SKY_COLOR = [10, 10, 20] // Couleur du ciel (bleu foncé)
const STAR_COUNT = 50 // Nombre d'étoiles
const SCROLL_SPEED = 50 // Vitesse de défilement automatique (pixels par seconde)

// Obstacles
const HOLE_WIDTH = 20 // Largeur des trous
const UFO_SIZE = 16 // Taille des soucoupes
const SMALL_ROCK_SIZE = 8 // Taille des petits rochers
const LARGE_ROCK_SIZE = 16 // Taille des gros rochers
const OBSTACLE_SPAWN_INTERVAL = 200 // Distance entre chaque obstacle (en pixels)
const ALIEN_SHOT_SPEED = 3500 // Vitesse des projectiles des aliens
const ALIEN_SHOOT_INTERVAL = 2 // Intervalle entre les tirs des aliens (en secondes)

export function createMoonPatrolScene(gameInstance: ReturnType<typeof kaplay> | null, { BASE_URL }: { BASE_URL: string }) {
  if (!gameInstance || !BASE_URL) return;

  const { Rect } = gameInstance;

  // Gravité réduite pour simuler la lune (gravité plus faible)
  gameInstance.setGravity(GRAVITY);

  const sprites = [
    'dolorean',
    'rock-mini',
    'rock-large',
    'whole',
    'ufo'
  ]

  for (const sprite of sprites) {
    gameInstance.loadAseprite(sprite, `${BASE_URL}/entities/${sprite}.png`, `${BASE_URL}/entities/${sprite}.json`);
  }

  const sounds = [
    'collided',
    'shoot',
    'heat',
    'rock-hit',
    'alien-hit',
  ]


  gameInstance.loadSound("escape", `${BASE_URL}/sounds/escape.mp3`);

  if (!import.meta.env.DEV) {
    //@ts-expect-error - musicSound is not defined in the type
    if (gameInstance!.musicSound) {
      //@ts-expect-error - musicSound is not defined in the type
      gameInstance!.musicSound.paused = true
    }
    //@ts-expect-error - musicSound is not defined in the type
    gameInstance!.musicSound = gameInstance.play("escape", { loop: true, volume: 0.3 });
  }


  for (const sound of sounds) {
    gameInstance.loadSound(sound, `${BASE_URL}/sounds/${sound}.ogg`);
  }


  const levelWidth = gameInstance.width() || 300;
  const levelHeight = gameInstance.height() || 200;

  // Fond du ciel
  gameInstance!.add([
    gameInstance!.rect(levelWidth * 2, levelHeight),
    gameInstance!.pos(0, 0),
    gameInstance!.color(SKY_COLOR[0], SKY_COLOR[1], SKY_COLOR[2]),
    gameInstance!.z(-200),
    gameInstance!.fixed(),
  ])


  // sol
  gameInstance!.add([
    gameInstance!.rect(levelWidth * 10, 100),
    gameInstance!.pos(0, GROUND_Y - 0),
    gameInstance!.color(60, 60, 60),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.opacity(1),
    'platform',
    'ground',
  ])

  // Ciel étoilé
  const stars: Array<{ x: number; y: number; size: number; brightness: number; twinkleSpeed: number }> = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * levelWidth * 2,
      y: Math.random() * (GROUND_Y - 20),
      size: Math.random() * 1.5 + 0.5,
      brightness: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    });
  }

  // Créer les étoiles
  stars.forEach((star) => {
    const starObj = gameInstance!.add([
      gameInstance!.rect(star.size, star.size),
      gameInstance!.pos(star.x, star.y),
      gameInstance!.color(255, 255, 255),
      gameInstance!.z(-199),
      gameInstance!.fixed(),
      'star',
    ]);

    let twinklePhase = 0;
    starObj.onUpdate(() => {
      twinklePhase += star.twinkleSpeed;
      const brightness = Math.sin(twinklePhase) * 0.5 + 0.5; // Oscille entre 0.5 et 1
      const brightValue = Math.round(255 * brightness);
      starObj.color = gameInstance!.rgb(brightValue, brightValue, brightValue);
    });
  });

  // Sol statique (plus large pour le défilement)
  gameInstance!.add([
    gameInstance!.rect(levelWidth * 10, 1),
    gameInstance!.pos(0, GROUND_Y),
    gameInstance!.area(),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.offscreen({ hide: true }),
    gameInstance!.opacity(0),
    'platform',
    'ground',
  ])

  // Système de santé/dégâts
  let health = 100; // Santé maximale
  const HOLE_DAMAGE = 10; // Dégâts infligés par les trous
  let lastHoleDamageTime = 0;
  const HOLE_DAMAGE_COOLDOWN = 0.5; // Cooldown de 0.5 seconde entre les dégâts

  // Système de score (distance parcourue en km)
  let distanceTraveled = 0;
  const PIXELS_PER_M = 5;
  const DIFFICULTY_INTERVAL = 400; // Augmenter la difficulté tous les 400m
  const PIXELS_PER_400M = DIFFICULTY_INTERVAL * PIXELS_PER_M; // 2000 pixels = 400m

  // Fonction pour calculer le niveau de difficulté basé sur la distance
  const getDifficultyLevel = (distance: number): number => {
    return Math.floor(distance / PIXELS_PER_400M);
  };

  // Fonction pour calculer les probabilités d'obstacles selon la difficulté
  const getObstacleProbabilities = (difficultyLevel: number) => {
    // Probabilités de base
    let holeChance = 0.35;
    let rockChance = 0.30; // 0.65 - 0.35
    let ufoChance = 0.20; // 0.85 - 0.65
    let nothingChance = 0.15; // 1.0 - 0.85

    // Augmenter les chances d'obstacles tous les 400m
    // Réduire la chance de "rien" progressivement
    const difficultyBonus = difficultyLevel * 0.05; // +5% par niveau de difficulté
    const maxBonus = 0.30; // Maximum 30% de bonus (pour éviter 100% d'obstacles)

    const actualBonus = Math.min(difficultyBonus, maxBonus);

    // Répartir le bonus entre les obstacles
    holeChance += actualBonus * 0.4; // 40% du bonus pour les trous
    rockChance += actualBonus * 0.35; // 35% du bonus pour les rochers
    ufoChance += actualBonus * 0.25; // 25% du bonus pour les UFO

    // Réduire la chance de "rien"
    nothingChance = Math.max(0.05, nothingChance - actualBonus); // Minimum 5% de chance de rien

    return {
      hole: holeChance,
      rock: rockChance,
      ufo: ufoChance,
      nothing: nothingChance,
    };
  };

  // Charger la police si nécessaire
  gameInstance.loadFont(FONTS.SILKSCREEN, `${BASE_URL}/fonts/Silkscreen/Silkscreen-Regular.ttf`);

  // Jauge de santé (barre de vie)
  gameInstance!.add([
    gameInstance!.rect(104, 9),
    gameInstance!.pos(2, 2),
    gameInstance!.color(50, 50, 50),
    gameInstance!.z(100),
    gameInstance!.fixed(),
    gameInstance!.scale(0.5),
    'health-bar-bg',
  ]);

  const healthBar = gameInstance!.add([
    gameInstance!.rect(100, 5),
    gameInstance!.pos(3, 3),
    gameInstance!.color(0, 255, 0),
    gameInstance!.z(101),
    gameInstance!.fixed(),
    gameInstance!.scale(0.5),
    'health-bar',
  ]);

  // Jauge de chaleur (surchauffe)
  gameInstance!.add([
    gameInstance!.rect(104, 6),
    gameInstance!.pos(2, 8),
    gameInstance!.color(50, 50, 50),
    gameInstance!.z(100),
    gameInstance!.fixed(),
    gameInstance!.scale(0.5),
    'heat-bar-bg',
  ]);

  const heatBar = gameInstance!.add([
    gameInstance!.rect(100, 2),
    gameInstance!.pos(3, 9),
    gameInstance!.color(255, 100, 0), // Orange pour la chaleur
    gameInstance!.z(101),
    gameInstance!.fixed(),
    gameInstance!.scale(0.5),
    'heat-bar',
  ]);


  // credit music
  gameInstance!.add([
    gameInstance!.text('music by: JustFreeGames', {
      size: 4,
      font: FONTS.SILKSCREEN,
    }),
    gameInstance!.pos(5, gameInstance!.height() - 30),
    gameInstance!.color(100, 100, 100),
    gameInstance!.z(100),
    gameInstance!.fixed(),
    'score',
  ]);

  // Affichage du score (distance parcourue)
  const scoreText = gameInstance!.add([
    gameInstance!.text('0 KM', {
      size: 5,
      font: FONTS.SILKSCREEN,
    }),
    gameInstance!.pos(55, 2),
    gameInstance!.color(255, 255, 255),
    gameInstance!.z(100),
    gameInstance!.fixed(),
    'score',
  ]);

  const updateHealthBar = () => {
    const healthPercent = Math.max(0, Math.min(100, health));
    healthBar.width = healthPercent;

    // Changer la couleur selon la santé
    if (healthPercent > 60) {
      healthBar.color = gameInstance!.rgb(0, 255, 0); // Vert
    } else if (healthPercent > 30) {
      healthBar.color = gameInstance!.rgb(255, 255, 0); // Jaune
    } else {
      healthBar.color = gameInstance!.rgb(255, 0, 0); // Rouge
    }
  };

  // Créer la voiture après avoir défini updateHealthBar
  const dolorean = createDolorean(gameInstance, {
    position: { x: levelWidth / 2, y: 100 }, // Centrer la voiture
    onTakeDamage: (damage: number) => {
      health -= damage;
      health = Math.max(0, health);
      updateHealthBar();

      if (health <= 0) {
        // Aller à la scène Game Over avec le score
        gameInstance.go(LEVEL_NAMES.GAME_OVER, { score: distanceTraveled });
      }
    },
  })

  if (!dolorean) return;

  const updateHeatBar = () => {
    if (!dolorean) return;
    type DoloreanWithHeat = typeof dolorean & { getHeat: () => number; getMaxHeat: () => number };
    const doloreanWithHeat = dolorean as DoloreanWithHeat;

    if (typeof doloreanWithHeat.getHeat === 'function' && typeof doloreanWithHeat.getMaxHeat === 'function') {
      const currentHeat = doloreanWithHeat.getHeat();
      const maxHeat = doloreanWithHeat.getMaxHeat();
      const heatPercent = Math.max(0, Math.min(100, (currentHeat / maxHeat) * 100));

      heatBar.width = heatPercent;

      // Changer la couleur selon la chaleur
      if (heatPercent >= 100) {
        heatBar.color = gameInstance!.rgb(255, 0, 0); // Rouge quand surchauffé
      } else if (heatPercent > 70) {
        heatBar.color = gameInstance!.rgb(255, 100, 0); // Orange foncé
      } else if (heatPercent > 40) {
        heatBar.color = gameInstance!.rgb(255, 150, 0); // Orange
      } else {
        heatBar.color = gameInstance!.rgb(255, 200, 0); // Jaune-orange
      }
    }
  };

  // Collision entre projectiles et obstacles destructibles
  gameInstance.onUpdate(() => {
    const projectiles = gameInstance.get('projectile') as unknown as Array<{ pos: { x: number; y: number }; destroy: () => void; exists: () => boolean }>;
    const rocks = gameInstance.get('rock') as unknown as Array<{ pos: { x: number; y: number }; destroy: () => void; exists: () => boolean; play: (anim: string, options?: { loop: boolean; onEnd: () => void }) => void; isDestroyed: boolean }>;
    const aliens = gameInstance.get('alien') as unknown as Array<{ pos: { x: number; y: number }; play: (anim: string, options?: { loop: boolean; onEnd: () => void }) => void; destroy: () => void; exists: () => boolean; isDie: boolean }>;

    // Vérifier les collisions projectiles <-> rochers
    projectiles.forEach((projectile) => {
      if (!projectile.exists || !projectile.exists()) return;

      rocks.forEach((rock) => {
        if (!rock.exists || !rock.exists() || rock.isDestroyed) return;

        const dx = Math.abs(projectile.pos.x - rock.pos.x);
        const dy = Math.abs(projectile.pos.y - rock.pos.y);
        const hitDistance = 10; // Distance de collision

        if (dx < hitDistance && dy < hitDistance) {
          projectile.destroy();

          try {
            gameInstance.play('rock-hit');
          } catch (e) {
            // Son non disponible
          }

          type RockWithHealth = typeof rock & { health: number; maxHealth: number; color: { r: number; g: number; b: number } };
          const rockWithHealth = rock as RockWithHealth;

          const rockHealth = rockWithHealth.health;
          rockWithHealth.health -= 0.50;

          console.log(rockHealth);
          if (!rock.isDestroyed) {
            if (rockHealth > 1.5 && rockHealth > 1) {
              rock?.play('75')
            } else if (rockHealth <= 1 && rockHealth > 0.5) {
              rock?.play('50')
            } else if (rockHealth <= 0.5 && rockHealth > 0) {
              rock?.play('25')
            }
          }

          if (rockHealth <= 0.25 && !rock.isDestroyed) {
            rock.isDestroyed = true;
            rockWithHealth.health = 0;

            const index = obstacles.findIndex(o => o.obj === rock);
            if (index !== -1) {
              obstacles.splice(index, 1);
            }

            rock?.play?.('destroy', {
              loop: false,
              onEnd: () => {
                rock?.destroy?.();
              },
            });
          }
        }
      });
    });

    // Vérifier les collisions projectiles <-> aliens
    projectiles.forEach((projectile) => {
      if (!projectile.exists || !projectile.exists()) return;

      aliens.forEach((alien) => {
        if (!alien.exists || !alien.exists() || alien.isDie) return;

        const dx = Math.abs(projectile.pos.x - alien.pos.x);
        const dy = Math.abs(projectile.pos.y - alien.pos.y);
        const hitDistance = 10; // Distance de collision

        if (dx < hitDistance && dy < hitDistance) {
          projectile.destroy();



          // Retirer de la liste des obstacles
          const index = obstacles.findIndex(o => o.obj === alien);
          if (index !== -1) {
            obstacles.splice(index, 1);
          }

          alien.isDie = true;
          gameInstance.play('alien-hit');

          alien.play('die', {
            loop: false,
            onEnd: () => {
              alien.destroy();
            },
          });
        }
      });
    });
  });

  // Système de génération d'obstacles
  let lastObstacleX = levelWidth * 2; // Position X du dernier obstacle créé
  const obstacles: Array<{ obj: { pos: { x: number }; exists: () => boolean; destroy: () => void }; type: string }> = [];

  const createHole = (x: number) => {

    const hole = gameInstance!.add([
      gameInstance!.sprite('whole'),
      gameInstance!.pos(x, GROUND_Y),
      gameInstance!.color(SKY_COLOR[0], SKY_COLOR[1], SKY_COLOR[2]),
      gameInstance!.z(10),
      gameInstance!.fixed(),
      gameInstance!.anchor('top'),
      'obstacle',
      'hole',
    ]);
    obstacles.push({ obj: hole, type: 'hole' });

    // De 1 à 4
    hole.play(`${Math.floor(Math.random() * 4) + 1}`);

    // Collision ZONE
    const holeTrigger = gameInstance!.add([
      gameInstance!.rect(HOLE_WIDTH, 1),
      gameInstance!.pos(x - HOLE_WIDTH / 2, GROUND_Y - 1),
      gameInstance!.area(),
      gameInstance!.opacity(0),
      gameInstance!.z(10),
      gameInstance!.fixed(),
      'hole-trigger',
    ]);
    obstacles.push({ obj: holeTrigger, type: 'hole-trigger' });
  };

  const createRock = (x: number, isLarge: boolean) => {
    const size = isLarge ? LARGE_ROCK_SIZE : SMALL_ROCK_SIZE;
    const rock = gameInstance!.add([
      gameInstance!.sprite(isLarge ? 'rock-large' : 'rock-mini'),
      gameInstance!.pos(x, GROUND_Y - (isLarge ? size - 16 : 0)),
      gameInstance!.area({
        shape: new Rect(gameInstance!.vec2(0), size, size),
      }),
      gameInstance!.z(10),
      gameInstance!.anchor('bot'),
      gameInstance!.fixed(),
      'obstacle',
      'rock',
      isLarge ? 'large-rock' : 'small-rock',
    ]);

    // Système de résistance pour les gros rochers
    type RockWithHealth = typeof rock & { health: number; maxHealth: number; color: (r: number, g: number, b: number) => void };
    if (isLarge) {
      (rock as RockWithHealth).health = 2; // Les gros rochers nécessitent 2 tirs
      (rock as RockWithHealth).maxHealth = 2;
    } else {
      (rock as RockWithHealth).health = 1; // Les petits rochers sont détruits en 1 tir
      (rock as RockWithHealth).maxHealth = 1;
    }

    obstacles.push({ obj: rock, type: 'rock' });
  };

  const createUFO = (x: number, y: number) => {
    // Soucoupe volante dans le ciel
    const ufo = gameInstance!.add([
      gameInstance!.sprite('ufo'),
      gameInstance!.pos(x, y),
      gameInstance!.area(),
      gameInstance!.z(-10),
      gameInstance!.fixed(),
      'obstacle',
      'ufo',
      'alien',
    ]);

    ufo.play('idle', { loop: true });
    obstacles.push({ obj: ufo, type: 'ufo' });

    // Mouvement des aliens (mouvement sinusoïdal vertical)
    let movementPhase = Math.random() * Math.PI * 2; // Phase aléatoire pour varier le mouvement
    const movementSpeed = 0.02 + Math.random() * 0.02; // Vitesse de mouvement variable
    const movementAmplitude = 15; // Amplitude du mouvement vertical
    let lastShotTime = 0;
    const shootDelay = ALIEN_SHOOT_INTERVAL + Math.random() * 1; // Délai variable entre les tirs

    // Fonction pour créer un projectile alien
    const createAlienProjectile = (startX: number, startY: number) => {
      const alienProjectile = gameInstance!.add([
        gameInstance!.rect(2, 4),
        gameInstance!.pos(startX, startY),
        gameInstance!.area(),
        gameInstance!.color(255, 0, 0), // Rouge pour les projectiles aliens
        gameInstance!.z(5),
        'alien-projectile',
      ]);

      alienProjectile.onUpdate(() => {

        const dt = gameInstance!.dt();
        alienProjectile.move(0, ALIEN_SHOT_SPEED * dt);

        // Détruire si hors écran
        if (alienProjectile.pos.y > levelHeight + 50 || alienProjectile.pos.y > GROUND_Y) {
          alienProjectile.destroy();
        }
      });

      // Détruire après un certain temps
      setTimeout(() => {
        if (alienProjectile.exists()) {
          alienProjectile.destroy();
        }
      }, 5000);
    };

    ufo.onUpdate(() => {
      const currentTime = gameInstance!.time();

      // Mouvement sinusoïdal
      movementPhase += movementSpeed;
      const offsetY = Math.sin(movementPhase) * movementAmplitude;
      ufo.pos.y = y + offsetY;

      // Tirer vers le bas
      if (currentTime - lastShotTime > shootDelay) {
        lastShotTime = currentTime;
        createAlienProjectile(ufo.pos.x + UFO_SIZE / 2, ufo.pos.y + UFO_SIZE / 2);
      }
    });
  };

  // Générer les obstacles initiaux
  for (let i = 0; i < 20; i++) {
    const x = levelWidth + i * OBSTACLE_SPAWN_INTERVAL;
    const distanceAtX = x - levelWidth; // Distance approximative pour cette position
    const difficultyLevel = getDifficultyLevel(distanceAtX);
    const probs = getObstacleProbabilities(difficultyLevel);
    const rand = Math.random();

    if (rand < probs.hole) {
      createHole(x);
    } else if (rand < probs.hole + probs.rock) {
      createRock(x, Math.random() > 0.5);
    } else if (rand < probs.hole + probs.rock + probs.ufo) {
      const ufoHeight = Math.random() * 35;
      const ufoY = ufoHeight;
      createUFO(x, ufoY);
    }
    // Sinon : rien (probs.nothing)
  }



  // Système de défilement automatique continu
  gameInstance.onUpdate(() => {
    const dt = gameInstance.dt();

    // Mettre à jour le score (distance parcourue)
    distanceTraveled += SCROLL_SPEED * dt;
    const kmTraveled = Math.floor(distanceTraveled / PIXELS_PER_M);
    if (scoreText.exists()) {
      scoreText.text = `${kmTraveled}M`;
    }

    // Mettre à jour la jauge de chaleur
    updateHeatBar();

    // Vérifier les collisions avec les trous et rochers pour les dégâts
    if (dolorean) {
      const currentTime = gameInstance.time();

      // Vérifier les collisions entre projectiles aliens et la voiture
      const alienProjectiles = gameInstance.get('alien-projectile') as unknown as Array<{ pos: { x: number; y: number }; destroy: () => void; exists: () => boolean }>;
      alienProjectiles.forEach((projectile) => {
        if (!projectile.exists || !projectile.exists()) return;

        const dx = Math.abs(dolorean.pos.x - projectile.pos.x);
        const dy = Math.abs(dolorean.pos.y - projectile.pos.y);
        const hitDistance = 15; // Distance de collision

        if (dx < hitDistance && dy < hitDistance) {
          projectile.destroy();

          // Jouer l'animation de collision
          type DoloreanWithCollision = typeof dolorean & { playCollided: () => void };
          const doloreanWithCollision = dolorean as DoloreanWithCollision;
          if (typeof doloreanWithCollision.playCollided === 'function') {
            doloreanWithCollision.playCollided();
          }

          // Infliger des dégâts à la voiture (projectiles ennemis)
          health -= 5; // Dégâts des projectiles ennemis
          health = Math.max(0, health);
          updateHealthBar();

          if (health <= 0) {
            // Aller à la scène Game Over avec le score
            gameInstance.go(LEVEL_NAMES.GAME_OVER, { score: distanceTraveled });
          }
        }
      });

      const holes = gameInstance.get('hole-trigger') as unknown as Array<{ pos: { x: number } }>;

      holes.forEach((hole) => {
        const dx = Math.abs(dolorean.pos.x - hole.pos.x);
        if (dx < 15 && dolorean.isGrounded() && currentTime - lastHoleDamageTime > HOLE_DAMAGE_COOLDOWN) {
          lastHoleDamageTime = currentTime;

          // Jouer l'animation de collision
          type DoloreanWithCollision = typeof dolorean & { playCollided: () => void };
          const doloreanWithCollision = dolorean as DoloreanWithCollision;
          if (typeof doloreanWithCollision.playCollided === 'function') {
            doloreanWithCollision.playCollided();
          }

          health -= HOLE_DAMAGE;
          health = Math.max(0, health);
          updateHealthBar();

          if (health <= 0) {
            // Aller à la scène Game Over avec le score
            gameInstance.go(LEVEL_NAMES.GAME_OVER, { score: distanceTraveled });
          }
        }
      });

      // Les collisions avec les rochers sont maintenant gérées dans dolorean.ts
    }

    // Déplacer les montagnes avec effet de parallaxe et défilement automatique
    const mountains = gameInstance.get('mountain') as unknown as Array<{ pos: { x: number }; tags: string[] }>;
    mountains.forEach((mountain) => {
      const parallaxSpeed = mountain.tags.includes('parallax-0.2') ? 0.2 :
        mountain.tags.includes('parallax-0.4') ? 0.4 :
          mountain.tags.includes('parallax-0.6') ? 0.6 : 0;

      // Défilement automatique avec effet de parallaxe
      mountain.pos.x -= SCROLL_SPEED * dt * parallaxSpeed;

      // Réinitialiser la position si la montagne sort de l'écran à gauche
      if (mountain.pos.x < -300) {
        mountain.pos.x = levelWidth * 3;
      }
    });

    // Déplacer les étoiles avec défilement automatique (très lentement)
    const stars = gameInstance.get('star') as unknown as Array<{ pos: { x: number } }>;
    stars.forEach((star) => {
      star.pos.x -= SCROLL_SPEED * dt * 0.1;
      // Réinitialiser si l'étoile sort de l'écran
      if (star.pos.x < -10) {
        star.pos.x = levelWidth * 2 + 10;
      }
    });

    // Déplacer les obstacles
    obstacles.forEach((obstacle, index) => {
      if (!obstacle.obj.exists()) {
        obstacles.splice(index, 1);
        return;
      }

      obstacle.obj.pos.x -= SCROLL_SPEED * dt;

      // Supprimer les obstacles qui sortent de l'écran à gauche
      if (obstacle.obj.pos.x < -100) {
        obstacle.obj.destroy();
        obstacles.splice(index, 1);
      }
    });

    // Générer de nouveaux obstacles avec difficulté progressive
    if (lastObstacleX <= levelWidth * 2) {
      // Calculer la difficulté basée sur la distance parcourue
      const difficultyLevel = getDifficultyLevel(distanceTraveled);
      const probs = getObstacleProbabilities(difficultyLevel);
      const rand = Math.random();

      if (rand < probs.hole) {
        createHole(levelWidth * 2);
      } else if (rand < probs.hole + probs.rock) {
        createRock(levelWidth * 2, Math.random() > 0.5);
      } else if (rand < probs.hole + probs.rock + probs.ufo) {
        const ufoHeight = Math.random() * 35;
        const ufoY = ufoHeight;
        createUFO(levelWidth * 2, ufoY);
      }
      // Sinon : rien (probs.nothing)

      lastObstacleX = levelWidth * 2 + OBSTACLE_SPAWN_INTERVAL;
    } else {
      lastObstacleX -= SCROLL_SPEED * dt;
    }
  });



  return dolorean;

}