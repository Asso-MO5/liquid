export const getBrowserLang = (): "fr" | "en" => {
  if (typeof window === "undefined") return "fr";

  const browserLang = navigator.language ||
    (navigator as { userLanguage?: string }).userLanguage ||
    "fr";
  const langCode = browserLang.split("-")[0].toLowerCase();

  if (langCode === "en") {
    return "en";
  }
  return "fr";
};