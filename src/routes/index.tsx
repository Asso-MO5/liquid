import { type VoidComponent } from "solid-js";
import { Layout } from "~/ui/Layout/Layout";


const Home: VoidComponent = () => {

  return (
    <Layout>
      <main class="flex flex-col items-center justify-center relative h-full ">
        <div class="absolute inset-0 overflow-y-auto flex flex-col items-center">
          content
        </div>
      </main >
    </Layout>
  );
};

export default Home;