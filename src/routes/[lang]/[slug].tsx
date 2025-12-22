import { MetaProvider, Meta, Title } from "@solidjs/meta";
import { query, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Suspense, ErrorBoundary, createMemo } from "solid-js";
import { legalLinks, resourcesLinks } from "~/ui/footer/footer.const";
import { Loader } from "~/ui/loader";

const texts = {
  fr: {
    error: 'Une erreur est survenue lors du chargement de la page.',
    baseline: 'Le Musée du Jeu Vidéo',
  },
  en: {
    error: 'An error occurred while loading the page.',
    baseline: 'The Video Game Museum',
  }
}

const getPage = query(async (lang: string, slug: string) => {
  'use server'
  const blogUrl = process.env.BLOG_URL || import.meta.env.VITE_BLOG_URL;

  if (!blogUrl) {
    throw new Error('BLOG_URL is not defined in environment variables');
  }

  const pageConfig = [...legalLinks, ...resourcesLinks].find((page) => page.href === "/" + slug)

  if (!pageConfig) {
    throw new Error(`Page slug "${slug}" not found`);
  }
  const response = await fetch(`${blogUrl}/pages/${pageConfig.id}?lang=${lang}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}, "lang");

export const route = {
  preload: ({ params }) => getPage(params.lang, params.slug),
} satisfies RouteDefinition;

export const Page = () => {
  const params = useParams<{ lang: string, slug: string }>();
  const queryKey = createMemo(() => `${params.lang}-${params.slug}`);

  const page = createAsync(() => {
    void queryKey();
    return getPage(params.lang, params.slug);
  });

  
  const lang = () => params.lang as 'fr' | 'en';
  // @TODO Suspense + Meta ne semble pas fonctionner, le changement n'est pas déclenché sans rechargement
  console.log(page()?.title?.rendered);
  const title = page()?.title?.rendered ? `${page().title.rendered} - ${texts[lang()].baseline}` : texts[lang()].baseline;
  const description = page()?.excerpt?.rendered || ''

  return (
      <ErrorBoundary fallback={<div>{texts[lang()].error}</div>}>
        <Suspense fallback={<div class="flex items-center justify-center p-3"><Loader /></div>}>
          {
            <>
              <MetaProvider>
                <Title>{title}</Title>
                <Meta name="description" content={description} />
                {page()?.keywords && <Meta name="keywords" content={page().keywords.join(', ')} />}
              </MetaProvider>

              <main id="main" class="container max-w-xl mx-auto px-4 py-8 text-text">
                <article class="prose prose-invert max-w-none">
                  {page()?.title?.rendered && (
                    <h1 class="text-5xl text-tertiary text-center font-display">{page().title.rendered}</h1>
                  )}
                  {page()?.content?.rendered && (
                    // eslint-disable-next-line solid/no-innerhtml
                    <div innerHTML={page().content.rendered} class="text-text" />
                  )}
                </article>
              </main>
            </>
          }
        </Suspense>
      </ErrorBoundary>

  );
};

export default Page;