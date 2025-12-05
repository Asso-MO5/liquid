import type kaplay from 'kaplay'
import { gameState } from '../game-state'
import { createPlayer } from '../entities/player'
import { FONTS } from '../mini-game.const'
import { createMachine } from '../entities/machine'
import { createScreen } from '../entities/screen'
import { createBomberman } from '../entities/bomberman'

export function createStartScene(
  gameInstance: ReturnType<typeof kaplay> | null,
  { BASE_URL }: { BASE_URL: string }
) {
  if (!gameInstance) return

  // ============================== LOAD RESOURCES ==============================
  gameInstance.loadSprite('background', `${BASE_URL}/tiles/start.png`)

  // ============================== STATE ==============================

  gameState.level = 1
  gameState.isGameStarted = true

  const levelWidth = 3376
  const levelHeight = 480

  const GROUND_Y = 156

  // ============================== LEVEL ==============================

  gameInstance!.add([
    gameInstance!.sprite('background'),
    gameInstance!.pos(0, -84),
    gameInstance!.anchor('topleft'),
    gameInstance!.z(-100),
  ])

  // MUR GAUCHE
  gameInstance!.add([
    gameInstance!.rect(2, 300),
    gameInstance!.pos(0, 0),
    gameInstance!.area(),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.color(255, 0, 0),
    gameInstance!.opacity(0),
    'platform',
    'ground',
  ])

  // MUR DROIT
  gameInstance!.add([
    gameInstance!.rect(2, 300),
    gameInstance!.pos(levelWidth - 500, 0),
    gameInstance!.area(),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.color(255, 0, 0),
    gameInstance!.opacity(0),
    'platform',
    'ground',
  ])

  // Sol statique
  gameInstance!.add([
    gameInstance!.rect(levelWidth, 1),
    gameInstance!.pos(0, GROUND_Y),
    gameInstance!.area(),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.color(255, 0, 0),
    gameInstance!.opacity(0),
    'platform',
    'ground',
  ])




  const lang = window.location.pathname.split('/')[1] || 'fr'

  const texts = {
    welcome: {
      fr: 'Bienvenue\nau Musée du jeu vidéo',
      en: 'Welcome\nto the Video Game Museum',
    },
  }

  const isPortrait = window.innerWidth < window.innerHeight


  // 170, 140
  const startPosition = isPortrait ? { x: 170, y: 140 } : { x: 200, y: 140 }

  // ============================== ENTITIES ==============================

  const player = createPlayer(gameInstance, {
    levelWidth,
    levelHeight,
    BASE_URL,
    startPosition,
  })

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

  // Pattern d'écarts qui se répète : 49, 44, 54, 45
  const spacingPattern = [49, 44, 54, 45]
  const startX = 232
  const numberOfFurniture = 64

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
  ]

  for (const machine of machines) {
    createMachine(gameInstance, machine)
  }



  // BOMBERMAN


  gameInstance!.add([
    gameInstance!.rect(18, 1),
    gameInstance!.pos(520, GROUND_Y - 20),
    gameInstance!.area(),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.color(255, 0, 0),
    gameInstance!.platformEffector({
      ignoreSides: [gameInstance!.LEFT, gameInstance!.RIGHT, gameInstance!.UP],
    }),
    gameInstance!.opacity(0),
  ])


  gameInstance!.add([
    gameInstance!.rect(20, 1),
    gameInstance!.pos(546, GROUND_Y - 40),
    gameInstance!.area(),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.color(255, 0, 0),
    gameInstance!.platformEffector({ ignoreSides: [gameInstance!.LEFT, gameInstance!.RIGHT, gameInstance!.UP], }),
    gameInstance!.opacity(0),
  ])

  createBomberman(gameInstance, { position: { x: 513, y: 50 }, player })
}
