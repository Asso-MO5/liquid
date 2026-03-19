import { type VoidComponent } from "solid-js";
import { GameAlternative } from "~/features/pixel-museum/game-alternative"

const GameAlternativePage: VoidComponent = () => {
  return (
    <main id="main" class="container max-w-xl mx-auto px-4 py-8 text-text">
      <GameAlternative />
    </main >
  );
};

export default GameAlternativePage;