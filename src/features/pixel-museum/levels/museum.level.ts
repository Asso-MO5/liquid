import type kaplay from 'kaplay'
import { ASEPRITES, FONTS, OBJECTS, SOUNDS, SPRITES, TAGS } from '../pixel-museum.const'
import { playMusic } from '../pixel-museum-sound.ctrl'
import { createPlayer } from '../entities/player.create'
import { initMultiplayer } from '../pixel-museum.multi'

const texts = {
  welcome: {
    fr: 'Bienvenue\nau Musée du jeu vidéo',
    en: 'Welcome\nto the Video Game Museum',
  },
}

const LEVEL_WIDTH = 2104
const LEVEL_HEIGHT = 302
const GROUND_Y = 155

export const museumLevel = (k: ReturnType<typeof kaplay> | null) => {
  if (!k) return console.error('kaplay non trouvé')
  k.setGravity(1500)

  playMusic(k, SOUNDS.BYTHEPOND)

  // Background
  k.add([k.sprite(SPRITES.MUSEUM), k.pos(0, 73), k.anchor('left'), k.z(-100)])

  // MUR GAUCHE
  k.add([
    k.rect(1, 600),
    k.pos(94, 155),
    k.anchor('botleft'),
    k.area(),
    k.offscreen({ hide: true }),
    k.opacity(0),
    k.body({ isStatic: true }),
    'platform',
  ])

  // MUR DROIT
  k.add([
    k.rect(1, 600),
    k.pos(LEVEL_WIDTH - 94, 155),
    k.anchor('botright'),
    k.area(),
    k.offscreen({ hide: true }),
    k.opacity(0),
    k.body({ isStatic: true }),
    'platform',
  ])

  // Sol statique
  k.add([
    k.rect(LEVEL_WIDTH, 1),
    k.pos(0, GROUND_Y),
    k.area(),
    k.body({ isStatic: true }),
    k.offscreen({ hide: true }),
    k.opacity(0),
    'platform',
    'ground',
  ])

  k.add([
    k.sprite(OBJECTS.TICKET_DESK),
    k.pos(806, GROUND_Y),
    k.anchor('botleft'),
    k.z(95),
    'ticket-desk',
  ])

  k.add([
    k.sprite(OBJECTS.TICKET_PC),
    k.pos(816, GROUND_Y - 16),
    k.anchor('botleft'),
    k.z(95),
    'ticket-desk',
  ])



  const machines = [
    {
      name: 'Tennis for Two',
      id: '8774d6cb-4797-40ee-9cd0-e6e65a512c15',
      pos: { x: 188, y: GROUND_Y - 5 },
      machine: {
        sprite: ASEPRITES.TENNIS_FOR_TWO,
        pos: { x: 132, y: GROUND_Y - 15 },
      }
    },
    {
      name: 'Spacewar!',
      id: '20914eb4-e3ac-4d10-8228-b432c201a41c',
      pos: { x: 293, y: GROUND_Y - 5 },
      machine: {
        sprite: ASEPRITES.SPACEWAR,
        pos: { x: 245, y: GROUND_Y - 15 },
      }
    },
    {
      name: 'Computer Space',
      id: '11517969-f1f4-49ab-bf5f-8862b1f4db76',
      pos: { x: 495, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.COMPUTER_SPACE,
        pos: { x: 455, y: GROUND_Y + 3 },
      }
    },
    {
      name: 'Pong',
      id: 'ae7f2d58-429e-44fb-aad0-a560c8bbb1f2',
      pos: { x: 590, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.PONG,
        pos: { x: 540, y: GROUND_Y },
      }
    },
    {
      name: 'Space Invaders',
      id: '3afed56d-b82e-4c10-992d-e2b5a9b7e844',
      pos: { x: 684, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.SPACE_INVADERS,
        pos: { x: 638, y: GROUND_Y + 1 },
      }
    },
    {
      name: 'Vectrex',
      id: 'f0e4ea9e-105a-4aae-81f3-96ea82107481',
      pos: { x: 968, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.VECTREX,
        pos: { x: 936, y: GROUND_Y },
      }
    },
    {
      name: 'Nes',
      id: '236e00bb-8ba9-4f4b-83d9-abae3cc0a5d4',
      pos: { x: 1056, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.NES,
        pos: { x: 1021, y: GROUND_Y },
      }
    },
    {
      name: 'Amiga 500',
      id: '6fb419f5-51df-4e00-8dd8-3e9210ee069d',
      pos: { x: 1144, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.AMIGA_500,
        pos: { x: 1105, y: GROUND_Y },
      }
    },
    {
      name: '3DO',
      id: 'b2194a8a-4a32-4403-9ec3-12be4412d7b3',
      pos: { x: 1320, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES['3DO'],
        pos: { x: 1287, y: GROUND_Y },
      }
    },
    {
      name: 'Virtual Boy',
      id: '971d32c8-2f40-48aa-ab0b-1035f8f1d0fd',
      pos: { x: 1408, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.VIRTUALBOY,
        pos: { x: 1370, y: GROUND_Y },
      }
    },
    {
      name: 'Dreamcast',
      id: '3f4170b0-5dff-4c92-bc25-6bc0bf9143f2',
      pos: { x: 1496, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.DREAMCAST,
        pos: { x: 1455, y: GROUND_Y },
      }
    },
    {
      name: 'PS2',
      id: '58a06dc8-8b8b-4049-87ec-18b30ec10e8f',
      pos: { x: 1672, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.PS2,
        pos: { x: 1635, y: GROUND_Y },
      }
    },
    {
      name: 'GameCube',
      id: '307099fc-9d1f-4280-b8bb-7b4ce94f4bdf',
      pos: { x: 1760, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.GAMECUBE,
        pos: { x: 1715, y: GROUND_Y },
      }
    },
    {
      name: 'Xbox',
      id: 'eaa76b01-918e-4a01-a2ab-6475f8b35548',
      pos: { x: 1848, y: GROUND_Y - 15 },
      machine: {
        sprite: ASEPRITES.XBOX,
        pos: { x: 1805, y: GROUND_Y },
      }
    }
  ]

  for (const machine of machines) {
    k.add([
      k.rect(32, 48),
      k.pos(machine.pos.x, machine.pos.y),
      k.area(),
      k.anchor('botleft'),
      k.z(95),
      k.opacity(0),
      TAGS.DOC,
      `id-${machine.id}`
    ])
    k.add([
      k.sprite(machine.machine.sprite, { anim: 'off' }),
      k.pos(machine.machine.pos.x, machine.machine.pos.y),
      k.anchor('botleft'),
      k.area(),
      k.z(95),
      TAGS.MACHINE,
    ])
  }



  const lang = window.location.pathname.split('/')[1] || 'fr'

  k.add([
    k.text(texts.welcome[lang as keyof typeof texts.welcome], {
      font: FONTS.SILKSCREEN.split('/').pop()?.split('.')[0],
      size: 8,
      align: 'center',
      lineSpacing: 2,
      letterSpacing: 2,
      width: 100,
    }),
    k.color(255, 255, 255),
    k.z(-50),
    k.pos(798, 95),
  ])

  const startPosition = { x: 815, y: 120 }
  k.setCamPos(845, 120)
  setTimeout(() => {
    if (!k) return
    const player = createPlayer(k, {
      levelWidth: LEVEL_WIDTH,
      levelHeight: LEVEL_HEIGHT,
      startPosition,
    })
    if (player) {
      initMultiplayer({
        k,
        player,
        startPosition,
      })
    }
  }, 500)


}
