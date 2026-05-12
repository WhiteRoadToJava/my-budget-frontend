import React, { useState } from "react";
import i18n from "../../configuration/i18n";
import styles from "../../styles/elements/languageSelector.module.scss";
import { flags } from "../../assiets/assiits";

const languages = [
    {
    code: "ar",
    label: "Arabic",
    native: "العربية",
    flag: flags.saudiAribian_flag,
    dir: "rtl",
  },
  {
    code: "en",
    label: "English",
    native: "English",
    flag: flags.england_flag,
    dir: "ltr",
  },

  {
    code: "sw",
    label: "swedish",
    native: "svenska",
    flag: flags.swedish_flag,
    dir: "ltr",
  },
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
    console.log(flags)
  };

  return (
    <div className={styles.languageSelectorContainer}>
      <button
        className={styles.languageSelectorButton}
        onClick={() => setOpen(!open)}
      >
        <img src={current.flag} width={15} />
      </button>

      {open && (
        <div className={styles.languageOptions}>
          {languages.map((lang) => (
            <button
              className={styles.langOption}
              key={lang.code}
              onClick={() => handleSelect(lang)}
            >
              <span className={styles.langLabel}>
                {current.code === lang.code ? "   ✓    " : "   "}
                {lang.label}
              </span>
              <img src={lang.flag} width={15} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
