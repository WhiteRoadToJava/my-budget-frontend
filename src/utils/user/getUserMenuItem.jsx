import Calendar from "../../components/icons/calendar/Calendar.jsx";
import Home from "../../components/icons/interface/Home";
import FileCode from "../../components/icons/file_code/FolderCode";
import SettingsIcon from "../../components/sidebar/icons/SettingsIcon";
import i18n from "../../configuration/i18n.js";

export const getUserMenuItems = () => [   // ← now a function
  { label: i18n.t("menu.overview"),     icon: <Home />,         link: "/user/" },
  { label: i18n.t("menu.accounts"),     icon: <FileCode />,     link: "/user/accounts" },
  { label: i18n.t("menu.expenses"),     icon: <FileCode />,     link: "/user/expenses" },
  { label: i18n.t("menu.incomes"),      icon: <FileCode />,     link: "/user/incomes" },
  { label: i18n.t("menu.transactions"), icon: <FileCode />,     link: "/user/transactions" },
  { label: i18n.t("menu.calendar"),     icon: <Calendar />,     link: "/user/calendar" },
  { label: i18n.t("menu.settings"),     icon: <SettingsIcon />, link: "/user/settings" },
];
