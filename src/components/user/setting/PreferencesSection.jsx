import React, { useEffect, useState } from "react";
import { LANGUAGES, saveLanguage } from "../../../configuration/languages";
import styles from "../../../styles/pages/setting/settingPage.module.scss";
import i18n from "../../../configuration/i18n";

// The app's language (the same choice as the navbar). More preferences, saved on
// the server, come in phase 2: default account, base currency, first day of the week.
const PreferencesSection = () => {
  const [current, setCurrent] = useState(i18n.language);

  // the navbar can change it too
  useEffect(() => {
    const follow = (code) => setCurrent(code);
    i18n.on("languageChanged", follow);
    return () => i18n.off("languageChanged", follow);
  }, []);

  const choose = (code) => {
    i18n.changeLanguage(code);
    saveLanguage(code);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{i18n.t("settings.preferences.title")}</h2>
      <div>
        <p className={styles.label} id="settings-language">
          {i18n.t("settings.preferences.language")}
        </p>
        <div className={styles.choices} role="group" aria-labelledby="settings-language">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={styles.choice}
              lang={lang.code}
              aria-pressed={current === lang.code}
              onClick={() => choose(lang.code)}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreferencesSection;