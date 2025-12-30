import { txt } from './skip-links.txt'
import { translate } from "~/utils/translate";

export const SkipLinks = () => {
  const { t } = translate(txt);

  return <a href="#main" class="border-2 border-primary bg-bg text-text text-xl m-2 p-4 absolute z-60 -translate-y-30 focus:translate-y-0">{t['main']}</a>;
}
