import type kaplay from "kaplay";
import { gameState } from "../game-state";
import { createPlayer } from "../entities/player";

export function createStartScene(gameInstance: ReturnType<typeof kaplay> | null, { BASE_URL }: { BASE_URL: string }) {

  if (!gameInstance) return;

  // ============================== LOAD RESOURCES ==============================

  gameInstance.loadSprite('background', `${BASE_URL}/tiles/start.png`);

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

  // ============================== ENTITIES ==============================
  createPlayer(gameInstance, {
    levelWidth,
    levelHeight,
    BASE_URL,
  });


}