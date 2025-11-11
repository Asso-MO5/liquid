import * as me from 'melonjs'

// Écran de chargement minimaliste (ne rend rien)
export class LoadingScreen extends me.Stage {
  onResetEvent() {
    // Ne rien afficher pendant le chargement
    // Optionnel: définir un fond transparent/noir si besoin
    // me.game.world.addChild(new me.ColorLayer('bg', '#000', 0));
  }

  onDestroyEvent() {
    // Rien à nettoyer
  }
}


