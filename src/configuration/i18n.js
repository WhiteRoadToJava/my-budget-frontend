import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/translation.json";
import ar from "../locales/ar/translation.json";
import sv from "../locales/sv/translation.json";
import { DEFAULT_LANGUAGE, storedLanguage } from "./languages";

// started with the saved language (Arabic for a first visit), so the first
// screen is already in the right language and direction
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    sv: { translation: sv },
  },
  lng: storedLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

const applyDocumentLanguage = (language) => {
  if (typeof document === "undefined") return; // tests run without a page
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
};
i18n.on("languageChanged", applyDocumentLanguage);
applyDocumentLanguage(i18n.language);

export default i18n;
