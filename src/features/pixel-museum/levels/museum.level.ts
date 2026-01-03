import type kaplay from "kaplay";
import { FONTS, SOUNDS, SPRITES } from "../pixel-museum.const";
import { volume } from "../pixel-museum-sound.ctrl";
import { pixelMuseumState } from "../pixel-museum.state";
import { createPlayer } from "../entities/player.create";


const texts = {
  welcome: {
    fr: 'Bienvenue\nau Musée du jeu vidéo',
    en: 'Welcome\nto the Video Game Museum',
  },
}

const levelWidth = 2104
const levelHeight = 302
const GROUND_Y = 156

export const museumLevel = (k: ReturnType<typeof kaplay> | null) => {

  if (!k) return console.error('kaplay non trouvé');
  k.setGravity(1500);

  pixelMuseumState.musicSound?.stop?.()
  pixelMuseumState.musicSound = k.play(SOUNDS.BYTHEPOND, { loop: true, volume: volume() });


  // Background
  k.add([
    k.sprite(SPRITES.MUSEUM),
    k.pos(0, 73),
    k.anchor('left'),
    k.z(-100),
  ])

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
    k.pos(levelWidth - 94, 155),
    k.anchor('botright'),
    k.area(),
    k.offscreen({ hide: true }),
    k.opacity(0),
    k.body({ isStatic: true }),
    'platform',
  ])

  // Sol statique
  k.add([
    k.rect(levelWidth, 1),
    k.pos(0, GROUND_Y),
    k.area(),
    k.body({ isStatic: true }),
    k.offscreen({ hide: true }),
    k.opacity(0),
    'platform',
    'ground',
  ])



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
    k.pos(152, 60),
  ])


  const isPortrait = window.innerWidth < window.innerHeight

  const startPosition = isPortrait ? { x: 840, y: 140 } : {
    x: import.meta.env.DEV ? 840 : 840,
    y: 140,
  }

  createPlayer(k, {
    levelWidth,
    levelHeight,
    startPosition,
  })

}