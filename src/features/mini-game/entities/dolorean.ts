import type kaplay from "kaplay";
import { CONTROLS } from '../mini-game.const';

const JUMP_FORCE = 100; // Force de saut réduite pour un saut moins haut
const HORIZONTAL_SHOT_SPEED = 5000; // Vitesse des projectiles horizontaux augmentée
const VERTICAL_SHOT_SPEED = 5000; // Vitesse des projectiles verticaux augmentée
const HORIZONTAL_SHOT_RANGE = 50; // Portée limitée pour le tir horizontal
const MOVE_SPEED = 3500; // Vitesse de déplacement horizontal augmentée

const MAX_HEAT = 100;
const HEAT_PER_SHOT = 8; // Chaleur générée par tir (augmenté pour atteindre la surchauffe facilement)
const HEAT_COOLDOWN_RATE = 15; // Taux de refroidissement par seconde (très réduit pour permettre la surchauffe)
const OVERHEAT_COOLDOWN_RATE = 100; // Taux de refroidissement quand surchauffé (plus lent)
const COOLDOWN_DELAY_AFTER_SHOT = 0.3; // Délai avant que le refroidissement ne reprenne après un tir (en secondes)
const OVERHEAT_DURATION = 3.0; // Durée minimale de la surchauffe avant de pouvoir refroidir (en secondes)

