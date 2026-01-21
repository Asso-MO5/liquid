import { Meta, Title } from "@solidjs/meta";
import { query, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Suspense, ErrorBoundary, createMemo, For, Show } from "solid-js";
import { Address } from "~/features/address/address";
import { prices } from "~/features/price/price.store";
import { schedules } from "~/features/schedules/schedules.store";
import { TakeATicket } from "~/features/ticket/take-a-ticket";
import { Loader } from "~/ui/loader";
import { translate } from "~/utils/translate";

export const texts = {
  fr: {
    openingHours: 'Horaires d\'ouverture',
    prices: 'Tarifs',
    holiday: 'Vacances scolaires uniquement',
  },
  en: {
    openingHours: 'Opening Hours',
    prices: 'Prices',
    holiday: 'School holidays only',
  }
}

const DAYS_FULL = {
  fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
const getPage = query(async (lang: string) => {
  'use server'
  const blogUrl = process.env.BLOG_URL || import.meta.env.VITE_BLOG_URL;

  if (!blogUrl) {
    throw new Error('BLOG_URL is not defined in environment variables');
  }

  const PAGE_ID = 12;
  const response = await fetch(`${blogUrl}/pages/${PAGE_ID}?lang=${lang}`);
  return response.json();
}, "lang");

export const route = {
  preload: ({ params }) => getPage(params.lang),
} satisfies RouteDefinition;

export const Page = () => {
  const params = useParams<{ lang: string, slug: string }>();
  const queryKey = createMemo(() => `${params.lang}`);

  const page = createAsync(() => {
    void queryKey();
    return getPage(params.lang);
  });

  const title = createMemo(() => {
    const pageData = page()
    return pageData?.title?.rendered ? `${pageData.title.rendered} - Le musée du jeu vidéo` : 'Le musée du jeu vidéo'
  })
  const description = createMemo(() => {
    const pageData = page()
    return pageData?.excerpt?.rendered || ''
  })

  const regularSchedules = createMemo(() => {
    return schedules().filter(schedule =>
      !schedule.is_exception &&
      !schedule.is_closed
    ).sort((a, b) => a.day_of_week - b.day_of_week);
  });

  const activePrices = createMemo(() => {
    return prices().filter(price => price.is_active);
  });

  // Formater l'heure (HH:MM:SS -> HH:MM)
  const formatTime = (time: string) => {
    return time.split(':').slice(0, 2).join(':');
  };

  const { t } = translate(texts)
  const lang = () => params.lang as 'fr' | 'en'

  return (
    <main id="main" class="container max-w-xl mx-auto px-4 py-8 text-text">
      <ErrorBoundary fallback={<div>Une erreur est survenue lors du chargement de la page.</div>}>
        <Suspense fallback={<div class="flex items-center justify-center p-3"><Loader /></div>}>
          {
            <>
              <Title>{title()}</Title>
              <Meta name="description" content={description()} />
              {page()?.keywords && <Meta name="keywords" content={page().keywords.join(', ')} />}

              <Address />
              <article class="prose prose-invert max-w-none">

                {page()?.content?.rendered && (
                  // eslint-disable-next-line solid/no-innerhtml
                  <div innerHTML={page().content.rendered} />
                )}
              </article>

              <div class="flex flex-col gap-8">
                {/* Section Horaires */}
                <Show when={regularSchedules().length > 0}>
                  <section class="mb-8">
                    <h2>
                      {t().openingHours}
                    </h2>
                    <div class="flex flex-col gap-3">
                      <For each={regularSchedules()}>
                        {(schedule) => (
                          <div class="flex justify-between items-center border-b border-primary/30 pb-2">
                            <span class="font-medium flex gap-2">
                              {DAYS_FULL[lang()][schedule.day_of_week]}
                              <Show when={schedule.audience_type == 'holiday'}>
                                <span class="text-secondary italic text-sm">
                                  {`(${t().holiday})`}
                                </span>
                              </Show>
                            </span>
                            <span class="text-primary">
                              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                            </span>
                          </div>
                        )}
                      </For>
                    </div>
                  </section>
                </Show>

                {/* Section Tarifs */}
                <Show when={activePrices().length > 0}>
                  <section class="mb-8">
                    <h2>
                      {t().prices}
                    </h2>
                    <div class="flex flex-col gap-3">
                      <For each={activePrices()}>
                        {(price) => (
                          <div class="flex justify-between items-start 
                        gap-4 border border-primary p-4 rounded-md"
                          >
                            <div class="flex-1">
                              {(() => {
                                const { t } = translate({
                                  fr: { name: price.translations.fr?.name || '', description: price.translations.fr?.description || '' },
                                  en: { name: price.translations.en?.name || '', description: price.translations.en?.description || '' }
                                })
                                return (
                                  <>
                                    <h3 class=" text-xl mb-1 text-primary">
                                      {t().name}
                                    </h3>
                                    <Show when={t().description}>
                                      <p class="text-sm text-text italic">
                                        {t().description}
                                      </p>
                                    </Show>
                                  </>
                                )
                              })()}
                            </div>
                            <div class="text-xl text-secondary">
                              <span class="text-text">{price.amount}</span><span class="text-secondary">€</span>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </section>
                </Show>
              </div>
              <TakeATicket />
            </>
          }
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default Page;