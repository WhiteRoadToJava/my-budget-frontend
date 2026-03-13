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
    label: "Courses",
    icon: <FileCode />,
    link: "/admin/courses",
    /*submenu: [
      { label: "See all courses", link: "/admin/courses" },
      { label: "Create new course", link: "/admin/courses/new/1" },
    ],*/
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
