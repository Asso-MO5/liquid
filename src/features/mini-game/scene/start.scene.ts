import type kaplay from "kaplay";
import { gameState } from "../game-state";
import { createPlayer } from "../entities/player";
import { FONTS } from "../mini-game.const";
import { createMachine } from "../entities/machine";
import { createScreen } from "../entities/screen";

export function createStartScene(gameInstance: ReturnType<typeof kaplay> | null, { BASE_URL }: { BASE_URL: string }) {

  if (!gameInstance) return;

  // ============================== LOAD RESOURCES ==============================
  gameInstance.loadSprite('background', `${BASE_URL}/tiles/start.png`);

  // ============================== STATE ==============================

  gameState.level = 1;
  gameState.isGameStarted = true;

  const levelWidth = 3376;
  const levelHeight = 480;

  const GROUND_Y = 156;

  // ============================== LEVEL ==============================

  gameInstance!.add([
    gameInstance!.sprite('background'),
    gameInstance!.pos(0, -84),
    gameInstance!.anchor('topleft'),
    gameInstance!.z(-100),
  ]);

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
  ]);

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
  ]);

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
  ]);

  const lang = window.location.pathname.split('/')[1] || 'fr';

  const texts = {
    welcome: {
      fr: "Bienvenue\nau Musée du jeu vidéo",
      en: "Welcome\nto the Video Game Museum",
    },
  }

  const isPortrait = window.innerWidth < window.innerHeight;

  const startPosition = isPortrait ? { x: 170, y: 140 } : { x: 200, y: 140 };

  // ============================== ENTITIES ==============================

  createPlayer(gameInstance, { levelWidth, levelHeight, BASE_URL, startPosition });

  gameInstance.add([
    gameInstance.text(texts.welcome[lang as keyof typeof texts.welcome], {
      font: FONTS.SILKSCREEN,
      size: 8,
      align: "center",
      lineSpacing: 2,
      letterSpacing: 2,
      width: 100
    }),
    gameInstance.z(-50),
    gameInstance.pos(152, 60),
  ]);


  // Pattern d'écarts qui se répète : 49, 44, 54, 45
  const spacingPattern = [49, 44, 54, 45];
  const startX = 232;
  const numberOfFurniture = 64;

  const furniturePositions = Array.from({ length: numberOfFurniture }, (_, index) => {
    if (index === 0) {
      return { x: startX, y: GROUND_Y - 40 };
    }
    let x = startX;
    for (let i = 0; i < index; i++) {
      x += spacingPattern[i % spacingPattern.length];
    }
    return { x, y: GROUND_Y - 40 };
  });

  for (const position of furniturePositions) {
    createScreen(gameInstance, { position });
  }

  createMachine(gameInstance, { position: { x: 200, y: GROUND_Y - 32 }, spriteName: 'computer-space', idPanel: '11517969-f1f4-49ab-bf5f-8862b1f4db76' });

}