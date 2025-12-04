import { A } from "@solidjs/router";
import { langCtrl } from "../lang-selector/lang.ctrl";

const txt = {
  fr: {
    title: "Acheter un billet",
  },
  en: {
    title: "Get a ticket",
  },
};

export const TakeATicket = () => {
  const lang = langCtrl();
  return (
    <div class="flex justify-center items-center p-4">
      <A
        class="btn p-6"
        href={`/${lang()}/ticket`}>{txt[lang() as keyof typeof txt].title}</A>
    </div>
  );
};