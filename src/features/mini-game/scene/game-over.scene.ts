import type kaplay from "kaplay";
import { LEVEL_NAMES, FONTS } from '../mini-game.const';
import { getBrowserLang } from '../../../utils/get-browser-lang';

const texts = {
  gameOver: {
    fr: 'GAME OVER',
    en: 'GAME OVER',
  },
  distance: {
    fr: 'Distance parcourue',
    en: 'Distance traveled',
  },
  restart: {
    fr: 'Recommencer',
    en: 'Restart',
  },
  backToStart: {
    fr: 'Revenir au menu',
    en: 'Return to menu',
  },
};

export function createGameOverScene(
  gameInstance: ReturnType<typeof kaplay> | null,
  { score = 0 }: { BASE_URL?: string; score?: number }
) {
  if (!gameInstance) return;

  const lang = getBrowserLang();
  const km = Math.floor(score / 1000); // Convertir pixels en km

  // Fond noir
  gameInstance.add([
    gameInstance.rect(gameInstance.width(), gameInstance.height()),
    gameInstance.pos(0, 0),
    gameInstance.color(0, 0, 0),
    gameInstance.z(-100),
    gameInstance.fixed(),
  ]);

  // Titre GAME OVER
  gameInstance.add([
    gameInstance.text(texts.gameOver[lang], {
      size: 10,
      font: FONTS.SILKSCREEN_BOLD,
    }),
    gameInstance.pos(gameInstance.width() / 2, gameInstance.height() / 2 - 40),
    gameInstance.color(255, 0, 0),
    gameInstance.z(100),
    gameInstance.fixed(),
    gameInstance.anchor('center'),
  ]);

  // Score (distance)
  gameInstance.add([
    gameInstance.text(`${texts.distance[lang]}: ${km} KM`, {
      size: 4,
      font: FONTS.SILKSCREEN,
    }),
    gameInstance.pos(gameInstance.width() / 2, gameInstance.height() / 2),
    gameInstance.color(255, 255, 255),
    gameInstance.z(100),
    gameInstance.fixed(),
    gameInstance.anchor('center'),
  ]);

  // Instructions - E pour recommencer
  gameInstance.add([
    gameInstance.text(`E - ${texts.restart[lang]}`, {
      size: 4,
      font: FONTS.SILKSCREEN,
    }),
    gameInstance.pos(gameInstance.width() / 2, gameInstance.height() / 2 - 25),
    gameInstance.color(200, 200, 200),
    gameInstance.z(100),
    gameInstance.fixed(),
    gameInstance.anchor('center'),
  ]);

  // Instructions - F pour revenir au menu
  gameInstance.add([
    gameInstance.text(`F - ${texts.backToStart[lang]}`, {
      size: 4,
      font: FONTS.SILKSCREEN,
    }),
    gameInstance.pos(gameInstance.width() / 2, gameInstance.height() / 2 - 18),
    gameInstance.color(200, 200, 200),
    gameInstance.z(100),
    gameInstance.fixed(),
    gameInstance.anchor('center'),
  ]);

  // Gérer les actions : E pour recommencer, F pour revenir au menu
  gameInstance.onKeyPress(['e'], () => {
    gameInstance.go(LEVEL_NAMES.MOON_PATROL);
  });

  gameInstance.onKeyPress(['f'], () => {
    gameInstance.go(LEVEL_NAMES.START);
  });
}

