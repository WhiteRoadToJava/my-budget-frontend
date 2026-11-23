import { useEffect } from "react";
import i18n from "../configuration/i18n";
import { saveLanguage } from "../configuration/languages";
import { usePreferences, useUpdatePreferences } from "./usePreferences";

// Keeps the app's language and the language saved on the server the same.
export const useLanguageSync = () => {
  const { preferences, isLoaded } = usePreferences();
  const { mutate } = useUpdatePreferences();
  const saved = preferences.language;

  // after login: apply the saved language, or save the current one if none yet
  useEffect(() => {
    if (!isLoaded) return;
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
      saveLanguage(saved);
    } else if (!saved) {
      mutate({ language: i18n.language });
    }
  }, [isLoaded, saved, mutate]);

  // a change from the navbar or the settings page is saved on the server
  useEffect(() => {
    if (!isLoaded) return undefined;
    const save = (code) => {
      if (code !== saved) mutate({ language: code });
    };
    i18n.on("languageChanged", save);
    return () => i18n.off("languageChanged", save);
  }, [isLoaded, saved, mutate]);
};