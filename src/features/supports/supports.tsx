import { For, createMemo } from "solid-js"
import { supportsTestimonials } from "./supports.const"
import { translate } from "~/utils/translate"
import { texts } from "./supports.txt"

const shuffleOrder = (): number[] => {
  const shuffled = Array.from(Array(supportsTestimonials.length).keys())
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export const Supports = () => {
  const { t } = translate(texts)
  const order = createMemo(() => shuffleOrder())
  let visibleNumber = 0

  return (
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-4xl text-center">{t().title}</h2>
      <ul role="list" class="flex flex-col gap-12">
        <For each={supportsTestimonials}>
          {(testimonial) => {
            const trans = translate({
              fr: { name: testimonial.name, image: testimonial.image, quote: testimonial.quote.fr, link: testimonial.link.fr },
              en: { name: testimonial.name, image: testimonial.image, quote: testimonial.quote.en, link: testimonial.link.en },
            })

            const nonReactiveIndex = supportsTestimonials.findIndex((t) => testimonial.name === t.name)
            const orderIndex = order().find((_, pos) => pos === nonReactiveIndex)
            let visible = false
            let reverse = false

            if (orderIndex && orderIndex <= 3) {
              visible = true
              visibleNumber = visibleNumber + 1
              reverse = visibleNumber % 2 === 0
            }

            return (
              <li data-visible={visible} data-reverse={reverse} class="hidden flex-col gap-4 items-center data-[visible=true]:flex md:flex-row data-[reverse=true]:md:flex-row-reverse">
                <div class="flex md:justify-start justify-center items-center flex-col gap-3 flex-grow min-w-3xs">
                  <h3 class="text-center m-0 md:whitespace-nowrap">{trans.t().name}</h3>
                  <img src={trans.t().image} alt="" class="w-32 h-auto rounded-full object-cover" />
                  <a href={trans.t().link} target="_blank" rel="noopener noreferrer" class="btn btn-sm mt-4 inline-block" aria-label={`${t().ariaLabel}${trans.t().name}`}>
                    {t().readMore}
                  </a>
                </div>
                <blockquote class="mb-8 italic">
                  <span class="text-secondary text-lg" aria-hidden="true">
                    &quot;&nbsp;
                  </span>
                  {trans.t().quote}
                  <span class="text-secondary text-lg" aria-hidden="true">
                    &nbsp;&quot;
                  </span>
                </blockquote>
              </li>
            )
          }}
        </For>
      </ul>
    </div>
  )
}
