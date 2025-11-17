import { type VoidComponent } from "solid-js";

const Home: VoidComponent = () => {

  return (
    <main class="flex flex-col items-center justify-center relative h-full ">
      <div class="absolute inset-0 overflow-y-auto flex flex-col items-center">
        content
      </div>
    </main >
  );
};

export default Home;