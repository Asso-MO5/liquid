import type kaplay from "kaplay";
import { gameState } from "../game-state";
import { createPlayer } from "../entities/player";

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

  // ============================== LEVEL ==============================

  gameInstance!.add([
    gameInstance!.sprite('background'),
    gameInstance!.pos(0, -100),
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
    gameInstance!.pos(0, 156),
    gameInstance!.area(),
    gameInstance!.body({ isStatic: true }),
    gameInstance!.color(255, 0, 0),
    gameInstance!.opacity(0),
    'platform',
    'ground',
  ]);



  gameInstance.add([
    gameInstance.pos(50, 50),
    // Render text with the text() component
    gameInstance.text("Type! And try arrow keys!", {
      // What font to use
      font: FONTS.SILKSCREEN,
      // It'll wrap to next line if the text width exceeds the width option specified here

      size: 10,
      // The height of character
      //  size: curSize,
      // Text alignment ("left", "center", "right", default "left")
      align: "center",
      lineSpacing: 8,
      letterSpacing: 4,

    }),
  ]);


  // ============================== ENTITIES ==============================
  createPlayer(gameInstance, {
    levelWidth,
    levelHeight,
    BASE_URL,
  });




}