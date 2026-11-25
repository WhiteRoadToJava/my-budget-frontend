import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LANGUAGES, saveLanguage } from "../../../configuration/languages";
import styles from "../../../styles/pages/setting/settingPage.module.scss";
import i18n from "../../../configuration/i18n";
import { getAccounts } from "../../../api/accountService";
import { isArchived } from "../../../utils/accounts/accountList";
import { usePreferences, useUpdatePreferences } from "../../../hooks/usePreferences";
import SearchableDropDown from "../../elements/SearchableDropDown";
const WEEK_DAYS = ["SATURDAY", "SUNDAY", "MONDAY"];
const accountLabel = (account) => `${account.name} (${account.currency})`;
import { useCurrencies } from "../../../hooks/useCurrencies";
import CurrencyLabel from "../../currencies/CurrencyLabel";

// One group of pill buttons. "" is the "not chosen" pill, which clears the value.
const Choices = ({ id, title, options, value, onChoose, disabled }) => (
  <div>
    <p className={styles.label} id={id}>{title}</p>
    <div className={styles.choices} role="group" aria-labelledby={id}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.choice}
          lang={option.lang}
          aria-pressed={(value ?? "") === option.value}
          disabled={disabled}
          onClick={() => onChoose(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

// The app's language, base currency, first day of the week and default account.
// Every choice is saved on the server at once, so it follows the user to every device.
const PreferencesSection = () => {
  const [language, setLanguage] = useState(i18n.language);
  const { preferences, isLoading, isError } = usePreferences();
  const { codes } = useCurrencies();
  const { mutate, isPending, isSuccess, isError: saveFailed } = useUpdatePreferences();

  const { data: accountsData } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const activeAccounts = (accountsData?.accounts ?? []).filter((account) => !isArchived(account));

  // the navbar can change the language too
  useEffect(() => {
    const follow = (code) => setLanguage(code);
    i18n.on("languageChanged", follow);
    return () => i18n.off("languageChanged", follow);
  }, []);

  // useLanguageSync saves the language on the server when it changes
  const chooseLanguage = (code) => {
    i18n.changeLanguage(code);
    saveLanguage(code);
  };

  const save = (field) => (value) => {
    if ((preferences[field] ?? "") !== value) mutate({ [field]: value });
  };

  const notChosen = { value: "", label: i18n.t("settings.preferences.notChosen") };
  const busy = isLoading || isPending;

  // the search list holds texts, so each account is found again by its text
  const accountLabels = activeAccounts.map(accountLabel);
  const noAccount = i18n.t("settings.preferences.notChosen");
  const defaultAccount = activeAccounts.find((account) => account.id === preferences.defaultAccountId);
  const chooseAccount = (label) => {
    if (busy) return;
    const account = activeAccounts.find((a) => accountLabel(a) === label);
    save("defaultAccountId")(account ? account.id : "");
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{i18n.t("settings.preferences.title")}</h2>

      <Choices
        id="settings-language"
        title={i18n.t("settings.preferences.language")}
        options={LANGUAGES.map((lang) => ({ value: lang.code, label: lang.native, lang: lang.code }))}
        value={language}
        onChoose={chooseLanguage}
      />

      {isError ? (
        <p className={styles.error} role="alert">{i18n.t("settings.preferences.loadError")}</p>
      ) : (
        <>
          <Choices
            id="settings-currency"
            title={i18n.t("settings.preferences.baseCurrency")}
            options={[notChosen, ...codes.map((code) => ({ value: code, label: <CurrencyLabel code={code} /> }))]}            value={preferences.baseCurrency}
            onChoose={save("baseCurrency")}
            disabled={busy}
          />

          <Choices
            id="settings-first-day"
            title={i18n.t("settings.preferences.firstDayOfWeek")}
            options={[
              { value: "", label: i18n.t("settings.preferences.byLanguage") },
              ...WEEK_DAYS.map((day) => ({ value: day, label: i18n.t(`settings.preferences.days.${day}`) })),
            ]}
            value={preferences.firstDayOfWeek}
            onChoose={save("firstDayOfWeek")}
            disabled={busy}
          />

          <div className={styles.accountPicker}>
            <SearchableDropDown
              label={i18n.t("settings.preferences.defaultAccount")}
              placeholder={i18n.t("settings.preferences.notChosen")}
              searchPlaceholder={i18n.t("dropDown.searchAccount")}
              name="defaultAccount"
              list={[noAccount, ...accountLabels]}
              value={defaultAccount ? accountLabel(defaultAccount) : ""}
              onChange={(e) => chooseAccount(e.target.value)}
            />
            {activeAccounts.length === 0 && <p className={styles.label}>{i18n.t("settings.preferences.noAccounts")}</p>}
          </div>

          {saveFailed && <p className={styles.error} role="alert">{i18n.t("settings.preferences.saveError")}</p>}
          {isSuccess && !isPending && <p className={styles.saved} role="status">{i18n.t("settings.preferences.saved")}</p>}
        </>
      )}
    </section>
  );
};

export default PreferencesSection;