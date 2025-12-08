import type kaplay from 'kaplay'
import { gameState } from '../game-state'
import { createPlayer } from '../entities/player'
import { FONTS } from '../mini-game.const'
import { createMachine } from '../entities/machine'
import { createScreen } from '../entities/screen'
import { createBomberman } from '../entities/bomberman'
import { createBreakout } from '../entities/breakout'
import { createPortal } from '../entities/portal'

const texts = {
  welcome: {
    fr: 'Bienvenue\nau Musée du jeu vidéo',
    en: 'Welcome\nto the Video Game Museum',
  },
}

const levelWidth = 3376
const levelHeight = 480
const GROUND_Y = 156

export function createStartScene(
  gameInstance: ReturnType<typeof kaplay> | null,
  { BASE_URL }: { BASE_URL: string }
) {
  if (!gameInstance) return
  gameInstance!.setGravity(1500);

  gameInstance.loadSprite('background', `${BASE_URL}/tiles/start.png`)
  gameInstance.loadSound('hurt', `${BASE_URL}/sounds/hurt.mp3`);
  gameInstance.loadSound('bythepond', `${BASE_URL}/sounds/bythepond.mp3`);

  if (!import.meta.env.DEV) {
    //@ts-expect-error - musicSound is not defined in the type
    if (gameInstance!.musicSound) {
      //@ts-expect-error - musicSound is not defined in the type
      gameInstance!.musicSound.paused = true
    }
    //@ts-expect-error - musicSound is not defined in the type
    gameInstance!.musicSound = gameInstance.play('bythepond', { loop: true, volume: 0.3 });

  }

  gameState.level = 1
  gameState.isGameStarted = true

  // Background
  gameInstance!.add([
    gameInstance!.sprite('background'),
    gameInstance!.pos(0, -84),
    gameInstance!.anchor('topleft'),
    gameInstance!.z(-100),
  ])

  // MUR GAUCHE
  gameInstance!.add([
    gameInstance!.rect(1, 300),
    gameInstance!.pos(80, 0),
    gameInstance!.area(),
    gameInstance!.offscreen({ hide: true }),
    gameInstance!.opacity(0),
    gameInstance!.body({ isStatic: true }),
    'platform',
  ])

  // MUR DROIT
  gameInstance!.add([
    gameInstance!.rect(2, 300),
    gameInstance!.pos(levelWidth - 500, 0),
    gameInstance!.area(),
    gameInstance!.offscreen({ hide: true }),
    gameInstance!.opacity(0),
    gameInstance!.body({ isStatic: true }),
    'platform',
    'ground',
  ])

  // Sol statique
  gameInstance!.add([
    gameInstance!.rect(levelWidth, 1),
    gameInstance!.pos(0, GROUND_Y),
    gameInstance!.area(),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.offscreen({ hide: true }),
    gameInstance!.opacity(0),
    'platform',
    'ground',
  ])

  const lang = window.location.pathname.split('/')[1] || 'fr'
  const isPortrait = window.innerWidth < window.innerHeight

  const startPosition = isPortrait ? { x: 170, y: 140 } : {
    x: import.meta.env.DEV ? 780 : 170,
    y: 140,
  }

  // ============================== ENTITIES ==============================

  const player = createPlayer(gameInstance, {
    levelWidth,
    levelHeight,
    BASE_URL,
    startPosition,
  })

  player.play('idle');

  gameInstance.add([
    gameInstance.text(texts.welcome[lang as keyof typeof texts.welcome], {
      font: FONTS.SILKSCREEN,
      size: 8,
      align: 'center',
      lineSpacing: 2,
      letterSpacing: 2,
      width: 100,
    }),
    gameInstance.z(-50),
    gameInstance.pos(152, 60),
  ])

  // credit music
  gameInstance!.add([
    gameInstance!.text('music by: JustFreeGames', {
      size: 4,
      font: FONTS.SILKSCREEN,
    }),
    gameInstance.pos(172, 45),
    gameInstance!.color(255, 255, 255),
    gameInstance!.z(100),
    gameInstance!.opacity(0.3),
    'credit-music',
  ]);

  // Pattern d'écarts qui se répète : 49, 44, 54, 45
  const spacingPattern = [49, 44, 54, 45]
  const startX = 232
  const numberOfFurniture = 59

  const furniturePositions = Array.from(
    { length: numberOfFurniture },
    (_, index) => {
      if (index === 0) {
        return { x: startX, y: GROUND_Y - 40 }
      }
      let x = startX
      for (let i = 0; i < index; i++) {
        x += spacingPattern[i % spacingPattern.length]
      }
      return { x, y: GROUND_Y - 40 }
    }
  )

  const indexToSkip = [
    2, //computer space
    3, //vectrex
    6, //wonderswan
    7, //virtualboy
    10, //3do 
    11, //nes
    12, // breakouts
    13, // breakouts

  ]

  for (const position of furniturePositions.filter(
    (_, index) => !indexToSkip.includes(index)
  )) {
    createScreen(gameInstance, { position })
  }

  const machines = [
    {
      position: { x: 328, y: GROUND_Y - 32 },
      spriteName: 'computer-space',
      idPanel: '11517969-f1f4-49ab-bf5f-8862b1f4db76',
    },

    {
      position: { x: 379, y: GROUND_Y - 40 },
      spriteName: 'vectrex',
      idPanel: 'f0e4ea9e-105a-4aae-81f3-96ea82107481',
    },
    {
      position: { x: 517, y: GROUND_Y - 40 },
      spriteName: 'wonderswan',
      idPanel: 'e64342fc-e087-4b28-a446-d33b31380cc3',
    },
    {
      position: { x: 571, y: GROUND_Y - 40 },
      spriteName: 'virtualboy',
      idPanel: '971d32c8-2f40-48aa-ab0b-1035f8f1d0fd',
    },
    {
      position: { x: 709, y: GROUND_Y - 40 },
      spriteName: '3do',
      idPanel: 'b2194a8a-4a32-4403-9ec3-12be4412d7b3',
    },
    {
      position: { x: 763, y: GROUND_Y - 40 },
      spriteName: 'nes',
      idPanel: '236e00bb-8ba9-4f4b-83d9-abae3cc0a5d4',
    }
  ]

  const resources = [...machines.map(machine => machine.spriteName), 'bomberman', 'games'];

  for (const resource of resources) {
    gameInstance.loadAseprite(resource, `${BASE_URL}/entities/${resource}.png`, `${BASE_URL}/entities/${resource}.json`);
  }


  for (const machine of machines) {
    createMachine(gameInstance, machine)
  }


  const furniturePlatformsSpecial = [
    382,
    520,
    574,
    [712, GROUND_Y - 26, 18],
    [765, GROUND_Y - 21, 19],
    // Plateforme pour moon patrol
    [849, 29, 22],
    [801, 5, 22],
    [737, 21, 22],
    [673, -4, 22],
    [577, -20, 62],
  ]

  for (const platform of furniturePlatformsSpecial) {

    const [x, y, width] = Array.isArray(platform) ? platform : [platform, GROUND_Y - 20, 18]
    gameInstance!.add([
      gameInstance!.rect(width, 1),
      gameInstance!.pos(x, y),
      gameInstance!.area(),
      gameInstance!.opacity(0),
      gameInstance!.body({ isStatic: true }),
      gameInstance!.offscreen({ hide: true }),
      gameInstance!.platformEffector({
        ignoreSides: [gameInstance!.LEFT, gameInstance!.RIGHT, gameInstance!.UP],
      }),
    ])
  }

  // TOP Vitrine
  Array.from({ length: 14 }).forEach((_, index) => {
    gameInstance!.add([
      gameInstance!.rect(20, 1),
      gameInstance!.pos(354 + index * 192, GROUND_Y - 40),
      gameInstance!.area(),
      gameInstance!.body({ isStatic: true }),
      gameInstance!.offscreen({ hide: true }),
      gameInstance!.platformEffector({ ignoreSides: [gameInstance!.LEFT, gameInstance!.RIGHT, gameInstance!.UP], }),
      gameInstance!.opacity(0),
    ])
  })

  createBomberman(gameInstance, { position: { x: 513, y: 50 }, player })
  createBreakout(gameInstance, { position: { x: 798, y: GROUND_Y - 42 }, player })
  createPortal(gameInstance, { position: { x: 500, y: 28, rotation: -90, color: 'orange' }, player })
}
