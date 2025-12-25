import { For, createMemo } from "solid-js"
import { supportsTestimonials } from "./supports.const"
import { translate } from "~/utils/translate"
import { texts } from "./supports.txt"

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const Supports = () => {
  const { t } = translate(texts)
  const randomTestimonials = createMemo(() => {
    return shuffleArray(supportsTestimonials).slice(0, 3)
  })

  return (
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-4xl text-center">{t.title}</h2>
      <ul class="flex flex-col gap-12">
        <For each={randomTestimonials()}>
          {(testimonial, index) => (
            <li class="flex flex-col gap-4 items-center">
              <div
                data-odd={index() % 2 === 0}
                class="flex gap-6 items-center justify-center
                data-[odd=false]:md:flex-row-reverse
                data-[odd=true]:md:flex-row flex-col">
                <div class="flex md:justify-start justify-center items-center flex-col gap-3 flex-grow">
                  <h3 class="text-center m-0 md:whitespace-nowrap">{testimonial.name}</h3>
                  <img src={testimonial.image} alt="" class="w-32 h-auto rounded-full object-cover" />
                </div>
                <blockquote class="italic mb-8">
                  <span class="text-secondary text-lg" aria-hidden="true">&quot;&nbsp;</span>
                  {(() => {
                    const { t } = translate({ fr: { quote: testimonial.quote.fr }, en: { quote: testimonial.quote.en } })
                    return t.quote
                  })()}
                  <span class="text-secondary text-lg" aria-hidden="true">&nbsp;&quot;</span>
                </blockquote>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}