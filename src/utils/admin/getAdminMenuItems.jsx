import Home from "../../components/icons/interface/Home";
import i18n from "../../configuration/i18n";

// a function, so the labels follow the current language
export const getAdminMenuItems = () => [
  { label: i18n.t("admin.menuUsers"), icon: <Home />, link: "/admin/users" },
  { label: i18n.t("admin.menuRequests"), icon: <Home />, link: "/admin/requests" },
];
