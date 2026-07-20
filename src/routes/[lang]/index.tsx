import type { VoidComponent } from 'solid-js'
import { Address } from '~/features/address/address'
import { Asso } from '~/features/asso/asso'
import { FeatureFlag } from '~/features/feature-flag/feature-flag'
import { Pictures } from '~/features/pictures/pictures'
import { Supports } from '~/features/supports/supports'
import { TalkAboutUs } from '~/features/talkAboutUs/TalkAboutUs'
import { TakeATicket } from '~/features/ticket/take-a-ticket'

const Home: VoidComponent = () => {
  return (
    <main id="main" class="flex flex-col gap-12 p-4">
      <FeatureFlag name="reservation">
        <div class="grid grid-cols-1  flex-wrap gap-2 w-full md:justify-between justify-center items-center md:grid-cols-2">
          <Address />
          <TakeATicket />
        </div>
      </FeatureFlag>
      <Asso />
      <Supports />
      <Pictures />
      <FeatureFlag name="reservation">
        <TakeATicket />
      </FeatureFlag>
      <TalkAboutUs />
    </main>
  )
}

export default Home
