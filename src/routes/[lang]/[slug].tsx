import { Meta, Title } from "@solidjs/meta";
import { query, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Suspense, ErrorBoundary, createMemo } from "solid-js";
import { legalLinks, resourcesLinks } from "~/ui/footer/footer.const";
import { Loader } from "~/ui/loader";


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

  const title = page()?.title?.rendered ? `${page().title.rendered} - Le musée du jeu vidéo` : 'Le musée du jeu vidéo'
  const description = page()?.excerpt?.rendered || ''

  return (
    <div class="container max-w-xl mx-auto px-4 py-8 text-text">
      <ErrorBoundary fallback={<div>Une erreur est survenue lors du chargement de la page.</div>}>
        <Suspense fallback={<div class="flex items-center justify-center p-3"><Loader /></div>}>
          {
            <>
              <Title>{title}</Title>
              <Meta name="description" content={description} />
              {page()?.keywords && <Meta name="keywords" content={page().keywords.join(', ')} />}
              <article class="prose prose-invert max-w-none">
                {page()?.title?.rendered && (
                  <h1 class="text-5xl text-tertiary text-center font-display">{page().title.rendered}</h1>
                )}
                {page()?.content?.rendered && (
                  // eslint-disable-next-line solid/no-innerhtml
                  <div innerHTML={page().content.rendered} class="text-text" />
                )}
              </article>
            </>
          }
        </Suspense>
      </ErrorBoundary>
    </div>

  );
};

export default Page;