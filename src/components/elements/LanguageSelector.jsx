import React, { useRef, useState } from "react";
import i18n from "../../configuration/i18n";
import { LANGUAGES, saveLanguage } from "../../configuration/languages";
import { useDismiss } from "../../utils/useDismiss";
import styles from "../../styles/elements/languageSelector.module.scss";

const Globe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"
      stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

// Language names in their own language, no flags (a language is not a country).
// compact: only the short code on the button (the navbar on small screens).
const LanguageSelector = ({ compact = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  useDismiss(containerRef, open, () => setOpen(false), buttonRef);

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const choose = (code) => {
    // direction and lang follow from the languageChanged listener in configuration/i18n.js
    i18n.changeLanguage(code);
    saveLanguage(code);
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${i18n.t("languageSelector.label")}: ${current.native}`}
      >
        <Globe />
        <span className={compact ? styles.short : undefined}>{compact ? current.short : current.native}</span>
      </button>

      {open && (
        <ul className={styles.options} role="listbox" aria-label={i18n.t("languageSelector.label")}>
          {LANGUAGES.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.code === current.code}>
              <button type="button" className={styles.option} lang={lang.code} dir={lang.dir}
                onClick={() => choose(lang.code)}>
                <span>{lang.native}</span>
                {lang.code === current.code && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
