import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileSection from "../../../components/user/setting/ProfileSection";
import SecuritySection from "../../../components/user/setting/SecuritySection";
import PreferencesSection from "../../../components/user/setting/PreferencesSection";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import styles from "../../../styles/pages/setting/settingPage.module.scss";
import i18n from "../../../configuration/i18n";

const TABS = [
  { id: "profile", label: "settings.profile.title" },
  { id: "security", label: "settings.security.title" },
  { id: "preferences", label: "settings.preferences.title" },
];

// pages kept elsewhere that belong to the user's own setup
const LINKS = [
  { to: "/user/categories", label: "menu.categories" },
  { to: "/user/exchange-rates", label: "menu.exchangeRates" },
  { to: "/user/subscription", label: "subscription.title" },
];

const SettingPage = () => {
  const [tab, setTab] = useState("profile");
  const { data: user, isLoading, isError } = useCurrentUser();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{i18n.t("menu.settings")}</h1>

      <div className={styles.tabs} role="tablist" aria-label={i18n.t("menu.settings")}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`settings-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="settings-panel"
            className={styles.tab}
            onClick={() => setTab(t.id)}
          >
            {i18n.t(t.label)}
          </button>
        ))}
      </div>

      <div id="settings-panel" role="tabpanel" aria-labelledby={`settings-tab-${tab}`} className={styles.panel}>
        {tab === "profile" &&
          (isLoading ? (
            <p>{i18n.t("messages.loading")}</p>
          ) : isError || !user ? (
            <p className={styles.error}>{i18n.t("settings.loadError")}</p>
          ) : (
            <ProfileSection key={user.username} user={user} />
          ))}
        {tab === "security" && <SecuritySection />}
        {tab === "preferences" && <PreferencesSection />}
      </div>

      <nav className={styles.links} aria-label={i18n.t("settings.more")}>
        <h2 className={styles.sectionTitle}>{i18n.t("settings.more")}</h2>
        <ul>
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{i18n.t(link.label)}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SettingPage;