import * as me from 'melonjs'
import { gameState } from '../game-state';

export class Player extends me.Renderable {
  projectDialCount: number;
  facingRight: boolean;
  invincible: boolean;
  body: me.Body;
  alwaysUpdate: boolean;
  dying: boolean;
  renderable: me.Renderable | null;
  onGround: boolean;
  wasOnGround: boolean;
  fallingSoundPlayed: boolean;
  initialCameraY: number | undefined;
  justLanded: boolean;
  landedTimer: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);

    this.projectDialCount = 0
    this.facingRight = true

    const hitboxWidth = width;
    const hitboxHeight = height;

    const hitboxOffsetX = -hitboxWidth / 2;
    const hitboxOffsetY = -hitboxHeight / 2;

    this.body = new me.Body(this, new me.Rect(
      hitboxOffsetX,
      hitboxOffsetY,
      hitboxWidth,
      hitboxHeight
    ))

    this.invincible = false
    this.body.collisionType = me.collision.types.PLAYER_OBJECT

    this.body.setStatic(false);
    this.body.ignoreGravity = false;

    this.alwaysUpdate = true
    this.body.setMaxVelocity(3, 15)
    this.body.setFriction(.9, 0)

    this.body.gravityScale = 1.2

    this.dying = false
    this.onGround = false
    this.wasOnGround = false
    this.fallingSoundPlayed = false
    this.initialCameraY = undefined
    this.justLanded = false
    this.landedTimer = 0

    me.game.viewport.setDeadzone(16, 200)

    me.game.viewport.follow(this, me.game.viewport.AXIS.HORIZONTAL, 0.7)

    if (gameState.texture) {
      this.renderable = gameState.texture.createAnimationFromName() as me.Renderable;
      if (this.renderable) {
        this.renderable.anchorPoint.set(0.5, 0.5);
        const renderableWithUpdate = this.renderable as me.Renderable & { alwaysUpdate?: boolean };
        if (renderableWithUpdate.alwaysUpdate !== undefined) {
          renderableWithUpdate.alwaysUpdate = true;
        }
        this.setupAnimationsWithDurations();
      }
    } else {
      this.renderable = null;
      console.warn('Player texture not loaded yet');
    }

    this.anchorPoint.set(0.5, 0.5)
  }

  update(dt: number) {
    this.wasOnGround = this.onGround;

    const vel = this.body.vel;

    if (this.justLanded && this.onGround) {
      const isMoving = this.body.force.x !== 0;
      if (isMoving) {
        this.justLanded = false;
        this.landedTimer = 0;
      } else {
        this.landedTimer += dt;
        if (this.landedTimer > 0.3) {
          this.justLanded = false;
          this.landedTimer = 0;
        }
      }
    } else {
      this.landedTimer = 0;
    }
    const isFalling = vel && vel.y !== undefined && vel.y > 0.1;

    if (isFalling && !this.fallingSoundPlayed) {
      this.playFallSound();
      this.fallingSoundPlayed = true;
    }

    if (vel && vel.y !== undefined) {
      if (vel.y < -0.5) {
        this.onGround = false;
      } else if (vel.y > 2) {
        this.onGround = false;
      }
    } else {
      this.onGround = false;
    }

    const maxVel = this.body.maxVel;
    if (maxVel && maxVel.x !== undefined && maxVel.y !== undefined) {
      if (me.input.isKeyPressed('left')) {
        this.body.force.x = -maxVel.x;
        this.facingRight = false;
      } else if (me.input.isKeyPressed('right')) {
        this.body.force.x = maxVel.x;
        this.facingRight = true;
      } else {
        this.body.force.x = 0;
      }

      const canJump = this.onGround || (vel && vel.y !== undefined && vel.y <= 1 && vel.y >= -0.5);

      if (me.input.isKeyPressed('jump') && canJump && vel) {
        if (vel.y === undefined || vel.y <= 1) {
          vel.y = -maxVel.y;
          this.onGround = false;
          this.playJumpSound();
        }
      }
    }

    this.updateAnimation();

    if (this.renderable && typeof this.renderable.update === 'function') {
      this.renderable.update(dt);
    }

    if (this.initialCameraY === undefined) {
      const currentY = me.game.viewport.pos.y;
      if (currentY !== undefined) {
        this.initialCameraY = currentY;
      }
    }

    return super.update(dt);
  }

  setupAnimationsWithDurations() {
    if (!this.renderable || !gameState.spriteData || !gameState.texture) return;

    const spriteData = gameState.spriteData as {
      frames?: Array<{ filename?: string; duration?: number }>;
      meta?: { frameTags?: Array<{ name: string; from: number; to: number }> };
    };

    if (!spriteData.frames || !spriteData.meta?.frameTags) return;

    const spriteWithAnim = this.renderable as me.Renderable & {
      addAnimation?: (name: string, frames: Array<{ name: string | number; delay: number }>) => void;
    };

    if (!spriteWithAnim.addAnimation) return;

    for (const tag of spriteData.meta.frameTags) {
      const animationFrames: Array<{ name: string | number; delay: number }> = [];

      for (let i = tag.from; i <= tag.to; i++) {
        const frame = spriteData.frames[i];
        if (frame) {
          const frameName = frame.filename || i.toString();
          const delay = frame.duration || 100;
          animationFrames.push({ name: frameName, delay });
        }
      }

      if (animationFrames.length > 0) {
        spriteWithAnim.addAnimation(tag.name, animationFrames);
      }
    }
  }

  updateAnimation() {
    if (!this.renderable || !gameState.texture) return;

    const vel = this.body.vel;
    const isMoving = this.body.force.x !== 0;
    const isInAir = !this.onGround && vel && vel.y !== undefined && (vel.y < -0.5 || vel.y > 0.1);

    let animationName = "stand";

    if (this.justLanded && this.onGround) {
      animationName = "grounded";
    } else if (isInAir) {
      animationName = "jump";
    } else if (isMoving && this.onGround) {
      animationName = "walk";
    } else {
      animationName = "stand";
    }

    const spriteWithAnim = this.renderable as me.Renderable & {
      name?: string;
      setCurrentAnimation?: (name: string) => void;
    };

    if (spriteWithAnim.name !== animationName) {
      if (spriteWithAnim.setCurrentAnimation) {
        spriteWithAnim.setCurrentAnimation(animationName);
      } else {
        this.renderable = gameState.texture.createAnimationFromName([animationName]) as me.Renderable;
        if (this.renderable) {
          this.renderable.anchorPoint.set(0.5, 0.5);
          const renderableWithUpdate = this.renderable as me.Renderable & { alwaysUpdate?: boolean };
          if (renderableWithUpdate.alwaysUpdate !== undefined) {
            renderableWithUpdate.alwaysUpdate = true;
          }
        }
      }
    }
  }

  playFallSound() {

    try {
      // me.audio.play() charge et joue automatiquement le son s'il existe
      //  me.audio.play('spike', false);
    } catch (e) {
      // Ignorer les erreurs si le son n'est pas chargé
      console.debug('Son de chute non disponible');
    }
  }

  /**
   * Joue le son de saut
   */
  playJumpSound() {

    try {
      // me.audio.play() charge et joue automatiquement le son s'il existe
      me.audio.play('jump', false);
    } catch (e) {
      // Ignorer les erreurs si le son n'est pas chargé
      console.debug('Son de saut non disponible');
    }
  }

  onCollision(response: { overlapV?: { x?: number; y?: number } }, other: me.Renderable): boolean {
    if (other.body && other.body.collisionType === me.collision.types.WORLD_SHAPE) {
      if (response.overlapV && response.overlapV.y !== undefined && response.overlapV.y > 0 &&
        this.body.vel && this.body.vel.y !== undefined && this.body.vel.y > 0) {
        if (!this.wasOnGround) {
          this.justLanded = true;
        }
        this.onGround = true;
        if (this.body.vel) {
          this.body.vel.y = 0;
        }
        if (this.body.force) {
          this.body.force.y = 0;
        }
        this.fallingSoundPlayed = false;
        return true;
      }

      if (response.overlapV && response.overlapV.y !== undefined && response.overlapV.y > 0) {
        const vel = this.body.vel;
        if (!vel || vel.y === undefined || vel.y <= 0.5) {
          this.onGround = true;
          if (this.body.vel && this.body.vel.y !== undefined && this.body.vel.y > 0) {
            this.body.vel.y = 0;
          }
        }
      }
      return true;
    }

    if (other.body && other.body.collisionType === me.collision.types.COLLECTABLE_OBJECT) {
      return false;
    }

    if (other.body && other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      if (!this.invincible && !this.dying) {
        console.log('Collision avec ennemi');
      }
      return true;
    }

    return true;
  }

  draw(renderer: me.CanvasRenderer) {
    if (this.renderable) {
      this.renderable.pos.copy(this.pos);

      renderer.save();

      if (!this.facingRight) {
        const x = this.pos.x ?? 0;
        renderer.translate(x + (this.width ?? 32) / 2, this.pos.y ?? 0);
        renderer.scale(-1, 1);
        renderer.translate(-(x + (this.width ?? 32) / 2), -(this.pos.y ?? 0));
      }

      this.renderable.draw(renderer);

      renderer.restore();
    } else {
      const x = this.pos.x ?? 0;
      const y = this.pos.y ?? 0;
      const w = this.width ?? 32;
      const h = this.height ?? 32;
      renderer.setColor('#ff2a83');
      renderer.fillRect(x - w / 2, y - h / 2, w, h);
    }
    super.draw(renderer);
  }
}