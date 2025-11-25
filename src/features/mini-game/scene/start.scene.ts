import type kaplay from "kaplay";
import { gameState } from "../game-state";
import { createPlayer } from "../entities/player";
import { createComputerSpace } from "../entities/computer-space";

export function createStartScene(gameInstance: ReturnType<typeof kaplay> | null, { BASE_URL }: { BASE_URL: string }) {

  if (!gameInstance) return;

  // ============================== LOAD RESOURCES ==============================

  const FONTS = {
    SILKSCREEN: "Silkscreen",
    SILKSCREEN_BOLD: "Silkscreen-Bold",
  }

  gameInstance.loadSprite('background', `${BASE_URL}/tiles/start.png`);

  gameInstance.loadFont(FONTS.SILKSCREEN, `${BASE_URL}/fonts/Silkscreen/Silkscreen-Regular.ttf`);
  gameInstance.loadFont(FONTS.SILKSCREEN_BOLD, `${BASE_URL}/fonts/Silkscreen/Silkscreen-Bold.ttf`);


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

  gameInstance.add([
    gameInstance.pos(152, 60),
    // Render text with the text() component
    gameInstance.text(texts.welcome[lang as keyof typeof texts.welcome], {
      font: FONTS.SILKSCREEN,
      size: 7,
      align: "center",
      lineSpacing: 2,
    }),
  ]);

  const isPortrait = window.innerWidth < window.innerHeight;

  const startPosition = isPortrait ? { x: 170, y: 140 } : { x: 170, y: 140 };

  // ============================== ENTITIES ==============================
  createPlayer(gameInstance, { levelWidth, levelHeight, BASE_URL, startPosition });


  createComputerSpace(gameInstance, { position: { x: 200, y: GROUND_Y - 32 }, BASE_URL });




}