import { type VoidComponent } from "solid-js";
import { MiniGame } from "~/features/mini-game/mini-game";


const Game: VoidComponent = () => {

  return (
    <main class="h-full w-full">
      <MiniGame />
    </main>
  );
};

export default Game;