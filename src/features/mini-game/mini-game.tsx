import type { VoidComponent } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import * as me from 'melonjs';
import { Player } from './entities/player';
import { gameState } from './game-state';
import { ressources } from './ressources';
import { StartScreen } from './screens/start';
import { LoadingScreen } from './screens/loading';

export const MiniGame: VoidComponent = () => {
  let containerRef: HTMLDivElement | undefined;

  onMount(async () => {
    if (typeof window === 'undefined' || !containerRef) {
      return;
    }

    const initGame = () => {
      if (!containerRef) return;

      const containerWidth = containerRef.clientWidth || 800;
      const containerHeight = containerRef.clientHeight || 600;


      if (!me || !me.video) {
        console.error('melonJS not loaded');
        return;
      }

      me.device.onReady(() => {
        console.log('MelonJS device ready');

        const initialized = me.video.init(containerWidth, containerHeight, {
          parent: containerRef,
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
          canvas.style.maxWidth = '100%';
          canvas.style.maxHeight = '100%';
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

        console.log('Chargement des ressources MelonJS:', rsrcs);
        console.log('URL actuelle:', window.location.href);

        me.loader.preload(rsrcs, () => {
          console.log('✅ Toutes les ressources sont chargées');

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

          console.log('✅ Texture du joueur créée');
          me.state.change(me.state.PLAY, false)
        })


      });
    };

    initGame()
  });

  onCleanup(() => {
    // Nettoyer melonJS si nécessaire (uniquement côté client)
    if (typeof window !== 'undefined' && me && me.state) {
      try {
        me.state.change(me.state.DEFAULT, true);
      } catch (e) {
        // Ignorer les erreurs de nettoyage
        console.warn('Erreur lors du nettoyage de melonJS:', e);
      }
    }
  });

  return (
    <div
      id="mini-game-container"
      ref={containerRef}
      class="w-full h-full relative overflow-hidden"

    />
  );
};
