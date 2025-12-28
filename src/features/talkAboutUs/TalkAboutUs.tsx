import { For, Show } from "solid-js";
import { langCtrl } from "~/features/lang-selector/lang.ctrl";
import { translate } from "~/utils/translate";
import { talkAboutUsCtrl } from "./talkAboutUs.ctrl";
import { txt } from "./talkAboutUs.txt";
import type { Media } from "./talkAboutUs.type";
import { Loader } from "~/ui/loader";

export const TalkAboutUs = () => {
  const { t } = translate(txt);
  const lang = langCtrl();
  const { fetching, talkAboutUs } = talkAboutUsCtrl();

  const getMediaTitle = (media: Media) => {
    const customFields = media.custom_fields;
    const langKey = lang() === 'fr' ? 'FR' : 'EN';
    return customFields?.[langKey as keyof typeof customFields]?.[0] || media.title.rendered || '';
  };

  const getMediaDescription = (media: Media) => {
    const customFields = media.custom_fields;
    const langKey = lang() === 'fr' ? 'FR' : 'EN';
    return customFields?.[langKey as keyof typeof customFields]?.[1] || '';
  };

  const getYouTubeUrl = (media: Media) => {
    const youtubeUrl = media.custom_fields?.Youtube?.[0];
    if (!youtubeUrl) return null;

    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = youtubeUrl.match(youtubeRegex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    if (youtubeUrl.includes('youtube.com/embed')) {
      return youtubeUrl;
    }

    return null;
  };

  const getExternalUrl = (media: Media) => {
    return media.custom_fields?.URL?.[0] || null;
  };

  const getImageSrcSet = (media: Media) => {
    const sizes = media.sizes;
    if (!sizes) return '';

    const srcset = [];
    if (sizes.medium?.source_url) {
      srcset.push(`${sizes.medium.source_url} 768w`);
    }
    if (sizes.large?.source_url) {
      srcset.push(`${sizes.large.source_url} 1024w`);
    }
    if (sizes.full?.source_url) {
      srcset.push(`${sizes.full.source_url} 1920w`);
    }
    return srcset.join(', ');
  };

  const getImageSizes = () => {
    return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
  };

  const getImageSrc = (media: Media) => {
    return media.sizes?.medium?.source_url || media.sizes?.large?.source_url || media.sizes?.full?.source_url || media.source_url || '';
  };

  return (
    <section class="flex flex-col gap-4 max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-center">{t.title}</h2>

      <Show when={fetching()}>
        <div class="flex justify-center items-center p-8">
          <Loader />
        </div>
      </Show>

      <Show when={!fetching() && talkAboutUs().length > 0}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <For each={talkAboutUs()}>
            {(media: Media) => {
              const title = getMediaTitle(media);
              const description = getMediaDescription(media);
              const youtubeUrl = getYouTubeUrl(media);
              const externalUrl = getExternalUrl(media);
              const imageSrc = getImageSrc(media);
              const imageSrcSet = getImageSrcSet(media);
              const imageSizes = getImageSizes();
              const altText = media.alt_text || title || '';

              return (
                <article class="flex flex-col rounded-t-lg overflow-hidden">
                  <div class="relative w-full aspect-video overflow-hidden bg-gray-200">
                    <Show when={youtubeUrl} fallback={
                      <Show when={imageSrc}>
                        <img
                          src={imageSrc}
                          srcset={imageSrcSet}
                          sizes={imageSizes}
                          alt={altText}
                          loading="lazy"
                          class="w-full h-full object-cover"
                        />
                      </Show>
                    }>
                      <iframe
                        src={youtubeUrl || ''}
                        title={title}
                        class="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      />
                    </Show>
                  </div>

                  <div class="flex flex-col gap-1 flex-1 justify-between">
                    <Show when={title}>
                      <h3 class="text-sm text-text font-family-sans">{title}</h3>
                    </Show>

                    <Show when={description}>
                      <p class="text-sm text-text line-clamp-3">{description}</p>
                    </Show>

                    <div class="flex gap-2 justify-end items-end">
                      <Show when={externalUrl}>
                        <a
                          href={externalUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn btn-sm"
                        >
                          {t.visitLink}
                        </a>
                      </Show>
                      <Show when={youtubeUrl && !externalUrl}>
                        <a
                          href={youtubeUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn btn-primary"
                        >
                          {t.watchVideo}
                        </a>
                      </Show>
                    </div>
                  </div>
                </article>
              );
            }}
          </For>
        </div>
      </Show>
    </section>
  );
}