export function createDolorean(
  gameInstance: ReturnType<typeof kaplay>,
  { position, onTakeDamage }: { position: { x: number, y: number }; onTakeDamage?: (damage: number) => void }
) {
  if (!gameInstance) return;

  const { Rect } = gameInstance;

  const ANIMS = {
    IDLE: 'drive',
    IDLE_BACK: 'drive-back',
    IDLE_FORWARD: 'drive-forward',
    JUMPING: 'jumping',
    JUMP: 'jump',
    GROUNDED: 'grounded',
    COLLIDED: 'collided',
  }

  let moveLeft = false;
  let isMovingBack = false;
  let isMovingForward = false;
  let moveRight = false;
  let canJump = true;
  let isJumping = false;
  let heat = 0; // Niveau de chaleur (0-100)
  let lastShotTime = 0; // Temps du dernier tir
  let overheatStartTime = 0; // Temps où la surchauffe a commencé
  let isOverheated = false; // État de surchauffe


  const dolorean = gameInstance.add([
    gameInstance.sprite('dolorean'),
    gameInstance.pos(position.x, position.y),
    gameInstance.body({
      jumpForce: JUMP_FORCE,
    }),
    gameInstance.area({
      shape: new Rect(gameInstance.vec2(0), 32, 12), // Ajuster selon la taille du sprite
    }),
    gameInstance.anchor('bot'),
    gameInstance.offscreen({ hide: true }),
    'dolorean',
    'player',
  ])

  dolorean.play(ANIMS.IDLE);



  // Collision avec les rochers - on passe à travers mais on prend des dégâts et on détruit le rocher
  let lastRockCollisionTime = 0;
  const ROCK_COLLISION_COOLDOWN = 0.3; // Cooldown pour éviter les dégâts multiples

  dolorean.onCollide('rock', (rock) => {
    const currentTime = gameInstance.time();

    // Vérifier le cooldown pour éviter les dégâts multiples
    if (currentTime - lastRockCollisionTime > ROCK_COLLISION_COOLDOWN) {
      lastRockCollisionTime = currentTime;


      gameInstance.play('collided');
      dolorean.play(ANIMS.COLLIDED, {
        loop: false,
        onEnd: () => {
          if (dolorean.isGrounded()) {
            dolorean.play(ANIMS.IDLE, { loop: true });
          } else {
            dolorean.play(ANIMS.JUMPING, { loop: true });
          }
        },
      });

      if (onTakeDamage) {
        onTakeDamage(5);
      }

      try {
        gameInstance.play('rock-hit')
      } catch (e) {
        // Son non disponible
      }

      rock.health = 0

      if (!rock.isDestroyed) {
        rock?.play('destroy', {
          loop: false,
          onEnd: () => {
            rock?.destroy?.();
          },
        });
      }

    }
  });

  // Contrôles de mouvement
  gameInstance.onKeyDown(CONTROLS.MOVE_LEFT as unknown as string[], () => {
    moveLeft = true;
    isMovingBack = true;

  });

  gameInstance.onKeyDown(CONTROLS.MOVE_RIGHT as unknown as string[], () => {
    moveRight = true;
    isMovingForward = true;
  });

  gameInstance.onKeyRelease(CONTROLS.MOVE_LEFT as unknown as string[], () => {
    moveLeft = false;
    isMovingBack = false;
    // Revenir à l'animation idle normale si on est au sol
    if (dolorean.isGrounded() && !moveRight) {
      const currentAnim = dolorean.curAnim();

      if (currentAnim === ANIMS.IDLE_BACK) {
        dolorean.play(ANIMS.IDLE, { loop: true });
      }
    }
  });

  gameInstance.onKeyRelease(CONTROLS.MOVE_RIGHT as unknown as string[], () => {
    moveRight = false;
    isMovingForward = false;
    // Revenir à l'animation idle normale si on est au sol et qu'on ne bouge plus
    if (dolorean.isGrounded() && !moveLeft) {
      const currentAnim = dolorean.curAnim();
      if (currentAnim === ANIMS.IDLE_FORWARD || currentAnim === ANIMS.IDLE_BACK) {
        dolorean.play(ANIMS.IDLE, { loop: true });
      }
    }
  });

  // Contrôle de saut
  gameInstance.onKeyPress(CONTROLS.JUMP as unknown as string[], () => {
    if (dolorean.isGrounded() && canJump) {
      isJumping = true;
      canJump = false;
      dolorean.jump(JUMP_FORCE);
      dolorean.play(ANIMS.JUMP, { loop: false });
      try {
        gameInstance.play('jump');
      } catch (e) {
        // Son non disponible
      }
    }
  });

  // Fonction pour créer un projectile
  const createProjectile = (startX: number, startY: number, direction: 'up' | 'right') => {
    const projectile = gameInstance.add([
      gameInstance.rect(2, 2),
      gameInstance.pos(startX, startY),
      gameInstance.area(),
      gameInstance.color(255, 255, 0), // Jaune pour les projectiles
      'projectile',
      direction === 'right' ? 'horizontal-shot' : 'vertical-shot',
    ]);

    if (direction === 'right') {
      projectile.onUpdate(() => {
        const dt = gameInstance.dt();
        projectile.move(HORIZONTAL_SHOT_SPEED * dt, 0);
        // Vérifier la portée limitée
        const distance = projectile.pos.x - startX;
        if (distance > HORIZONTAL_SHOT_RANGE) {
          projectile.destroy();
        }
        // Détruire si hors écran
        if (projectile.pos.x > gameInstance.width() + 50) {
          projectile.destroy();
        }
      });
    } else {
      projectile.onUpdate(() => {
        const dt = gameInstance.dt();
        projectile.move(0, -VERTICAL_SHOT_SPEED * dt);
        // Détruire si hors écran
        if (projectile.pos.y < -50) {
          projectile.destroy();
        }
      });
    }

    // Détruire après un certain temps pour éviter les fuites
    setTimeout(() => {
      if (projectile.exists()) {
        projectile.destroy();
      }
    }, 5000);
  };

  // Contrôle de tir (E ou F) - Système de surchauffe
  gameInstance.onKeyPress(CONTROLS.INTERACT as unknown as string[], () => {
    // Vérifier si on peut tirer (pas en surchauffe)
    if (!isOverheated && heat < MAX_HEAT) {
      const currentTime = gameInstance.time();
      lastShotTime = currentTime; // Enregistrer le temps du tir

      // Augmenter la chaleur AVANT de créer les projectiles
      heat += HEAT_PER_SHOT;
      // Forcer à 100% si on dépasse
      if (heat >= MAX_HEAT) {
        heat = MAX_HEAT; // Bloquer à 100% exactement
        isOverheated = true; // Activer l'état de surchauffe
        overheatStartTime = currentTime; // Enregistrer le moment de la surchauffe
        try {
          gameInstance.play('heat');
        } catch (e) {
          // Son non disponible
        }
      }

      // Position de départ des projectiles (devant la voiture)
      const shotX = dolorean.pos.x;
      const shotY = dolorean.pos.y - 8; // Légèrement au-dessus du sol


      try {
        gameInstance.play('shoot');
      } catch (e) {
        // Son non disponible
      }
      createProjectile(shotX, shotY, 'up');
      createProjectile(shotX, shotY, 'right');
    }
    // Si en surchauffe, le tir est bloqué
  });

  // Mise à jour de la voiture
  dolorean.onUpdate(() => {
    const dt = gameInstance.dt();
    const gameWidth = gameInstance.width();
    const centerX = gameWidth / 2;
    const MAX_X = centerX + 60; // Limite droite autour du centre
    const MIN_X_CENTERED = centerX - 60; // Limite gauche autour du centre

    // Gestion du système de surchauffe (comme Gears of War)
    const currentTime = gameInstance.time();

    if (isOverheated) {
      // En surchauffe : attendre un délai minimum avant de commencer à refroidir
      if (currentTime - overheatStartTime >= OVERHEAT_DURATION) {
        // Le délai de surchauffe est terminé, commencer à refroidir
        if (currentTime - lastShotTime > COOLDOWN_DELAY_AFTER_SHOT) {
          heat -= OVERHEAT_COOLDOWN_RATE * dt;
          if (heat < MAX_HEAT) {
            // Sortir de la surchauffe
            isOverheated = false;
            heat = Math.max(0, heat); // Ne pas descendre en dessous de 0
          }
        }
      }
      // Pendant le délai de surchauffe, la chaleur reste à 100% et on ne peut pas tirer
    } else if (heat > 0) {
      // Refroidissement normal (pas en surchauffe)
      if (currentTime - lastShotTime > COOLDOWN_DELAY_AFTER_SHOT) {
        heat -= HEAT_COOLDOWN_RATE * dt;
        if (heat < 0) {
          heat = 0; // Ne pas descendre en dessous de 0
        }
      }
    }

    // Gestion du saut et des animations
    if (dolorean.isGrounded()) {
      if (isJumping) {
        // On vient d'atterrir
        isJumping = false;
        canJump = true;
        if (dolorean.curAnim() !== ANIMS.GROUNDED) {
          dolorean.play(ANIMS.GROUNDED, {
            loop: false,
            onEnd() {
              // Après l'atterrissage, choisir la bonne animation selon la direction
              if (isMovingBack) {
                dolorean.play(ANIMS.IDLE_BACK, { loop: true });
              } else if (isMovingForward) {
                dolorean.play(ANIMS.IDLE_FORWARD, { loop: true });
              } else {
                dolorean.play(ANIMS.IDLE, { loop: true });
              }
            },
          });
        }
      } else {
        // On est au sol, pas en train de sauter
        const currentAnim = dolorean.curAnim();
        if (currentAnim === ANIMS.COLLIDED) {
          // Attendre que l'animation de collision se termine
          return;
        }

        if (isMovingBack) {
          // En marche arrière : jouer l'animation de marche arrière si ce n'est pas déjà le cas
          if (currentAnim !== ANIMS.IDLE_BACK) {
            dolorean.play(ANIMS.IDLE_BACK, { loop: true });
          }
        } else if (moveRight && isMovingForward) {
          // En marche avant : jouer l'animation de marche avant si ce n'est pas déjà le cas
          if (currentAnim !== ANIMS.IDLE_FORWARD) {
            dolorean.play(ANIMS.IDLE_FORWARD, { loop: true });
          }
        } else if (!moveLeft && !moveRight) {
          // Pas de mouvement : revenir à l'animation idle normale
          if (currentAnim === ANIMS.IDLE_BACK || currentAnim === ANIMS.IDLE_FORWARD) {
            dolorean.play(ANIMS.IDLE, { loop: true });
          } else if (currentAnim !== ANIMS.IDLE && currentAnim !== ANIMS.GROUNDED && currentAnim !== ANIMS.JUMP) {
            dolorean.play(ANIMS.IDLE, { loop: true });
          }
        }
      }
    } else {
      // En l'air
      if (!isJumping) {
        isJumping = true;
      }
      const currentAnim = dolorean.curAnim();
      if (currentAnim !== ANIMS.JUMP && currentAnim !== ANIMS.JUMPING) {
        dolorean.play(ANIMS.JUMPING, { loop: true });
      }
    }

    // Déplacement horizontal avec limites (autour du centre de l'écran)
    if (moveLeft && dolorean.pos.x > MIN_X_CENTERED) {
      dolorean.move(-MOVE_SPEED * dt, 0);
    }
    if (moveRight && dolorean.pos.x < MAX_X) {
      dolorean.move(MOVE_SPEED * dt, 0);
    }

    // S'assurer que la voiture reste dans les limites centrées
    if (dolorean.pos.x < MIN_X_CENTERED) {
      dolorean.pos.x = MIN_X_CENTERED;
    }
    if (dolorean.pos.x > MAX_X) {
      dolorean.pos.x = MAX_X;
    }
  });

  // Exposer la valeur de chaleur et la méthode pour jouer l'animation de collision
  type DoloreanWithHeat = typeof dolorean & {
    getHeat: () => number;
    getMaxHeat: () => number;
    playCollided: () => void;
  };
  const doloreanWithHeat = dolorean as DoloreanWithHeat;
  doloreanWithHeat.getHeat = () => heat;
  doloreanWithHeat.getMaxHeat = () => MAX_HEAT;
  doloreanWithHeat.playCollided = () => {
    try {
      gameInstance.play('collided');
    } catch (e) {
      // Son non disponible
    }
    dolorean.play(ANIMS.COLLIDED, {
      loop: false,
      onEnd: () => {
        // Revenir à l'animation appropriée après la collision
        if (dolorean.isGrounded()) {
          dolorean.play(ANIMS.IDLE, { loop: true });
        } else {
          dolorean.play(ANIMS.JUMPING, { loop: true });
        }
      },
    });
  };

  return doloreanWithHeat;
}