import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styles from "../styles/layout/navbar.module.scss";
import LanguageSelector from "./elements/LanguageSelector";
import Menu from "./icons/interface/Menu";
import { getMySubscription } from "../api/subscriptionService";
import { useAuth } from "../contexts/AuthContext";
import { useDismiss } from "../utils/useDismiss";
import i18n from "../configuration/i18n";

// "Good morning" / "Good afternoon" / "Good evening" by the user's clock
const greetingKey = (hour = new Date().getHours()) =>
  hour < 12 ? "greeting.morning" : hour < 18 ? "greeting.afternoon" : "greeting.evening";

// shown only when it matters: trial, last week, grace days, read only
const SubscriptionChip = () => {
  const { data: info } = useQuery({ queryKey: ["subscription"], queryFn: getMySubscription, staleTime: 5 * 60 * 1000 });
  if (!info) return null;
  const { status, daysLeft } = info;
  const soon = daysLeft != null && daysLeft <= 7;
  if (status === "NONE" || (status === "ACTIVE" && !soon)) return null;

  const label =
    status === "EXPIRED" ? i18n.t("nav.readOnly")
      : status === "GRACE" ? i18n.t("nav.renew")
        : status === "TRIAL" ? i18n.t("nav.trialDays", { count: Math.max(daysLeft ?? 0, 0) })
          : i18n.t("nav.daysLeft", { count: Math.max(daysLeft ?? 0, 0) });

  return (
    <Link to="/user/subscription" className={styles.chip} data-status={status}
      title={i18n.t("subscription.title")}>
      {label}
    </Link>
  );
};

const UserMenu = ({ name, email, initial }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  useDismiss(containerRef, open, () => setOpen(false), buttonRef);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const signOut = async () => {
    setOpen(false);
    try {
      await logout();
    } finally {
      navigate("/auth/login");
    }
  };

  return (
    <div className={styles.userMenu} ref={containerRef}>
      <button ref={buttonRef} type="button" className={styles.avatar} onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu" aria-expanded={open} aria-label={i18n.t("nav.userMenu")}>
        {initial}
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <strong>{name}</strong>
            {email && <span>{email}</span>}
          </div>
          <button type="button" role="menuitem" className={styles.dropdownItem} onClick={() => go("/user/settings")}>
            {i18n.t("menu.settings")}
          </button>
          <button type="button" role="menuitem" className={styles.dropdownItem} onClick={() => go("/user/subscription")}>
            {i18n.t("subscription.title")}
          </button>
          <button type="button" role="menuitem" className={`${styles.dropdownItem} ${styles.danger}`} onClick={signOut}>
            {i18n.t("sidebar.logout")}
          </button>
        </div>
      )}
    </div>
  );
};

const NavBar = ({ profiles, onMenuButtonClick }) => {
  const user = profiles?.data ?? profiles ?? {};
  const firstName = user.firstname || user.firstName || (user.fullname ?? "").split(" ")[0] || "";
  const fullName = user.fullname || [user.firstname, user.lastname].filter(Boolean).join(" ") || user.username || "";
  const initial = (firstName || fullName || user.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className={styles.navbarContainer}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuButtonClick}
        aria-label={i18n.t("sidebar.openMenu")}
      >
        <Menu />
      </button>

      <p className={styles.greeting}>
        {i18n.t(greetingKey())}
        {firstName && <strong>{i18n.t("nav.nameSeparator")}{firstName}</strong>}
      </p>

      <div className={styles.iconsContainer}>
        <SubscriptionChip />
        <LanguageSelector />
        <UserMenu name={fullName || firstName} email={user.username} initial={initial} />
      </div>
    </div>
  );
};

export default NavBar;
