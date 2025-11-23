import * as me from "melonjs";
import { Player } from './entities/player';
import { gameState } from './game-state';
import { ressources } from './ressources';
import { StartScreen } from './screens/start';
import { LoadingScreen } from './screens/loading';

let gameInitialized = false;

export const initGame = () => {
  if (gameInitialized) return me

  if (!me || !me.video) {
    console.error('melonJS not loaded');
    return;
  }

  gameInitialized = true;

  const containerRef = document.getElementById('mini-game-container') as HTMLDivElement | null;

  if (!containerRef) return me;

  const containerWidth = containerRef.clientWidth || 800;
  const containerHeight = containerRef.clientHeight || 600;

  me.device.onReady(() => {

    console.log('onReady')

    const initialized = me.video.init(containerWidth, containerHeight, {
      parent: "mini-game-container",
      scale: "auto",
      antiAlias: false,
      scaleMethod: "fit"
    });

    if (!initialized) {
      console.error("Failed to initialize melonJS canvas");
      return;
    }

    // Remplacer l'écran de chargement par défaut par un écran vide
    me.state.set(me.state.LOADING, new LoadingScreen());

    const canvas = containerRef?.querySelector('canvas') as HTMLCanvasElement | null;
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.boxSizing = 'border-box';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';
    }

    // === CONTROLS ===
    me.input.bindKey(me.input.KEY.LEFT, 'left')
    me.input.bindKey(me.input.KEY.RIGHT, 'right')
    me.input.bindKey(me.input.KEY.X, 'jump', true)
    me.input.bindKey(me.input.KEY.UP, 'jump', true)
    me.input.bindKey(me.input.KEY.SPACE, 'jump', true)
    me.input.bindKey(me.input.KEY.DOWN, 'down')

    me.input.bindKey(me.input.KEY.CTRL, 'interact', true)

    me.input.bindKey(me.input.KEY.Q, 'left')
    me.input.bindKey(me.input.KEY.D, 'right')
    me.input.bindKey(me.input.KEY.Z, 'jump', true)
    me.input.bindKey(me.input.KEY.S, 'down')





    // Initialiser l'audio
    me.audio.init("mp3,ogg");

    // Permettre cross-origin pour le chargement d'images/textures
    me.loader.setOptions({ crossOrigin: "anonymous" });

    // Utiliser les ressources avec des chemins absolus depuis la racine
    // Les fichiers dans public/ sont servis depuis la racine en production
    // On utilise des chemins absolus (commençant par /) qui fonctionnent en dev et prod
    const rsrcs = ressources.map(r => {
      const src = `${window.location.protocol}//${window.location.host}/${r.src}`;
      return { ...r, src };
    });

    me.loader.preload(rsrcs, () => {

      me.state.set(me.state.PLAY, new StartScreen())
      me.pool.register('lulu', Player)

      const luluJSON = me.loader.getJSON('lulu');
      if (!luluJSON) {
        console.error('❌ Erreur: lulu.json non chargé');
        console.error('Ressources disponibles:', Object.keys(me.loader.getJSON || {}));
        return;
      }

      const luluImage = me.loader.getImage('lulu');
      if (!luluImage) {
        console.error('❌ Erreur: lulu.png non chargé');
        return;
      }

      gameState.spriteData = luluJSON;
      gameState.texture = new me.TextureAtlas(
        luluJSON,
        luluImage
      )

      me.state.change(me.state.PLAY, false)
    })

  });

  return me;
};
