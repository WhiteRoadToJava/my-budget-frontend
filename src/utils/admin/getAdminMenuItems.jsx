import Calendar from "../../components/icons/calendar/Calendar.jsx";
import Home from "../../components/icons/interface/Home";
import FileCode from "../../components/icons/file_code/FolderCode";
import SettingsIcon from "../../components/sidebar/icons/SettingsIcon";


export const getAdminMenuItems = [
  {
    label: "Overview",
    icon: <Home />,
    link: "/admin",
  },
  {
    label:"Users",
    icon: <Calendar/>,
    link: "/admin/users"
  },

  {
    label: "Calendar",
    icon: <Calendar />,
  },
  {
    label: "Settings",
    icon: <SettingsIcon />,
  },
];
