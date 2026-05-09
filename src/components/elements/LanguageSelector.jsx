import React, { useState } from "react";
import { useTransition } from "react";
import i18n from "../../configuration/i18n";
import styles from "../../styles/elements/languageSelector.module.scss";


const languages = [
  { code: "en", label: "English", native: "English", flag: "GB", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "SA", dir: "rtl" },
  { code: "fr", label: "French", native: "Français", flag: "FR", dir: "ltr" },
];
const LanguageSelector = () => {
  const [open, setOpen] = useState(false);




  const current =
    languages.find((l) => l.code === i18n.language) ?? languages[0];

  const handleSelect = (lang) => {
    i18n.changeLanguage(lang.code);
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;
      localStorage.setItem("language", lang.code);
    setOpen(false);
  };

  return (
    <div className={styles.languageSelectorContainer}>
      <button className={styles.languageSelectorButton} onClick={() => setOpen(!open)}>
        <span className={styles.langLabel}>{current.label}</span>
        <span className={styles.langCode}>{current.code}</span>
        <span className={styles.langArrow}>▾</span>
      </button>

      {open && (
        <div className={styles.languageOptions}
        >
          {languages.map((lang) => (
            <button
              className={styles.langOption }
              key={lang.code}
              onClick={() => handleSelect(lang)}
            >
              <span className={styles.langLabel}>{lang.label}</span>
              <span className={styles.langNative}>{lang.native}</span>
              {lang.code === current.code && (
                <span className={styles.checkIcon}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
