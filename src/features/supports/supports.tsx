import { For } from "solid-js"
import { supportsTestimonials } from "./supports.const"
import { langCtrl } from "../lang-selector/lang.ctrl"


const texts = {
  fr: {
    title: 'Ils nous soutiennent',
  },
  en: {
    title: 'They support us',
  }
}
export const Supports = () => {
  const lang = langCtrl()
  return (
    <div class="flex flex-col gap-12 max-w-4xl mx-auto p-6">
      <h2 class="text-4xl text-center">{texts[lang()].title}</h2>
      <For each={supportsTestimonials}>
        {(testimonial, index) => (
          <div class="flex flex-col gap-4 items-center">
            <div
              data-odd={index() % 2 === 0}
              class="flex gap-6 items-center justify-center
              data-[odd=false]:md:flex-row
              data-[odd=true]:md:flex-row-reverse flex-col-reverse">
              <p class="italic"><span class="text-secondary text-lg">&quot; </span>{testimonial.quote[lang()]}
                <span class="text-secondary text-lg">&quot;</span>
              </p>
              <div class="flex md:justify-start justify-center items-center flex-col gap-3 flex-grow">
                <h3 class="text-center m-0 md:whitespace-nowrap">{testimonial.name}</h3>
                <img src={testimonial.image} alt={testimonial.name} class="w-32 h-auto  rounded-full object-cover" />
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  )
}