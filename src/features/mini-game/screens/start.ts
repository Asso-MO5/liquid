import * as me from 'melonjs'
import { gameState } from '../game-state';
import { Player } from '../entities/player';

export class StartScreen extends me.Stage {

  onResetEvent() {
    gameState.level = 1

    me.level.load('start', {
      onLoaded: () => {
        me.game.world.backgroundColor = new me.Color(190, 214, 253, 1);


        me.game.viewport.scale(2);

        const spawnX = 100;
        const spawnY = 200;

        const player = new Player(spawnX, spawnY, 32, 32);
        me.game.world.addChild(player, 1);


        me.game.viewport.moveTo(spawnX, 70);
      }
    });

    me.game.viewport.fadeOut('#000', 150);
  }
}