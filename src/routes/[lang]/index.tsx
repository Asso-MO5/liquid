import type { VoidComponent } from "solid-js";
import { Address } from "~/features/address/address";
import { Asso } from "~/features/asso/asso";
import { Pictures } from "~/features/pictures/pictures";
import { Supports } from "~/features/supports/supports";
import { TakeATicket } from "~/features/ticket/take-a-ticket";

import { TalkAboutUs } from "~/features/talkAboutUs/TalkAboutUs";

const Home: VoidComponent = () => {
  return (
    <main id="main" class="flex flex-col gap-12 p-4">
      <div class="grid grid-rows-1 md:grid-cols-2 flex-wrap gap-2 w-full md:justify-between justify-center items-center">
        <Address />
        <TakeATicket />
      </div>
      <Asso />
      <Supports />
      <Pictures />
      <TakeATicket />
      <TalkAboutUs />
    </main >
  );
};

export default Home;